const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

async function main() {
  const client = { exports: {}, AbortSignal, fetch };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, 'lib/submit-inquiry.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, client);
  const { submitInquiry } = client.exports;
  const settings = { sheetsUrl: 'https://example.com/script' };
  const body = { name: 'Offline test', budget: '$850', projectPhoto: 'https://example.com/photo.jpg' };
  for (const confirmation of [true, false, undefined]) {
    let calls = 0;
    const result = await submitInquiry(body, settings, async (url, options) => {
      calls++;
      assert.equal(url, settings.sheetsUrl);
      assert.deepEqual(JSON.parse(options.body), body);
      return { ok: true, json: async () => ({ ok: true, notificationSent: confirmation }) };
    });
    assert.equal(calls, 1, 'Only Google is contacted');
    assert.equal(result.savedToSheet, true);
    assert.equal(result.notificationSent, confirmation === true);
  }
  await assert.rejects(() => submitInquiry(body, {}, async () => { throw Error('Must not request'); }), /not configured/);
  await assert.rejects(() => submitInquiry(body, settings, async () => ({ ok: true, json: async () => ({ ok: false }) })));
  await assert.rejects(() => submitInquiry(body, settings, async () => { throw Error('Network failure'); }));

  let recipient = 'old@example.com';
  let quota = 100;
  let sent;
  let rowCount = 0;
  const statuses = [];
  const range = { setRichTextValue() {}, getValues: () => [['Budget (USD)']], setValue: value => statuses.push(value) };
  const sheet = { appendRow() { rowCount++; }, getLastRow: () => rowCount, getLastColumn: () => 1, getRange: () => range };
  const server = {
    console: { log() {}, error() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => recipient, setProperty: (_, value) => { recipient = value; } }) },
    MailApp: { getRemainingDailyQuota: () => quota, sendEmail: message => { sent = message; } },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheets: () => [sheet], getUrl: () => 'https://example.com/sheet' }),
      newRichTextValue: () => ({ setText: () => ({ build: () => ({}) }) }) },
  };
  vm.createContext(server);
  vm.runInContext(fs.readFileSync(path.join(root, 'google-apps-script.gs'), 'utf8'), server);
  server.jsonResponse_ = value => value;
  server.ensureHeaders_ = () => {};
  server.writeGalleryPhoto_ = () => {};
  server.setupLeadNotifications();
  assert.equal(recipient, 'Rickyhurleyy@gmail.com');
  assert.equal(sent, undefined, 'Setup must not send email');
  const event = { postData: { contents: JSON.stringify(body) } };
  assert.equal(server.doPost(event).notificationSent, true);
  assert.equal(sent.to, recipient);
  assert.match(sent.body, /\$850/);
  assert.match(statuses.at(-1), /^Sent /);
  quota = 0;
  const failedMail = server.doPost(event);
  assert.equal(failedMail.ok, true, 'Saved leads survive email failure');
  assert.equal(failedMail.notificationSent, false);
  assert.equal(rowCount, 2);
  assert.match(statuses.at(-1), /^Email failed:/);
  console.log('PASS: Google-only submission, explicit email confirmation, recipient setup, lead payload, quota failure. No real requests or emails.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
