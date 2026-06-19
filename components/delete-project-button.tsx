"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-lighter text-text-dim transition-colors hover:bg-accent/20 hover:text-accent"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
