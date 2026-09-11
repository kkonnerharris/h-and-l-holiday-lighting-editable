type Inquiry = Record<string, unknown>;

export async function submitInquiry(
  body: Inquiry,
  settings: { sheetsUrl?: string; notificationEmail: string },
  request: typeof fetch = fetch,
) {
  let savedToSheet = false;
  let notificationSent = false;
  if (settings.sheetsUrl) {
    const response = await request(settings.sheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Inquiry was not saved');
    savedToSheet = true;
    notificationSent = result.notificationSent === true;
  }

  // Older Sheets scripts save the lead without sending mail. Send the alert
  // independently unless the script explicitly confirms that it already did.
  if (!notificationSent) {
    try {
      if (!settings.notificationEmail) throw new Error('Notification email not configured');
      const response = await request(`https://formsubmit.co/ajax/${encodeURIComponent(settings.notificationEmail)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          'Customer Name': body.name,
          'Phone Number': body.phone,
          'Email Address': body.email || 'Not provided',
          'Preferred Timing': body.timing || 'Flexible',
          'Budget (USD)': body.budget || 'Not provided',
          'Property Address': body.address || 'Not provided',
          'Project Description': body.description || '',
          ...(body.projectPhoto ? { 'Lighting Style': body.lightingStyle, 'Project Photo': body.projectPhoto } : {}),
          _subject: `New Lead: ${body.name || 'Quote Request'} - H & L Holiday Lighting`,
          _captcha: 'false',
          _template: 'table',
          ...(body.email ? { _replyto: body.email } : {}),
        }),
        signal: AbortSignal.timeout(30_000),
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== 'true')) throw new Error('Notification was not accepted');
      notificationSent = true;
    } catch (error) {
      if (!savedToSheet) throw error;
      // The lead exists; do not invite a second submission and duplicate it.
    }
  }
  return { savedToSheet, notificationSent };
}
