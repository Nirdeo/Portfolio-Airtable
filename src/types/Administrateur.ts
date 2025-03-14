export type Administrateur = {
  id: string;
  fields: {
    Nom: string;
    Prénom: string;
    Email: string;
    "Mot de passe"?: string;
    Projets?: string[]; // Array of linked record IDs
    Likes?: string[]; // Array of linked record IDs
    Commentaires?: string[]; // Array of linked record IDs
  };
}; 