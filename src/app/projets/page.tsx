import { getAirtableProjects } from "@/utils/airtable";
import { Projet } from "@/types/Projet";
import ProjectGrid from "@/components/ProjectGrid";
import AddProjectButton from "@/components/AddProjectButton";

export default async function ProjectsPage() {
  const projects = await getAirtableProjects() as Projet[];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tous les projets</h1>
          <AddProjectButton />
        </div>
        
        <ProjectGrid initialProjects={projects} />
      </div>
    </div>
  );
}
