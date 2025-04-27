"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AddProjectButton() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link 
      href="/projets/add" 
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      Ajouter un projet
    </Link>
  );
} 