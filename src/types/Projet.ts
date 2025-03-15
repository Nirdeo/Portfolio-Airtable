export type Projet = {
  id: string;
  fields: {
    Id: number;
    Nom: string;
    Description: string;
    Technologies: string;
    Lien: string;
    Visuels: string[];
    Promotion: string;
    Administrateur: string;
    Categorie: string[];
    Likes: number;
    Statut: string;
    Commentaires: string[];
  };
};

