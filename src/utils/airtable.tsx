"use server";
 
import Airtable from "airtable";

if (!process.env.AIRTABLE_KEY) {
  throw new Error("AIRTABLE_KEY is not defined in environment variables");
}

if (!process.env.AIRTABLE_BASE) {
  throw new Error("AIRTABLE_BASE is not defined in environment variables");
}
 
const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE || '');

export async function getAirtableAdministrateurs() {
  const administrateurs = await base.table("Administrateurs").select().all();

  return (await administrateurs).map((admin) => ({
    id: admin.id,
    fields: admin.fields,
  }));
}

export async function getAirtableProjects() {
  const projects = await base.table("Projets").select().all();

  return (await projects).map((project) => ({
    id: project.id,
    fields: project.fields,
  }));
}

export async function getAirtableProjectById(id: string) {
  const project = await base.table("Projets").find(id);

  return project;
}

export async function updateProjectLikes(id: string, likes: number) {
  try {
    const updatedProject = await base.table("Projets").update(id, {
      Likes: likes,
    });
    
    return {
      success: true,
      project: {
        id: updatedProject.id,
        fields: updatedProject.fields,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des likes:", error);
    return {
      success: false,
      error: "Impossible de mettre à jour les likes",
    };
  }
}

export async function deleteAirtableProjet(id: string): Promise<void> {
  try {
    await base("Projets").destroy(id);
    console.log(`Projet ${id} supprimé avec succès`);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    throw new Error(`Erreur lors de la suppression du projet avec l'ID ${id}.`);
  }
}

export async function addAirtableProjet(projet: Projet): Promise<Projet> {
  try {
    console.log("Projet à ajouter :", projet);

    const createdRecord = await base('Projets').create([
      {
        "fields": {
          "Nom": projet.fields.Nom,
          "Description": projet.fields.Description,
          "Technologies": projet.fields.Technologies,
          "Lien": projet.fields.Lien,
          "Visuels": [
            {
              "url": projet.fields.Visuels[0].url
            },
          ],
          "Promotion": projet.fields.Promotion,
          "Administrateur": projet.fields.Administrateur,
          "Catégorie": projet.fields.Catégorie,
          "Likes": projet.fields.Likes,
          "Statut": projet.fields.Statut,
          "Commentaires": projet.fields.Commentaires
        }
      },
    ], function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet :", error);
    throw new Error("Erreur lors de l'ajout du projet.");
  }
}

export async function getAirtableCommentaires(): Promise<string[]> {
  try {
    const records = await base("Commentaires").select().all();
    return records.map((record) => ({ id: record.id, fields: record.fields }));
  }
  catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    throw new Error("Erreur lors de la récupération des commentaires.");
  }
}