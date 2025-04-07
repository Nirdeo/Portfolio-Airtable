import { getAirtableProjects } from "@/utils/airtable";
import { Projet } from "@/types/Projet";
import ProjectGrid from "@/components/ProjectGrid";

export default async function ProjectsPage() {
  const projects = await getAirtableProjects() as Projet[];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Tous les projets</h1>
        
        <ProjectGrid initialProjects={projects} />
      </div>
    </div>
  );
}
