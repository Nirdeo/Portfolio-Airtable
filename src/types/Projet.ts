export type AirtableAttachment = {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
  };
};

export type Projet = {
  id: string;
  fields: {
    Id: number;
    Nom: string;
    Description: string;
    Technologies: string;
    Lien: string;
    Visuels: AirtableAttachment[];
    Promotion: string;
    Administrateur: string;
    Categorie: string[];
    Likes: number;
    Statut: string;
    Commentaires: string[];
  };
};

