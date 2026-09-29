type Inquiry = Record<string, unknown>;

export async function submitInquiry(
  body: Inquiry,
  settings: { sheetsUrl?: string },
  request: typeof fetch = fetch,
) {
  if (!settings.sheetsUrl) throw new Error('Google Apps Script is not configured');
  const response = await request(settings.sheetsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
  });
  const result = await response.json();
  if (!response.ok || result.ok !== true) throw new Error('Inquiry save could not be confirmed');
  // A saved lead remains saved even if Google cannot send its email alert.
  // Older deployments must not be treated as proof of email delivery.
  return { savedToSheet: true, notificationSent: result.notificationSent === true };
}
