/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Project } from "@/types/project";
import { revalidateProjects } from "@/actions/revalidate";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  thumbnail: z.instanceof(File).optional().or(z.string().optional()),
  projectType: z.enum(["FullStack", "Frontend", "Backend"]).optional(),
  githubClient: z.string().optional(),
  githubServer: z.string().optional(),
  liveSite: z.string().optional(),
  technologies: z.string().optional(),
  features: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onUpdated?: () => void;
}

const EditProjectModal = ({
  open,
  onOpenChange,
  project,
  onUpdated,
}: EditProjectModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    project?.thumbnail || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title,
      description: project?.description,
      projectType: project?.projectType,
      githubClient: project?.githubClient,
      githubServer: project?.githubServer,
      liveSite: project?.liveLink,
      technologies: project?.technologies.join(", "),
      features: project?.features.join(", "),
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!validFormats.includes(file.type)) {
        toast.error("Invalid file format! Please use JPG, PNG, or WEBP.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB!");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.projectType) formData.append("projectType", data.projectType);
      if (data.githubClient) formData.append("githubClient", data.githubClient);
      if (data.githubServer) formData.append("githubServer", data.githubServer);
      if (data.liveSite) formData.append("liveSite", data.liveSite);

      if (data.technologies) {
        const techArray = data.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        techArray.forEach((tech) => formData.append("technologies[]", tech));
      }

      if (data.features) {
        const featureArray = data.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f);
        featureArray.forEach((feature) =>
          formData.append("features[]", feature)
        );
      }

      if (selectedFile) {
        formData.append("thumbnail", selectedFile);
      } else if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      const token =
        (typeof window !== "undefined" && localStorage.getItem("token")) ||
        process.env.NEXT_PUBLIC_ADMIN_TOKEN;

      if (!token) {
        toast.error(
          "No token found — please log in or set NEXT_PUBLIC_ADMIN_TOKEN"
        );
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/projects/${project.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `Update failed: ${res.status}`);
      }

      await revalidateProjects?.();

      toast.success("✅ Project updated successfully!");
      onOpenChange(false);
      onUpdated?.();
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("EditProjectModal error:", err);
      toast.error(err.message || "Failed to update project");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && !project.thumbnail) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, project.thumbnail]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit: {project.title}
          </DialogTitle>
          <DialogDescription>
            Update your project details below
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3 mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input placeholder="Project title" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea rows={3} {...register("description")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Project Type
              </label>
              <select
                {...register("projectType")}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background text-foreground"
              >
                <option value="FullStack">FullStack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  GitHub Client
                </label>
                <Input
                  placeholder="Client repo URL"
                  {...register("githubClient")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  GitHub Server
                </label>
                <Input
                  placeholder="Server repo URL"
                  {...register("githubServer")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Live Site
              </label>
              <Input placeholder="Live site URL" {...register("liveSite")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Technologies (comma separated)
              </label>
              <Input
                placeholder="React, Next.js, Prisma"
                {...register("technologies")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Features (comma separated)
              </label>
              <Textarea rows={2} {...register("features")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Thumbnail
              </label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Thumbnail Preview"
                  width={400}
                  height={250}
                  className="mt-3 w-full rounded-lg border object-cover"
                />
              )}
            </div>

            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-background">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
