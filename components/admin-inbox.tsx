"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Check, CheckCircle2, Inbox, LockKeyhole, LogOut, Mail, MapPin, Phone } from "lucide-react";
import type { Inquiry } from "../lib/inquiries";

type InquiryFilter = "all" | "new" | "contacted";

export function AdminInbox() {
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [filter, setFilter] = useState<InquiryFilter>("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function toggleContacted(inquiry: Inquiry) {
    const contacted = !inquiry.contacted;
    const response = await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": adminPassword },
      body: JSON.stringify({ id: inquiry.id, contacted }),
    });
    if (!response.ok) {
      setError("Unable to update this inquiry.");
      return;
    }
    setInquiries((current) => current?.map((item) => item.id === inquiry.id ? { ...item, contacted } : item) ?? null);
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/inquiries", { headers: { "x-admin-password": password } });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(response.status === 401 ? "That password isn’t correct." : data.error);
      return;
    }
    setAdminPassword(password);
    setInquiries(data.inquiries);
  }

  const contactedCount = inquiries?.filter((inquiry) => inquiry.contacted).length ?? 0;
  const visibleInquiries = inquiries?.filter((inquiry) => {
    const contacted = Boolean(inquiry.contacted);
    return filter === "all" || (filter === "contacted" ? contacted : !contacted);
  }) ?? [];

  if (inquiries === null) {
    return (
      <main className="admin-shell admin-login">
        <a href="/" className="admin-back"><ArrowLeft /> Back to website</a>
        <form className="admin-login-card" onSubmit={signIn}>
          <span className="admin-lock"><LockKeyhole /></span>
          <p>H &amp; L ADMIN</p>
          <h1>Inquiry inbox</h1>
          <label><span>Admin password</span><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
          {error && <small className="admin-error">{error}</small>}
          <button className="button button-gold" disabled={loading}>{loading ? "Opening…" : "Open inbox"}</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p>H &amp; L HOLIDAY LIGHTING</p><h1>Inquiry inbox</h1></div>
        <div className="admin-header-actions"><span><Inbox /> {inquiries.length} {inquiries.length === 1 ? "message" : "messages"}</span><button onClick={() => { setInquiries(null); setPassword(""); setAdminPassword(""); }}><LogOut /> Lock</button></div>
      </header>
      {inquiries.length === 0 ? (
        <section className="admin-empty"><Inbox /><h2>No inquiries yet</h2><p>New website messages will appear here.</p></section>
      ) : (
        <>
          <section className="admin-summary" aria-label="Inquiry summary">
            <div><strong>{inquiries.length}</strong><span>Total inquiries</span></div>
            <div><strong>{inquiries.length - contactedCount}</strong><span>Need a reply</span></div>
            <div><strong>{contactedCount}</strong><span>Contacted</span></div>
          </section>
          <nav className="admin-filters" aria-label="Filter inquiries">
            {(["all", "new", "contacted"] as InquiryFilter[]).map((option) => (
              <button className={filter === option ? "active" : ""} key={option} onClick={() => setFilter(option)}>{option === "all" ? "All inquiries" : option === "new" ? "Needs reply" : "Contacted"}</button>
            ))}
          </nav>
          {visibleInquiries.length === 0 ? (
            <section className="admin-empty admin-filter-empty"><CheckCircle2 /><h2>All caught up</h2><p>No inquiries match this filter.</p></section>
          ) : (
            <section className="admin-list">
              {visibleInquiries.map((inquiry) => {
                const contacted = Boolean(inquiry.contacted);
                return (
                  <article className={`admin-card ${contacted ? "is-contacted" : ""}`} key={inquiry.id}>
                    <div className="admin-card-head"><div><h2>{inquiry.name}</h2><time>{new Date(inquiry.created_at).toLocaleString()}</time></div><span>{inquiry.timing}</span></div>
                    <div className="admin-contact">
                      <a href={`tel:${inquiry.phone}`}><Phone /> {inquiry.phone}</a>
                      {inquiry.email && <a href={`mailto:${inquiry.email}`}><Mail /> {inquiry.email}</a>}
                      {inquiry.address && <span><MapPin /> {inquiry.address}</span>}
                    </div>
                    <p className="admin-description">{inquiry.description}</p>
                    <button className="contacted-toggle" onClick={() => toggleContacted(inquiry)}><span className="contacted-check">{contacted && <Check size={14} />}</span>{contacted ? "Contacted" : "Mark as contacted"}</button>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
}
