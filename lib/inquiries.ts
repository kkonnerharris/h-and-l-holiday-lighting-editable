import { promises as fs } from "node:fs";
import path from "node:path";

export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  timing: string;
  description: string;
  contacted?: boolean;
};

const dataFile = path.join(process.cwd(), "data", "inquiries.json");

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function requireStorage() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Supabase storage is required in production. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

export async function saveInquiry(inquiry: Inquiry) {
  const supabase = supabaseConfig();
  if (supabase) {
    const response = await fetch(`${supabase.url}/rest/v1/inquiries`, {
      method: "POST",
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inquiry),
    });
    if (!response.ok) throw new Error("Unable to save inquiry");
    return;
  }

  requireStorage();
  const current = await readLocalInquiries();
  current.unshift(inquiry);
  await fs.writeFile(dataFile, JSON.stringify(current, null, 2), "utf8");
}

export async function listInquiries(): Promise<Inquiry[]> {
  const supabase = supabaseConfig();
  if (supabase) {
    const response = await fetch(`${supabase.url}/rest/v1/inquiries?select=*&order=created_at.desc`, {
      cache: "no-store",
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
      },
    });
    if (!response.ok) throw new Error("Unable to load inquiries");
    return response.json();
  }

  requireStorage();
  return readLocalInquiries();
}

export async function setInquiryContacted(id: string, contacted: boolean) {
  const supabase = supabaseConfig();
  if (supabase) {
    const response = await fetch(`${supabase.url}/rest/v1/inquiries?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contacted }),
    });
    if (!response.ok) throw new Error("Unable to update inquiry");
    return;
  }

  requireStorage();
  const current = await readLocalInquiries();
  const updated = current.map((inquiry) => inquiry.id === id ? { ...inquiry, contacted } : inquiry);
  await fs.writeFile(dataFile, JSON.stringify(updated, null, 2), "utf8");
}

async function readLocalInquiries(): Promise<Inquiry[]> {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf8")) as Inquiry[];
  } catch {
    return [];
  }
}
