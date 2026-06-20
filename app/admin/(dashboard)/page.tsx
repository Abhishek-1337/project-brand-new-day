import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderKanban, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboard() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 5,
  });
  const totalProjects = await prisma.project.count();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="text-text-muted">
          Here&apos;s an overview of your portfolio
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <FolderKanban className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalProjects}</p>
            <p className="text-sm text-text-muted">Total Projects</p>
          </div>
        </Card>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Recent Projects
          </h2>
          <Link
            href="/admin/projects"
            className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary-dark"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderKanban className="mb-3 h-10 w-10 text-text-dim" />
            <p className="mb-2 text-sm text-text-muted">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              Add Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-surface-light/50 px-4 py-3 transition-all hover:border-primary/30 hover:bg-surface-light"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white group-hover:text-primary transition-colors truncate">
                    {project.title}
                  </p>
                  <p className="text-xs text-text-dim mt-0.5">
                    {formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {project.featured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
                  <ArrowUpRight className="h-3.5 w-3.5 text-text-dim opacity-0 transition-all group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
