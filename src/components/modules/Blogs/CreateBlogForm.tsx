/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import FormInput from "@/components/modules/Blogs/FormInput";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { revalidateBlogs } from "@/actions/revalidate";
import { useRouter } from "next/navigation"; 

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.instanceof(File).optional().or(z.string().optional()),
  tags: z.string().min(1, "At least one tag is required"),
});

const CreateBlogForm = () => {
  const router = useRouter(); 

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
      tags: "",
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);

      const tagArray = data.tags.split(",").map((tag) => tag.trim());
      tagArray.forEach((tag) => formData.append("tags[]", tag));

      if (selectedFile) {
        formData.append("thumbnail", selectedFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error creating blog");
      }

      // ✅ Revalidate after success
      await revalidateBlogs();

      toast.success(
        `✅ Blog created successfully! Uploaded: ${selectedFile?.name || "No thumbnail"}`
      );

      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      router.push("/dashboard/all-blogs");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
      console.error(error.message);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="w-full mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            control={form.control}
            name="title"
            label="Blog Title"
            placeholder="Enter blog title"
          />
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
                alt="Preview"
                width={300}
                height={200}
                className="mt-2 w-full max-w-xs h-auto rounded-md border"
              />
            )}
            {form.formState.errors.thumbnail?.message && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.thumbnail.message}
              </p>
            )}
          </div>

          <FormInput
            control={form.control}
            name="tags"
            label="Tags"
            placeholder="e.g. nextjs, prisma"
          />
          <FormInput
            control={form.control}
            name="content"
            label="Content"
            textarea
            placeholder="Write your blog content..."
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Blog"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBlogForm;
