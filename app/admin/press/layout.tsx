import AdminProtectedShell from "@/app/admin/AdminProtectedShell";

export default function AdminPressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedShell>{children}</AdminProtectedShell>;
}
