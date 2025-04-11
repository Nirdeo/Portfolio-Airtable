import { requireAuth } from "../actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and redirect if not authenticated
  await requireAuth();
  
  return <>{children}</>;
} 