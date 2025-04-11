"use server";

import Airtable from "airtable";
import bcrypt from "bcryptjs";
import { getAirtableAdministrateurs } from "./airtable";

if (!process.env.AIRTABLE_KEY) {
  throw new Error("AIRTABLE_KEY is not defined in environment variables");
}

if (!process.env.AIRTABLE_BASE) {
  throw new Error("AIRTABLE_BASE is not defined in environment variables");
}

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE || '');

const SALT_ROUNDS = 10;

export async function hashAdminPassword(adminId: string, plainPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    
    const updatedAdmin = await base.table("Administrateurs").update(adminId, {
      "Mot de passe": hashedPassword,
    });
    
    return {
      success: true,
      admin: {
        id: updatedAdmin.id,
        fields: updatedAdmin.fields,
      }
    };
  } catch (error) {
    console.error("Error hashing admin password:", error);
    return {
      success: false, 
      error: "Failed to hash and update password"
    };
  }
}

export async function hashAllPlaintextPasswords() {
  try {
    const admins = await getAirtableAdministrateurs();
    
    const results = {
      success: 0,
      skipped: 0,
      failed: 0,
      details: [] as Array<{id: string, status: string, message?: string}>
    };
    
    for (const admin of admins) {
      const password = admin.fields["Mot de passe"];
      
      if (!password || typeof password !== 'string') {
        results.skipped++;
        results.details.push({
          id: admin.id,
          status: "skipped",
          message: "No password found"
        });
        continue;
      }
      
      if (password.startsWith('$2a$') || password.startsWith('$2b$')) {
        results.skipped++;
        results.details.push({
          id: admin.id,
          status: "skipped",
          message: "Password already hashed"
        });
        continue;
      }
      
      const result = await hashAdminPassword(admin.id, password);
      
      if (result.success) {
        results.success++;
        results.details.push({
          id: admin.id,
          status: "success"
        });
      } else {
        results.failed++;
        results.details.push({
          id: admin.id,
          status: "failed",
          message: result.error
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error in hashAllPlaintextPasswords:", error);
    return {
      success: 0,
      skipped: 0,
      failed: -1,
      error: "Failed to process passwords"
    };
  }
} 