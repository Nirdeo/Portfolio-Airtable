"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Administrateur } from "@/types/Administrateur";
import { getAirtableAdministrateurs } from "@/utils/airtable";

const TOKEN_NAME = "auth_token";
const JWT_SECRET = process.env.JWT_SECRET || "";
const TOKEN_EXPIRY = "1d";

export async function createToken(admin: any) {
  if (!admin.id || !admin.fields || !admin.fields.Email || 
      !admin.fields.Nom || !admin.fields.Prénom) {
    throw new Error("Admin record missing required fields");
  }
  
  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.fields.Email,
      name: `${admin.fields.Prénom} ${admin.fields.Nom}`,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  return token;
}

export async function setAuthCookie(token: string) {
  const cookiesStore = await cookies();
  cookiesStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 86400,
  });
}

export async function clearAuthCookie() {
  const cookiesStore = await cookies();
  cookiesStore.delete(TOKEN_NAME);
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const admins = await getAirtableAdministrateurs();

    const admin = admins.find(
      (admin) => {
        const adminEmail = admin.fields.Email;
        return typeof adminEmail === 'string' && 
               adminEmail.toLowerCase() === email.toLowerCase();
      }
    );

    if (!admin) {
      return { error: "Invalid email or password" };
    }

    const storedPassword = admin.fields["Mot de passe"];
    if (!storedPassword) {
      return { error: "Account not properly configured" };
    }

    let passwordMatch = false;
    if (
      typeof storedPassword === "string" &&
      (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$"))
    ) {
      passwordMatch = await bcrypt.compare(password, storedPassword);
    } else if (typeof storedPassword === "string") {
      passwordMatch = password === storedPassword;
    }

    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    const token = await createToken(admin);

    await setAuthCookie(token);

    return { success: true, redirectTo: "/administrateurs" };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Authentication failed" };
  }
}

export async function logout() {
  await clearAuthCookie();
  redirect("/login");
}

export async function getAuthStatus() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(TOKEN_NAME)?.value;

  if (!token) {
    return { isAuthenticated: false };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { isAuthenticated: true, user: decoded };
  } catch (error) {
    return { isAuthenticated: false };
  }
}
    
export async function requireAuth() {
  const { isAuthenticated, user } = await getAuthStatus();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return user;
} 