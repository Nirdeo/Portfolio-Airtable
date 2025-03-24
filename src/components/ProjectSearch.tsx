"use client";

import { useState, useEffect } from "react";
import { Projet } from "@/types/Projet";

type ProjectSearchProps = {
  projects: Projet[];
  onFilteredProjectsChange: (filteredProjects: Projet[]) => void;
};

export default function ProjectSearch({ projects, onFilteredProjectsChange }: ProjectSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [availableTechnologies, setAvailableTechnologies] = useState<string[]>([]);

  // Extraire toutes les technologies uniques des projets
  useEffect(() => {
    const techSet = new Set<string>();
    
    projects.forEach(project => {
      if (typeof project.fields.Technologies === 'string') {
        const techs = project.fields.Technologies.split(',').map(tech => tech.trim());
        techs.forEach(tech => techSet.add(tech));
      }
    });
    
    setAvailableTechnologies(Array.from(techSet).sort());
  }, [projects]);

  // Filtrer les projets en fonction de la recherche et des technologies sélectionnées
  useEffect(() => {
    const filtered = projects.filter(project => {
      // Filtre par terme de recherche
      const matchesSearch = searchTerm === "" || 
        (project.fields.Nom && project.fields.Nom.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.fields.Description && project.fields.Description.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtre par technologies
      let matchesTech = selectedTechnologies.length === 0;
      
      if (!matchesTech && typeof project.fields.Technologies === 'string') {
        // Diviser les technologies du projet en tableau et les nettoyer
        const projectTechs = project.fields.Technologies
          .split(',')
          .map(tech => tech.trim());
        
        // Vérifier si toutes les technologies sélectionnées sont présentes dans le projet
        matchesTech = selectedTechnologies.every(selectedTech => 
          projectTechs.some(projectTech => 
            projectTech.toLowerCase() === selectedTech.toLowerCase()
          )
        );
      }
      
      return matchesSearch && matchesTech;
    });
    
    onFilteredProjectsChange(filtered);
  }, [searchTerm, selectedTechnologies, projects, onFilteredProjectsChange]);

  // Gérer la sélection/désélection d'une technologie
  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Barre de recherche */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Rechercher un projet..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filtres par technologies */}
      <div>
        <h3 className="text-lg font-medium mb-2">Filtrer par technologies</h3>
        <div className="flex flex-wrap gap-2">
          {availableTechnologies.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleTechnology(tech)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTechnologies.includes(tech)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
        
        {selectedTechnologies.length > 0 && (
          <button 
            onClick={() => setSelectedTechnologies([])}
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Effacer les filtres
          </button>
        )}
      </div>
    </div>
  );
} 