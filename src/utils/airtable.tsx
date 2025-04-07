"use server";
 
import Airtable from "airtable";

// Check if environment variables are defined
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

