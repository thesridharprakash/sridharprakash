import AdminProtectedShell from "@/app/admin/AdminProtectedShell";

export default function AdminArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedShell>{children}</AdminProtectedShell>;
}
