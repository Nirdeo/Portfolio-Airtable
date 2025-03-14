"use client";

import { Administrateur } from "@/types/Administrateur";
import { getAirtableAdministrateurs } from "@/utils/airtable";
import { useEffect, useState } from "react";

export default function Administrateurs() {
  const [administrateurs, setAdministrateurs] = useState<Administrateur[]>([]);
  const getAdministrateurs = async () => {
    const administrateurs = await getAirtableAdministrateurs();
    setAdministrateurs(administrateurs as Administrateur[]);
  };

  useEffect(() => {
    getAdministrateurs();
  }, []);

  return (
    <>
    <h1>Liste des Administrateurs</h1>
    {administrateurs.map((administrateur) => (
      <div key={administrateur.id}>
        <h2>{administrateur.fields.Nom} {administrateur.fields.Prénom}</h2>
      </div>
    ))}
    </>
  );
} 