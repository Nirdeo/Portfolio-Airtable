export type Administrateur = {
  id: string;
  fields: {
    Id: string;
    Nom: string;
    Prénom: string;
    Email: string;
    "Mot de passe"?: string;
    Projets?: string[];
    Likes: string;
    Commentaires?: string[];
  };
}; 