import { NextRequest, NextResponse } from "next/server";
import { updateProjectLikes, getAirtableProjectById } from "@/utils/airtable";

export async function POST(request: NextRequest) {
  try {
    const { projectId, action = "add" } = await request.json();
    
    if (!projectId) {
      return NextResponse.json(
        { error: "L'ID du projet est requis" },
        { status: 400 }
      );
    }
    
    // Récupérer le projet actuel pour obtenir le nombre de likes
    const project = await getAirtableProjectById(projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      );
    }
    
    // Calculer le nouveau nombre de likes en fonction de l'action
    const currentLikes = typeof project.fields.Likes === 'number' ? project.fields.Likes : 0;
    const newLikes = action === "add" ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    
    // Mettre à jour le projet avec le nouveau nombre de likes
    const result = await updateProjectLikes(projectId, newLikes);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      likes: newLikes,
      action: action,
    });
    
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de la requête" },
      { status: 500 }
    );
  }
} 