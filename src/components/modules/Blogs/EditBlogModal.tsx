/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Blog } from "@/hooks/useBlogs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner"; 
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/shared/Modal";
import Image from "next/image";
import { revalidateBlogs } from "@/actions/revalidate";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  thumbnail: z.instanceof(File).optional().or(z.string().optional()),
  tags: z.string().optional(),
});

type BlogForm = z.infer<typeof blogSchema>;

interface EditBlogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog: Blog;
  onUpdated?: () => void;
}

const EditBlogModal = ({
  open,
  onOpenChange,
  blog,
  onUpdated,
}: EditBlogModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(blog.thumbnail || null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog.title,
      content: blog.content,
      thumbnail: blog.thumbnail || "",
      tags: blog.tags.join(", "),
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!validFormats.includes(file.type)) {
        toast.error("Invalid file format! Please select a JPG, PNG, or WEBP image.");
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

  const onSubmit = async (data: BlogForm) => {
    try {
      const formData = new FormData();

      
      if (data.title) formData.append("title", data.title);
      if (data.content) formData.append("content", data.content);

      // Handle tags
      if (data.tags) {
        const tagArray = data.tags.split(",").map((t) => t.trim()).filter((t) => t);
        tagArray.forEach((tag) => formData.append("tags[]", tag));
      }

      // Append thumbnail if a new file is selected
      if (selectedFile) {
        formData.append("thumbnail", selectedFile);
      } else if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail); 
      }

      const token =
        (typeof window !== "undefined" && localStorage.getItem("token")) ||
        process.env.NEXT_PUBLIC_ADMIN_TOKEN;

      if (!token) {
        toast.error("No token found — please log in or set NEXT_PUBLIC_ADMIN_TOKEN");
        return;
      }

    
      //console.log("FormData contents:");
      // for (const [key, value] of formData.entries()) {
      //   //console.log(`${key}:`, value);
      // }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs/${blog.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `Update failed: ${res.status}`);
      }

      // Revalidate blogs after successful update
      await revalidateBlogs();

      toast.success(
        `✅ Blog updated successfully! Uploaded: ${selectedFile?.name || "No new thumbnail"}`
      );
      onOpenChange(false);
      onUpdated?.();
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("EditBlogModal update error:", err);
      toast.error(err.message || "Update failed");
    }
  };

  // Clean up preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && !blog.thumbnail) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, blog.thumbnail]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit: ${blog.title}`}
      description="Update blog details below"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input placeholder="Enter blog title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <Textarea
            rows={6}
            placeholder="Write blog content..."
            {...register("content")}
          />
          {errors.content && (
            <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            aria-label="Upload blog thumbnail"
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected file: {selectedFile.name}
            </p>
          )}
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Thumbnail Preview"
              width={300}
              height={200}
              className="mt-2 w-full max-w-xs h-auto rounded-md border"
            />
          )}
          {errors.thumbnail && (
            <p className="text-xs text-red-500 mt-1">{errors.thumbnail.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <Input placeholder="react, nextjs, prisma" {...register("tags")} />
        </div>

        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="pt-3 flex justify-end gap-3">
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
    </Modal>
  );
};

export default EditBlogModal;