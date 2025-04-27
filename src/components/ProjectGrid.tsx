"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Projet } from "@/types/Projet";
import ProjectSearch from "./ProjectSearch";
import LikeButton from "./LikeButton";
import { deleteAirtableProjet } from "@/utils/airtable";
import { useAuth } from "@/hooks/useAuth";

type ProjectGridProps = {
  initialProjects: Projet[];
};

export default function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [filteredProjects, setFilteredProjects] = useState<Projet[]>(initialProjects);
  const { isAuthenticated } = useAuth();
  
  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await deleteAirtableProjet(id);
        setFilteredProjects((prev) => prev.filter((project) => project.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression du projet.");
      }
    }
  };

  return (
    <>
      <ProjectSearch 
        projects={initialProjects} 
        onFilteredProjectsChange={setFilteredProjects} 
      />
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-10">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Aucun projet trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href={`/projets/${project.id}`}>
                <div className="relative h-48 w-full">
                  {Array.isArray(project.fields.Visuels) && project.fields.Visuels.length > 0 ? (
                    <Image 
                      src={project.fields.Visuels[0].url} 
                      alt={project.fields.Nom || "Projet"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-800 h-48 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Pas d'image</span>
                    </div>
                  )}
                </div>
              </Link>
                
              <div className="p-4">
                <Link href={`/projets/${project.id}`}>
                  <h2 className="text-xl font-semibold mb-2">{project.fields.Nom || "Sans titre"}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {project.fields.Description || "Aucune description"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {typeof project.fields.Technologies === 'string' && 
                      project.fields.Technologies.split(',').map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {tech.trim()}
                        </span>
                      ))
                    }
                  </div>
                </Link>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {project.fields.Promotion || ""}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <LikeButton 
                      projectId={project.id} 
                      initialLikes={typeof project.fields.Likes === 'number' ? project.fields.Likes : 0} 
                    />
                    
                    <Link 
                      href={`/projets/${project.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Détails
                    </Link>
                    {isAuthenticated && (
                      <button
                        className="text-blue-600 dark:text-red-400 hover:underline font-medium"
                        onClick={() => handleDelete(project.id)}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
      </div>
    </>
  );
} 