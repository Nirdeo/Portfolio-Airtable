import { requireAuth } from "@/app/actions";

export default async function AddProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérifie l'authentification et redirige si non authentifié
  await requireAuth();
  
  return <>{children}</>;
} 