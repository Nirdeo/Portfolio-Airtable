"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type LikeButtonProps = {
  projectId: string;
  initialLikes: number;
  className?: string;
};

const LIKED_PROJECTS_KEY = "likedProjects";

const getLikedProjects = (): string[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const likedProjects = localStorage.getItem(LIKED_PROJECTS_KEY);
    return likedProjects ? JSON.parse(likedProjects) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des projets aimés:", error);
    return [];
  }
};

const saveLikedProjects = (projects: string[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(LIKED_PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des projets aimés:", error);
  }
};

export default function LikeButton({ projectId, initialLikes, className = "" }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const likedProjects = getLikedProjects();
    setHasLiked(likedProjects.includes(projectId));
  }, [projectId]);

  const handleLikeToggle = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const action = hasLiked ? "remove" : "add";
      
      const response = await fetch("/api/projects/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, action }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }
      
      setLikes(data.likes);
      
      const newHasLiked = !hasLiked;
      setHasLiked(newHasLiked);
      
      const likedProjects = getLikedProjects();
      if (newHasLiked) {
        if (!likedProjects.includes(projectId)) {
          saveLikedProjects([...likedProjects, projectId]);
        }
      } else {
        saveLikedProjects(likedProjects.filter(id => id !== projectId));
      }
      
      router.refresh();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur lors de la gestion du like:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleLikeToggle}
        disabled={isProcessing}
        className={`flex items-center gap-1 transition-colors ${
          hasLiked 
            ? "text-red-500" 
            : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
        }`}
        title={hasLiked ? "Retirer votre like" : "Aimer ce projet"}
      >
        {hasLiked ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
        <span>{likes}</span>
      </button>
      
      {isProcessing && (
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          En cours...
        </span>
      )}
      
      {error && (
        <span className="ml-2 text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
} 