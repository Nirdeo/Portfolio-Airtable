"use client";

import { Projet } from "@/types/Projet";
import {
  addAirtableProjet,
  getAirtableAdministrateurs,
  getAirtableCommentaires,
} from "@/utils/airtable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

export default function Projets() {
  const [administrateurs, setAdministrateurs] = useState<any[]>([]);
  const [commentaires, setCommentaires] = useState<any[]>([]);
  const [formData, setFormData] = useState<Projet>({
    fields: {
      Nom: "",
      Description: "",
      Technologies: "",
      Lien: "",
      Visuels: [{ url: "" }],
      Promotion: "",
      Administrateur: [],
      Catégorie: [],
      Likes: 0,
      Statut: "Publier",
      Commentaires: [],
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchData = async () => {
      try {
        const [admins, comments] = await Promise.all([
          getAirtableAdministrateurs(),
          getAirtableCommentaires(),
        ]);
        setAdministrateurs(admins.map((admin: any) => ({ id: admin.id, ...admin.fields })));
        setCommentaires(comments.map((c: any) => ({ id: c.id, ...c.fields })));
      } catch {}
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: name === "Visuels" ? [{ url: value }] : value,
      },
    }));
  };

  const handleArrayChange = (
    selectedOptions: any,
    field: "Administrateur" | "Catégorie" | "Commentaires"
  ) => {
    const updatedArray = selectedOptions.map((option: any) => option.value);
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: updatedArray,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addAirtableProjet(formData);
      alert("Projet ajouté avec succès !");
      setFormData({
        fields: {
          Nom: "",
          Description: "",
          Technologies: "",
          Lien: "",
          Visuels: [{ url: "" }],
          Promotion: "",
          Administrateur: [],
          Catégorie: [],
          Likes: 0,
          Statut: "Publier",
          Commentaires: [],
        },
      });
      router.push("/projets");
    } catch {
      alert("Une erreur est survenue lors de l'ajout du projet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const adminOptions = administrateurs.map((admin) => ({
    value: admin.id,
    label: `${admin.Nom} ${admin.Prénom}`,
  }));

  const commentOptions = commentaires.map((comment) => ({
    value: comment.id,
    label: comment.Commentaire,
  }));

  const categorieOptions = [
    { value: "82138", label: "82138" },
    { value: "99076", label: "99076" },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📁 Projets</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ajouter un nouveau projet</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[ 
            { label: "Nom du Projet", name: "Nom", type: "text", placeholder: "Ex: Portfolio étudiant - 2025" },
            { label: "Technologies", name: "Technologies", type: "text", placeholder: "React, Tailwind, Node.js..." },
            { label: "Lien", name: "Lien", type: "url", placeholder: "https://monprojet.com" },
            { label: "URL de l'image", name: "Visuels", type: "url", placeholder: "https://imgur.com/image.png" },
            { label: "Promotion", name: "Promotion", type: "text", placeholder: "Ex: MMI 2025" }
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label htmlFor={field.name} className="text-gray-700 font-medium mb-2">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={field.name === "Visuels" ? formData.fields.Visuels[0].url : (formData.fields[field.name as keyof Projet["fields"]] as string)}
                placeholder={field.placeholder}
                onChange={handleChange}
                className="border-2 border-gray-400 p-4 text-lg text-gray-800 rounded-xl placeholder-gray-500 bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="Description" className="text-gray-700 font-medium mb-2">Description</label>
            <textarea
              id="Description"
              name="Description"
              value={formData.fields.Description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez brièvement le projet, ses objectifs, etc."
              className="border-2 border-gray-400 p-4 text-lg text-gray-800 rounded-xl placeholder-gray-500 bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Administrateurs</label>
            <Select
              isMulti
              options={adminOptions}
              value={adminOptions.filter((option) => formData.fields.Administrateur.includes(option.value))}
              onChange={(selectedOptions) => handleArrayChange(selectedOptions, "Administrateur")}
              className="text-lg"
              placeholder="Sélectionner"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#f7f7f7",
                  borderColor: "#d1d5db",
                }),
                option: (base) => ({
                  ...base,
                  backgroundColor: "#e5e7eb",
                  color: "#333",
                  "&:hover": {
                    backgroundColor: "#ddd",
                  },
                }),
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Catégories</label>
            <Select
              isMulti
              options={categorieOptions}
              value={categorieOptions.filter((option) => formData.fields.Catégorie.includes(option.value))}
              onChange={(selectedOptions) => handleArrayChange(selectedOptions, "Catégorie")}
              className="text-lg"
              placeholder="Sélectionner"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#f7f7f7",
                  borderColor: "#d1d5db",
                }),
                option: (base) => ({
                  ...base,
                  backgroundColor: "#e5e7eb",
                  color: "#333",
                  "&:hover": {
                    backgroundColor: "#ddd",
                  },
                }),
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Commentaires</label>
            <Select
              isMulti
              options={commentOptions}
              value={commentOptions.filter((option) => formData.fields.Commentaires.includes(option.value))}
              onChange={(selectedOptions) => handleArrayChange(selectedOptions, "Commentaires")}
              className="text-lg"
              placeholder="Sélectionner"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#f7f7f7",
                  borderColor: "#d1d5db",
                }),
                option: (base) => ({
                  ...base,
                  backgroundColor: "#e5e7eb",
                  color: "#333",
                  "&:hover": {
                    backgroundColor: "#ddd",
                  },
                }),
              }}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="Statut" className="text-gray-700 font-medium mb-2">Statut</label>
            <select
              id="Statut"
              name="Statut"
              value={formData.fields.Statut}
              onChange={handleChange}
              className="border-2 border-gray-400 p-4 text-lg text-gray-800 rounded-xl bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Publier">Publier</option>
              <option value="Masquer">Masquer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "✅ Ajouter le projet"}
          </button>
        </form>
      </div>
    </div>
  );
}
