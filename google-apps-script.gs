const RECIPIENT_EMAIL = "konnerharris4@gmail.com";

function doPost(e) {

  if (!e || !e.postData || !e.postData.contents) {
    return jsonResponse_({ ok: false, error: "Missing request body" });
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheets()[0];
  const data = JSON.parse(e.postData.contents);
  const receivedAt = new Date();

  ensureHeaders_(sheet);
  sheet.appendRow([
    receivedAt,
    data.name || "",
    data.phone || "",
    data.email || "",
    data.address || "",
    data.timing || "Flexible",
    data.description || "",
    false,
    "Pending",
  ]);

  const row = sheet.getLastRow();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.getRange(row, headers.indexOf("Budget (USD)") + 1)
    .setRichTextValue(SpreadsheetApp.newRichTextValue().setText(String(data.budget || "")).build());
  // A preview formatting failure must not prevent the inquiry notification.
  try {
    writeGalleryPhoto_(sheet, row, data.projectPhoto);
  } catch (error) {
    console.error("Gallery photo formatting failed: " + error.message);
  }
  try {
    sendNewInquiryEmail_(data, receivedAt, spreadsheet.getUrl());
    sheet.getRange(row, 9).setValue("Sent " + receivedAt.toISOString());
  } catch (error) {
    sheet.getRange(row, 9).setValue("Email failed: " + error.message);
    throw error;
  }

  return jsonResponse_({ ok: true });
}

function ensureHeaders_(sheet) {
  const headers = ["Received", "Name", "Phone", "Email", "Address", "Timing", "Description", "Contacted", "Notification"];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  if (!sheet.getRange(1, 9).getValue()) {
    sheet.getRange(1, 9).setValue("Notification");
  }
  ["Get this look photo URL", "Get this look preview", "Budget (USD)"].forEach(function (header) {
    const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (existing.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
    }
  });
}

function writeGalleryPhoto_(sheet, row, photoUrl) {
  const url = String(photoUrl || "").trim();
  if (!/^https:\/\/[^\s]+$/i.test(url)) return;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const urlColumn = headers.indexOf("Get this look photo URL") + 1;
  const previewColumn = headers.indexOf("Get this look preview") + 1;
  const linkCell = sheet.getRange(row, urlColumn);
  linkCell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(url).setLinkUrl(url).build());
  // IMAGE reads the public website URL; no Google sign-in is needed for the photo.
  // Sheets cannot render SVG images, so retain their public link without a preview.
  if (!/\.svg(?:[?#]|$)/i.test(url)) {
    sheet.getRange(row, previewColumn).setFormula('=IMAGE(' + linkCell.getA1Notation() + ',1)');
    sheet.setRowHeight(row, 140);
    sheet.setColumnWidth(previewColumn, 200);
  }
}

// Run once in Apps Script to add previews to inquiries already in the sheet.
function backfillGalleryPhotos() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  ensureHeaders_(sheet);
  if (sheet.getLastRow() < 2) return;
  const descriptions = sheet.getRange(2, 7, sheet.getLastRow() - 1, 1).getValues();
  descriptions.forEach(function (entry, index) {
    const match = String(entry[0]).match(/Project photo:\s*(https:\/\/[^\s]+)/i);
    if (match) writeGalleryPhoto_(sheet, index + 2, match[1]);
  });
}

function notificationRecipient_() {
  const configuredEmail = PropertiesService.getScriptProperties().getProperty("NOTIFICATION_EMAIL");
  return String(configuredEmail || "").trim() ||
    String(RECIPIENT_EMAIL || "").trim() || Session.getEffectiveUser().getEmail();
}

// Run in the editor to authorize email access and inspect setup without sending mail.
function checkNotificationSetup() {
  const recipient = notificationRecipient_();
  if (!recipient) throw new Error("Add the NOTIFICATION_EMAIL Script Property.");
  const remainingQuota = MailApp.getRemainingDailyQuota();
  console.log("Notification recipient: " + recipient);
  console.log("Remaining daily email recipient quota: " + remainingQuota);
  if (remainingQuota < 1) throw new Error("Google Apps Script email quota has been reached for today.");
}

function sendNewInquiryEmail_(data, receivedAt, sheetUrl) {
  const recipient = notificationRecipient_();

  if (!recipient) {
    throw new Error("No notification recipient. Add the NOTIFICATION_EMAIL Script Property.");
  }
  if (MailApp.getRemainingDailyQuota() < 1) {
    throw new Error("Google Apps Script email quota has been reached for today.");
  }

  const name = String(data.name || "New customer");
  const phone = String(data.phone || "Not provided");
  const email = String(data.email || "Not provided");
  const address = String(data.address || "Not provided");
  const timing = String(data.timing || "Flexible");
  const budget = String(data.budget || "Not provided");
  const description = String(data.description || "Not provided");
  const subject = "New H & L website inquiry - " + name;
  const body = [
    "A new inquiry was submitted through the H & L Holiday Lighting website.", "",
    "Name: " + name, "Phone: " + phone, "Email: " + email,
    "Address: " + address, "Preferred timing: " + timing, "Budget (USD): " + budget, "",
    "Project description:", description, "",
    "Received: " + receivedAt.toLocaleString(),
    "Open the inquiry sheet: " + sheetUrl,
  ].join("\n");

  const message = {
    to: recipient,
    name: "H & L Website",
    subject: subject,
    body: body,
    htmlBody:
      '<div style="font-family:Arial,sans-serif;max-width:620px;color:#172333">' +
      '<h2 style="color:#0b1a2b">New website inquiry</h2>' +
      '<p>A new customer submitted the H &amp; L Holiday Lighting contact form.</p>' +
      '<table style="width:100%;border-collapse:collapse">' +
      emailRow_("Name", name) + emailRow_("Phone", phone) + emailRow_("Email", email) +
      emailRow_("Address", address) + emailRow_("Preferred timing", timing) +
      emailRow_("Budget (USD)", budget) +
      '</table><h3 style="margin-top:24px">Project description</h3>' +
      '<p style="white-space:pre-wrap;line-height:1.6">' + escapeHtml_(description) + '</p>' +
      '<p style="margin-top:28px"><a href="' + escapeHtml_(sheetUrl) + '" style="background:#caa66a;color:#0b1a2b;padding:12px 18px;text-decoration:none;font-weight:bold">Open inquiry sheet</a></p>' +
      '<p style="margin-top:24px;color:#6f7780;font-size:12px">Received ' + escapeHtml_(receivedAt.toLocaleString()) + '</p></div>',
  };

  if (data.email) message.replyTo = String(data.email);
  MailApp.sendEmail(message);
}

function emailRow_(label, value) {
  return '<tr><td style="padding:9px;border-bottom:1px solid #e3e6e8;color:#6f7780;width:150px">' +
    escapeHtml_(label) + '</td><td style="padding:9px;border-bottom:1px solid #e3e6e8">' +
    escapeHtml_(value) + '</td></tr>';
}

function escapeHtml_(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
