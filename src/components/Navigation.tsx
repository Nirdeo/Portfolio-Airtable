"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-800 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Mon Application</div>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className={`hover:underline ${
                pathname === "/" ? "font-bold" : ""
              }`}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              href="/administrateurs"
              className={`hover:underline ${
                pathname === "/administrateurs" ? "font-bold" : ""
              }`}
            >
              Administrateurs
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
} 