import type { Metadata } from "next";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminHeaderNav from "@/components/admin/AdminHeaderNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
