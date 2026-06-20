import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  const session = await auth();

  return (
    <main className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-secondary/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              B
            </span>
            <span className="gradient-text">Brand New Day</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* {session ? (
              <Link
                href="/admin"
                className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="rounded-xl border border-border bg-surface-lighter px-4 py-2 text-sm font-medium text-text-muted transition-all hover:border-primary/30 hover:text-text"
              >
                Admin
              </Link>
            )} */}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Portfolio
          </div> */}
          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Projects I&apos;ve{" "}
            <span className="gradient-text">Built</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            A curated collection of things I&apos;ve made — each one a story of
            curiosity, craft, and late-night commits.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FolderKanban className="mb-4 h-16 w-16 text-text-dim" />
            <h3 className="mb-2 text-xl font-semibold text-text">Nothing here yet</h3>
            <p className="mb-6 text-sm text-text-muted">
              Projects will appear here once added.
            </p>
            <Link
              href="/admin/login"
              className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Add a Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.liveUrl || project.githubUrl || "#"}
                target={project.liveUrl || project.githubUrl ? "_blank" : undefined}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface-light/50 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {project.image ? (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                      <FolderKanban className="h-12 w-12 text-text-dim" />
                    </div>
                  )}
                  {project.featured && (
                    <Badge
                      variant="primary"
                      className="absolute right-3 top-3"
                    >
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-text transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    {(project.liveUrl || project.githubUrl) && (
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-text-dim transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-text-muted">
                    {project.description}
                  </p>
                  {project.techStack.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm text-text-dim">
            Built with{" "}
            <Link href="https://nextjs.org" target="_blank" className="text-primary hover:underline">
              Next.js
            </Link>
            {" & "}
            <Link href="https://tailwindcss.com" target="_blank" className="text-secondary hover:underline">
              Tailwind CSS
            </Link>
            {" • "}
            <span className="font-mono text-xs">{new Date().getFullYear()}</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
