"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Pencil, ExternalLink, GripVertical } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { DeleteProjectButton } from "@/components/delete-project-button";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectDragList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [items, setItems] = useState(projects);

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);

    await fetch("/api/projects/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
    });

    router.refresh();
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="projects">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3"
          >
            {items.map((project, index) => (
              <Draggable key={project.id} draggableId={project.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`group flex items-center gap-3 rounded-lg border bg-surface-light/50 px-4 py-3 transition-all ${
                      snapshot.isDragging
                        ? "border-primary/50 shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className={`flex cursor-grab items-center transition-colors ${
                        snapshot.isDragging ? "text-primary" : "text-text-dim hover:text-white"
                      }`}
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>

                    {project.image && (
                      <img
                        src={project.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-white transition-colors group-hover:text-primary">
                          {project.title}
                        </span>
                        {project.featured && (
                          <Badge variant="primary" className="shrink-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-sm text-text-muted">
                        {project.description}
                      </p>
                      {project.techStack.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {project.techStack.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-[10px]">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {(project.githubUrl || project.liveUrl) && (
                        <div className="flex gap-1.5">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-surface-lighter hover:text-white"
                            >
                              <FaGithub className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-surface-lighter hover:text-white"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      )}
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-primary/20 hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <DeleteProjectButton projectId={project.id} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
