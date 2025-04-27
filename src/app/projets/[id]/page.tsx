import Image from "next/image";
import Link from "next/link";
import { getAirtableProjectById } from "@/utils/airtable";
import { Projet } from "@/types/Projet";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import ImageCarousel from "@/components/ImageCarousel";
import EditButton from "@/components/EditButton";

type Props = {
  params: {
    id: string;
  };
};

export default async function ProjectDetail({ params }: Props) {
  const { id } = await params;
  try {
    const projectData = await getAirtableProjectById(id);
    
    if (!projectData) {
      return notFound();
    }
    
    const project = {
      id: projectData.id,
      fields: projectData.fields,
    } as Projet;

    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux projets
            </Link>

            <EditButton projectId={project.id} />
          </div>

          {/* En-tête du projet */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{project.fields.Nom}</h1>
              <LikeButton 
                projectId={project.id} 
                initialLikes={typeof project.fields.Likes === 'number' ? project.fields.Likes : 0}
                className="text-lg"
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {typeof project.fields.Technologies === 'string' && 
                project.fields.Technologies.split(',').map((tech, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tech.trim()}
                  </span>
                ))
              }
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Promotion: {project.fields.Promotion}
            </div>
          </div>

          {/* Galerie d'images */}
          {Array.isArray(project.fields.Visuels) && project.fields.Visuels.length > 0 && (
            <div className="mb-8">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <ImageCarousel
                      images={project.fields.Visuels}
                      projectName={project.fields.Nom}
                  />
              </div>
            </div>
          )}

          {/* Description du projet */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{project.fields.Description}</p>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Détails du projet</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</dt>
                  <dd>{project.fields.Statut}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Catégories</dt>
                  <dd>
                    {Array.isArray(project.fields.Categorie) ? 
                      project.fields.Categorie.join(', ') : 
                      project.fields.Categorie || 'Non spécifié'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Liens</h2>
              {project.fields.Lien && (
                <a 
                  href={project.fields.Lien} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voir le projet
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    return notFound();
  }
}
