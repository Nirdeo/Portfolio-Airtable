export type Administrateur = {
  id: string;
  fields: {
    Id: number;
    Nom: string;
    Prénom: string;
    Email: string;
    "Mot de passe"?: string;
    Projets?: string[];
    Likes: number;
    Commentaires?: string[];
  };
}; 