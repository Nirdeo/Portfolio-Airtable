"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAirtableProjetById, getAirtableAdministrateurs, getAirtableCommentaires, updateAirtableProjet } from "@/utils/airtable";
import { Projet } from "@/types/Projet";
import Select from "react-select";

export default function EditProjet() {
  const router = useRouter();
  const params = useParams();
  const [projet, setProjet] = useState<Projet | null>(null);
  const [administrateurs, setAdministrateurs] = useState<any[]>([]);
  const [commentaires, setCommentaires] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, admins, comments] = await Promise.all([
          getAirtableProjetById(params.id as string),
          getAirtableAdministrateurs(),
          getAirtableCommentaires(),
        ]);

        setProjet(proj);
        setAdministrateurs(admins.map((admin: any) => ({ id: admin.id, ...admin.fields })));
        setCommentaires(comments.map((c: any) => ({ id: c.id, ...c.fields })));
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!projet) return;
    const { name, value } = e.target;
    setProjet((prev) => ({
      ...prev!,
      fields: {
        ...prev!.fields,
        [name]: 
          name === "Visuels" ? [{ url: value }] : 
          name === "Technologies" ? value.split(",").map(tech => tech.trim()) :
          value,
      },
    }));
  };

  const handleArrayChange = (selectedOptions: any, field: "Administrateur" | "Catégorie" | "Commentaires") => {
    if (!projet) return;
    const updatedArray = selectedOptions.map((option: any) => option.value);
    setProjet((prev) => ({
      ...prev!,
      fields: {
        ...prev!.fields,
        [field]: updatedArray,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projet) return;

    setIsSubmitting(true);
    try {
      await updateAirtableProjet(projet.id, projet);
      alert("Projet mis à jour avec succès !");
      router.push("/projets");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour !");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (!projet) return <div>Projet introuvable</div>;

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🛠 Modifier le projet</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField label="Nom" name="Nom" value={projet.fields.Nom} onChange={handleChange} required />
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="Description"
            value={projet.fields.Description}
            onChange={handleChange}
            rows={5}
            className="border p-4 rounded"
            required
          />
        </div>
        <InputField label="Technologies (séparées par ,)" name="Technologies" value={Array.isArray(projet.fields.Technologies) ? projet.fields.Technologies.join(", ") : projet.fields.Technologies} onChange={handleChange} />
        <InputField label="Lien" name="Lien" value={projet.fields.Lien} onChange={handleChange} type="url" />
        <InputField label="Image (URL)" name="Visuels" value={projet.fields.Visuels[0]?.url || ""} onChange={handleChange} type="url" />
        <InputField label="Promotion" name="Promotion" value={projet.fields.Promotion} onChange={handleChange} />
        <MultiSelectField
          label="Administrateurs"
          options={adminOptions}
          selectedValues={projet.fields.Administrateur}
          onChange={(selected) => handleArrayChange(selected, "Administrateur")}
        />
        <MultiSelectField
          label="Catégories"
          options={categorieOptions}
          selectedValues={projet.fields.Catégorie}
          onChange={(selected) => handleArrayChange(selected, "Catégorie")}
        />
        <MultiSelectField
          label="Commentaires"
          options={commentOptions}
          selectedValues={projet.fields.Commentaires}
          onChange={(selected) => handleArrayChange(selected, "Commentaires")}
        />
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Statut</label>
          <select
            name="Statut"
            value={projet.fields.Statut}
            onChange={handleChange}
            className="border p-4 rounded"
            required
          >
            <option value="Publier">Publier</option>
            <option value="Masquer">Masquer</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-4 rounded mt-4"
        >
          {isSubmitting ? "Mise à jour..." : "✅ Mettre à jour le projet"}
        </button>

      </form>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text", required = false }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border p-4 rounded"
        required={required}
      />
    </div>
  );
}

function MultiSelectField({ label, options, selectedValues, onChange }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <Select
        isMulti
        options={options}
        value={options.filter((option: any) => selectedValues.includes(option.value))}
        onChange={onChange}
        className="text-lg"
      />
    </div>
  );
}
