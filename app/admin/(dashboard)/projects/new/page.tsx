"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { X, Plus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);

  function addTech() {
    const tech = techInput.trim();
    if (tech && !techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
      setTechInput("");
    }
  }

  function removeTech(tech: string) {
    setTechStack(techStack.filter((t) => t !== tech));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      image: formData.get("image") || null,
      githubUrl: formData.get("githubUrl") || null,
      liveUrl: formData.get("liveUrl") || null,
      featured: formData.get("featured") === "on",
      techStack,
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create project");

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-lighter hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-text-muted">Add a new project to your showcase</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                id="title"
                name="title"
                label="Project Title"
                placeholder="My Awesome Project"
                required
              />
              <Input
                id="image"
                name="image"
                label="Cover Image URL"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <Textarea
              id="description"
              name="description"
              label="Description"
              placeholder="Tell the story of this project — what problem it solves, what you learned..."
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-muted">
                Tech Stack
              </label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. React, Node.js, PostgreSQL..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" variant="secondary" onClick={addTech}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-accent transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                id="githubUrl"
                name="githubUrl"
                label="GitHub URL"
                placeholder="https://github.com/username/project"
              />
              <Input
                id="liveUrl"
                name="liveUrl"
                label="Live URL"
                placeholder="https://project.vercel.app"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                className="h-4 w-4 rounded border-border bg-surface-light text-primary focus:ring-primary/50"
              />
              <div>
                <span className="text-sm font-medium text-white">
                  Featured Project
                </span>
                <p className="text-xs text-text-dim">
                  Featured projects appear prominently on your dashboard
                </p>
              </div>
            </label>

            <div className="flex items-center gap-3 border-t border-border pt-6">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Create Project
              </Button>
              <Link href="/admin/projects">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
