# Activate Google lead alerts

The website changes are prepared locally. Deploy the Google script before publishing the website switch.

1. Open the existing lead spreadsheet and choose **Extensions > Apps Script**.
2. Replace the existing lead-handler code with `google-apps-script.gs` from this folder and save. Preserve unrelated scripts if the project contains other automations.
3. Select `setupLeadNotifications` and click **Run**. Authorize spreadsheet and email access using the spreadsheet owner's Google account. This sets `NOTIFICATION_EMAIL` to `Rickyhurleyy@gmail.com` and checks the remaining email quota; it does not send a test message.
4. Choose **Deploy > Manage deployments**, edit the existing web app, select **New version**, and deploy. Keep execution as the owner and access set to **Anyone**. Updating the existing deployment keeps its `/exec` URL.
5. Confirm the deployment URL matches the repository's `GOOGLE_SHEETS_URL` variable. If you created a new deployment, update that variable before publishing the website.

The script saves each lead, then sends its details to Ricky through Google MailApp. The sheet's **Notification** column records `Sent` or the email error. The website treats a saved lead with a failed email as a partial success, not as an unsaved request.

Google accepting a message does not prove inbox delivery. A real submission and recipient confirmation are still needed to verify delivery. No test message has been sent during these offline checks.
