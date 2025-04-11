"use server";

import { hashAllPlaintextPasswords } from "@/utils/hashPasswords";
import { getAuthStatus } from "@/app/actions";

// Define response types
export type HashPasswordSuccess = {
  success: number;
  skipped: number;
  failed: number;
  details: Array<{id: string, status: string, message?: string}>;
};

export type HashPasswordError = {
  error: string;
};

export type HashPasswordResult = HashPasswordSuccess | HashPasswordError;

export async function hashAllPasswords(): Promise<HashPasswordResult> {
  // Check if the user is authenticated
  const { isAuthenticated } = await getAuthStatus();
  
  if (!isAuthenticated) {
    return { error: "Authentication required" };
  }
  
  try {
    // Hash all plaintext passwords
    const result = await hashAllPlaintextPasswords();
    
    // Check if there's an error field in the result
    if ('error' in result) {
      return { error: result.error };
    }
    
    return result as HashPasswordSuccess;
  } catch (error) {
    console.error("Error hashing passwords:", error);
    return { error: "Failed to hash passwords" };
  }
} 