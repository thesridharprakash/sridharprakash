import AdminProtectedShell from "@/app/admin/AdminProtectedShell";

export default function AdminGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedShell>{children}</AdminProtectedShell>;
}
