"use client";

import { Administrateur } from "@/types/Administrateur";
import { getAirtableAdministrateurs } from "@/utils/airtable";
import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "../actions";

export default function Administrateurs() {
  const [administrateurs, setAdministrateurs] = useState<Administrateur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAdministrateurs = async () => {
    try {
      const administrateurs = await getAirtableAdministrateurs();
      setAdministrateurs(administrateurs as Administrateur[]);
    } catch (error) {
      console.error("Error fetching administrators:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdministrateurs();
  }, []);

  if (loading) {
    return <div className="p-8">Chargement des administrateurs...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Administrateurs</h1>
        <div className="flex gap-4">
          <Link href="/administrateurs/hash-passwords" className="text-blue-600 hover:text-blue-800">
            Hacher les mots de passe
          </Link>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Retour à l'accueil
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-red-600 hover:text-red-800"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {administrateurs.map((administrateur) => (
          <div 
            key={administrateur.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">
              {administrateur.fields.Nom} {administrateur.fields.Prénom}
            </h2>
            <p className="text-gray-600">{administrateur.fields.Email}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 