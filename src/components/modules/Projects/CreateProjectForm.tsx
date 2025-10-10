/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  projectType: z.enum(["FullStack", "Frontend", "Backend"]),
  githubClient: z.string().optional(),
  githubServer: z.string().optional(),
  liveSite: z.string().optional(),
  technologies: z.string().min(1, "At least one technology is required"),
  features: z.string().min(1, "At least one feature is required"),
  thumbnail: z.instanceof(File).optional().or(z.string()),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateProjectForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectType: "FullStack",
      githubClient: "",
      githubServer: "",
      liveSite: "",
      technologies: "",
      features: "",
      thumbnail: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!validFormats.includes(file.type)) {
        toast.error("Invalid file format! Please select JPG, PNG, or WEBP.");
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

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("projectType", data.projectType);

      if (data.githubClient) formData.append("githubClient", data.githubClient);
      if (data.githubServer) formData.append("githubServer", data.githubServer);
      if (data.liveSite) formData.append("liveSite", data.liveSite);

      formData.append(
        "technologies",
        JSON.stringify(
          data.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      formData.append(
        "features",
        JSON.stringify(
          data.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        )
      );

      if (selectedFile) formData.append("thumbnail", selectedFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create project");
      }

      toast.success("✅ Project created successfully!");
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      console.log("Form submitted successfully:", result.data);
      router.push("/dashboard/all-projects");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
      console.error(err);
    }
  };

  console.log("Form submitted", form.formState);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="w-full mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} placeholder="Project title" />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              {...form.register("description")}
              placeholder="Project description"
            />
          </div>

          {/* Project Type */}
          <div>
            <Label>Project Type</Label>
            <Select
              onValueChange={(val: "FullStack" | "Frontend" | "Backend") =>
                form.setValue("projectType", val)
              }
              defaultValue={form.getValues("projectType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FullStack">FullStack</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GitHub Links */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>GitHub Client</Label>
              <Input
                {...form.register("githubClient")}
                placeholder="Client repo link"
              />
            </div>
            <div>
              <Label>GitHub Server</Label>
              <Input
                {...form.register("githubServer")}
                placeholder="Server repo link"
              />
            </div>
            <div>
              <Label>Live Site</Label>
              <Input
                {...form.register("liveSite")}
                placeholder="Live site URL"
              />
            </div>
          </div>

          {/* Technologies & Features */}
          <div>
            <Label>Technologies (comma separated)</Label>
            <Input
              {...form.register("technologies")}
              placeholder="NextJS, Prisma, TailwindCSS"
            />
          </div>

          <div>
            <Label>Features (comma separated)</Label>
            <Input
              {...form.register("features")}
              placeholder="Responsive design, SEO optimized"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Thumbnail</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                width={300}
                height={200}
                className="mt-2 rounded-md border"
              />
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
