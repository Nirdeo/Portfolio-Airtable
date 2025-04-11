"use client";

import { useState } from "react";
import Link from "next/link";
import { hashAllPasswords, HashPasswordResult, HashPasswordSuccess } from "./actions";

export default function HashPasswordsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HashPasswordSuccess | null>(null);
  const [error, setError] = useState("");

  async function handleHashPasswords() {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await hashAllPasswords();

      if ('error' in data) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError((err as Error).message || "An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hachage des mots de passe</h1>
        <Link
          href="/administrateurs"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Retour aux administrateurs
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          Cette page vous permet de hacher tous les mots de passe en texte brut dans la table Administrateurs. 
          Les mots de passe déjà hachés (commençant par $2a$ ou $2b$) seront ignorés.
        </p>
        
        <div className="mb-6">
          <button
            onClick={handleHashPasswords}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
          >
            {isLoading ? "Hachage en cours..." : "Hacher les mots de passe"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">Résultat du hachage</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded">
                <span className="block text-sm text-green-800">Réussis</span>
                <span className="text-xl font-semibold">{result.success}</span>
              </div>
              
              <div className="bg-yellow-100 p-3 rounded">
                <span className="block text-sm text-yellow-800">Ignorés</span>
                <span className="text-xl font-semibold">{result.skipped}</span>
              </div>
              
              <div className="bg-red-100 p-3 rounded">
                <span className="block text-sm text-red-800">Échoués</span>
                <span className="text-xl font-semibold">{result.failed}</span>
              </div>
              
              <div className="bg-blue-100 p-3 rounded">
                <span className="block text-sm text-blue-800">Total</span>
                <span className="text-xl font-semibold">
                  {result.success + result.skipped + Math.max(0, result.failed)}
                </span>
              </div>
            </div>

            {result.details && result.details.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-medium mb-2">Détails</h4>
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.details.map((detail, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {detail.id}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                detail.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : detail.status === "skipped"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {detail.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {detail.message || ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 