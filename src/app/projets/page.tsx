import { getAirtableProjects } from "@/utils/airtable";
import { Projet } from "@/types/Projet";
import ProjectGrid from "@/components/ProjectGrid";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getAirtableProjects() as Projet[];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tous les projets</h1>
          <Link href="/projets/add" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Ajouter un projet
          </Link>
        </div>
        
        <ProjectGrid initialProjects={projects} />
      </div>
    </div>
  );
}
