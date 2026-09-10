import type { Metadata } from "next";
import { assetPath } from "../../lib/asset-path";

export const metadata: Metadata = { title: "Inquiry Inbox | H & L Holiday Lighting" };

export default function AdminPage() {
  const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
  return (
    <main className="admin-shell admin-login">
      <a href={assetPath("/")} className="admin-back">Back to website</a>
      <section className="admin-login-card">
        <p>H &amp; L ADMIN</p>
        <h1>Your inquiry sheet</h1>
        <p className="admin-sheet-copy">Sign in to the Google account that owns the private inquiry sheet to review new messages and mark customers as contacted.</p>
        {sheetUrl ? <a className="button button-gold" href={sheetUrl}>Open inquiry sheet</a> : <p className="admin-error">The inquiry sheet link has not been configured yet.</p>}
      </section>
    </main>
  );
}
