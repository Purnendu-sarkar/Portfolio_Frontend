/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Blog } from "@/hooks/useBlogs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/shared/Modal";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().optional(),
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog.title,
      content: blog.content,
      thumbnail: blog.thumbnail || "",
      tags: blog.tags.join(", "),
    },
  });

  const [updating, setUpdating] = useState(false);

const onSubmit = async (data: BlogForm) => {
  try {
    setUpdating(true);

    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
    };

    const token =
      (typeof window !== "undefined" && localStorage.getItem("token")) ||
      process.env.NEXT_PUBLIC_ADMIN_TOKEN;

    if (!token) {
      toast.error("No token found — please log in or set NEXT_PUBLIC_ADMIN_TOKEN");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs/${blog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `Update failed: ${res.status}`);
    }

    toast.success("Blog updated successfully ✅");
    onOpenChange(false);
    onUpdated?.();
  } catch (err: any) {
    console.error("EditBlogModal update error:", err);
    toast.error(err.message || "Update failed");
  } finally {
    setUpdating(false);
  }
};



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
            <p className="text-xs text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Thumbnail URL
          </label>
          <Input placeholder="https://..." {...register("thumbnail")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
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
          <Button type="submit" disabled={updating || isSubmitting}>
            {updating ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBlogModal;
