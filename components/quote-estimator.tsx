"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import site from "../lib/site-content";
const phone = site.contact.phone;
const phoneHref = `tel:${phone.replace(/[^+0-9]/g, "")}`;
import { ArrowRight, Check } from "lucide-react";
import { useProjectSelection } from "./project-selection";
import { publicPhotoUrl } from "../lib/public-photo-url";
import { submitInquiry } from "../lib/submit-inquiry";

export function QuoteEstimator() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [budgetOption, setBudgetOption] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const { look, setLook } = useProjectSelection();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const notificationEmail = process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL || "konnerharris4@gmail.com";

  useEffect(() => {
    if (!look) return;
    setSubmitted(false);
    const frame = requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      document.getElementById("estimate")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [look]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    if (budgetOption === "custom" && body.budget) {
      body.budget = `$${Number(body.budget).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
    }
    if (body.budget) {
      // Preserve the budget in submissions handled by older Sheets deployments.
      body.description = `${body.description || ""}\n\nBudget (USD): ${body.budget}`;
    }
    if (look) {
      body.lightingStyle = look.alt;
      try {
        body.projectPhoto = publicPhotoUrl(look.image, process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
      } catch {
        setSending(false);
        setError(`This photo isn't available publicly yet. Please call ${phone} to request this look.`);
        return;
      }
      // Keep the reference in the existing description field for Sheets integrations.
      body.description = `${body.description || ""}\n\nRequested gallery look: ${look.alt}\nProject photo: ${body.projectPhoto}`;
    }
    const sheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

    if (!sheetsUrl && !notificationEmail) {
      setSending(false);
      setError(`Online inquiries are not connected yet. Please call ${phone}.`);
      return;
    }

    try {
      const result = await submitInquiry(body, { sheetsUrl, notificationEmail });
      setNeedsConfirmation(!result.notificationSent);

      setSending(false);
      form.reset();
      setBudgetOption("");
      setLook(null);
      setSubmitted(true);
    } catch {
      setSending(false);
      setError(`Something went wrong submitting your information. Please call ${phone}.`);
    }
  }

  if (submitted && !look) {
    return (
      <div className="quote-card quote-success" aria-live="polite">
        <span><Check size={30} /></span>
        <p className="kicker">Request submitted</p>
        <h3>Thanks for reaching out.</h3>
        <p>{needsConfirmation ? `Your request was saved. Please call ${phone} to confirm we received it; there was a problem sending the alert.` : `If you haven’t heard back within 2 days, please call ${phone} in case technical issues prevented your request from reaching us.`}</p>
        <a className="button button-gold" href={phoneHref}>Call {phone}</a>
        <button type="button" onClick={() => setSubmitted(false)}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="quote-card inquiry-card" onSubmit={submit} action={`https://formsubmit.co/${encodeURIComponent(notificationEmail)}`} method="POST">
      <input type="hidden" name="_subject" value="New Quote Request - H & L Holiday Lighting" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      {look && <input type="hidden" name="Selected Gallery Look" value={look.alt} />}
      <div className="quote-card-head"><div><small>QUICK CONTACT</small><h3 ref={headingRef} tabIndex={-1}>Tell us about your home</h3></div></div>
      <p className="inquiry-note">Share your contact details and holiday lighting ideas.</p>
      {look && (
        <div className="inquiry-look">
          <Image src={look.image} alt={look.alt} width={104} height={78} sizes="104px" />
          <div>
            <strong>Your selected look</strong>
            <p>{look.alt}</p>
            <small>We’ll include a public link to this photo with your inquiry.</small>
            <div className="inquiry-look-actions">
              <a href="#work">Choose another look</a>
              <button type="button" onClick={() => { setLook(null); headingRef.current?.focus({ preventScroll: true }); }}>Remove</button>
            </div>
          </div>
        </div>
      )}
      <div className="form-grid contact-grid">
        <label><span>Your name</span><input required name="name" autoComplete="name" placeholder="Jane Smith" /></label>
        <label><span>Phone number</span><input required type="tel" name="phone" autoComplete="tel" placeholder="(618) 555-0123" /></label>
        <label><span>Email address <small>(optional)</small></span><input type="email" name="email" autoComplete="email" placeholder="jane@example.com" /></label>
        <label><span>Preferred timing</span><select name="timing" defaultValue="Flexible"><option>As soon as possible</option><option>Before Thanksgiving</option><option>Early December</option><option>Flexible</option></select></label>
        <label className="full"><span>Property address</span><input name="address" autoComplete="street-address" placeholder="123 Evergreen Lane, Carterville, IL" /></label>
        <label className="full">
          <span>Budget (USD) <small>(optional)</small></span>
          <select name={budgetOption === "custom" ? undefined : "budget"} value={budgetOption} onChange={(event) => setBudgetOption(event.target.value)}>
            <option value="">Select your budget</option>
            <option value="$600–$1,000">$600–$1,000</option>
            <option value="$1,000–$1,500">$1,000–$1,500</option>
            <option value="$1,500+">$1,500+</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        {budgetOption === "custom" && (
          <label className="full"><span>Enter your custom amount (USD)</span><input required autoFocus type="number" name="budget" min="0.01" step="0.01" inputMode="decimal" placeholder="e.g. 850" /></label>
        )}
        <label className="full"><span>Short description</span><textarea required name="description" rows={4} placeholder="Roofline, trees, bushes, fence, colors, or anything else you have in mind." /></label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-gold form-submit" type="submit" disabled={sending}>{sending ? "Sending…" : <>Send my information <ArrowRight size={17} /></>}</button>
      <p className="inquiry-disclaimer">If you haven’t heard back within 2 days, please <a href={phoneHref}>call {phone}</a> in case technical issues prevented your request from reaching us.</p>
    </form>
  );
}
