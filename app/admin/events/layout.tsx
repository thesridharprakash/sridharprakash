import AdminProtectedShell from "@/app/admin/AdminProtectedShell";

export default function AdminEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedShell>{children}</AdminProtectedShell>;
}
