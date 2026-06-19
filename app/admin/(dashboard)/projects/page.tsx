import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteProjectButton } from "@/components/delete-project-button";
import { formatDistanceToNow } from "date-fns";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-text-muted">Manage your project showcase</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            No projects yet
          </h3>
          <p className="mb-6 max-w-sm text-sm text-text-muted">
            Start building your portfolio by adding your first project.
          </p>
          <Link href="/admin/projects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Project
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              hover
              className="group relative flex flex-col"
            >
              {/* Image */}
              {project.image && (
                <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Badge variant="primary" className="shrink-0">
                      Featured
                    </Badge>
                  )}
                </div>

                <p className="line-clamp-2 text-sm text-text-muted">
                  {project.description}
                </p>

                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="flex items-center gap-1 text-xs text-text-dim transition-colors hover:text-white"
                    >
                      <FaGithub className="h-3.5 w-3.5" />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      className="flex items-center gap-1 text-xs text-text-dim transition-colors hover:text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live
                    </a>
                  )}
                </div>
              </div>

              {/* Actions overlay */}
              <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-lighter text-text-dim transition-colors hover:bg-primary/20 hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <DeleteProjectButton projectId={project.id} />
              </div>

              <div className="mt-3 border-t border-border pt-3 text-xs text-text-dim">
                {formatDistanceToNow(new Date(project.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
