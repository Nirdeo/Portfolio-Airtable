"use server";
 
import Airtable from "airtable";

// Check if environment variables are defined
if (!process.env.AIRTABLE_KEY) {
  throw new Error("AIRTABLE_KEY is not defined in environment variables");
}

if (!process.env.AIRTABLE_BASE) {
  throw new Error("AIRTABLE_BASE is not defined in environment variables");
}
 
const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE || '');

export async function getAirtableAdministrateurs() {
  const administrateurs = await base.table("Administrateurs").select().all();

  return (await administrateurs).map((admin) => ({
    id: admin.id,
    fields: admin.fields,
  }));
}