"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type EditButtonProps = {
  projectId: string;
};

export default function EditButton({ projectId }: EditButtonProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link 
      href={`/projets/edit/${projectId}`}
      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 013.536 3.536L6 21H3v-3L16.732 6.732z" />
      </svg>
      Éditer
    </Link>
  );
} 