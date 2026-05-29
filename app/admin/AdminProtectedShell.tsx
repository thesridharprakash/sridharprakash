import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHeaderNav from "@/components/admin/AdminHeaderNav";
import AdminIdleLogout from "@/components/admin/AdminIdleLogout";
import LogoutButton from "@/components/admin/LogoutButton";
import { SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminSessionEdge";

export default async function AdminProtectedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

  if (!(await verifyAdminSessionToken(token))) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminIdleLogout />
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin</span>
            <AdminHeaderNav />
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="pt-10">{children}</div>
    </>
  );
}
