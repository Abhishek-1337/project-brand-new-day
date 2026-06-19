import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-surface-light/50 backdrop-blur-xl lg:flex">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              B
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Brand New Day</p>
              <p className="text-xs text-text-dim">Admin Dashboard</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted transition-all hover:bg-surface-lighter hover:text-text"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted transition-all hover:bg-surface-lighter hover:text-text"
          >
            <FolderKanban className="h-4 w-4" />
            Projects
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted transition-all hover:bg-surface-lighter hover:text-text"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text">
                {session.user?.name}
              </p>
              <p className="truncate text-xs text-text-dim">
                {session.user?.email}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted transition-all hover:bg-surface-lighter hover:text-text"
            >
              <LogOut className="h-4 w-4" />
              View Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-light/80 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around px-4 py-3">
          <Link
            href="/admin"
            className="flex flex-col items-center gap-1 text-text-muted"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-[10px]">Dashboard</span>
          </Link>
          <Link
            href="/admin/projects"
            className="flex flex-col items-center gap-1 text-text-muted"
          >
            <FolderKanban className="h-4 w-4" />
            <span className="text-[10px]">Projects</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex flex-col items-center gap-1 text-text-muted"
          >
            <Plus className="h-4 w-4" />
            <span className="text-[10px]">Add</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        <div className="mx-auto max-w-5xl p-6">{children}</div>
      </main>
    </div>
  );
}
