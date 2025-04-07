import { getAirtableProjects } from "@/utils/airtable";
import { Projet } from "@/types/Projet";
import ProjectGrid from "@/components/ProjectGrid";

export default async function Home() {
  const projects = await getAirtableProjects() as Projet[];

  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Nos Projets</h1>
      
      <ProjectGrid initialProjects={projects} />
    </div>
  );
}