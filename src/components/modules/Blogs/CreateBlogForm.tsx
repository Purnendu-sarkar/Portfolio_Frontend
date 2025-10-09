"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { createBlog } from "@/actions/blog";
import FormInput from "@/components/modules/Blogs/FormInput";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().optional(),
  tags: z.string().min(1, "At least one tag is required"),
});

const CreateBlogForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
      tags: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const res = await createBlog(formData);
      if (res?.success) {
        toast.success("Blog created successfully ✅");
        form.reset();
      } else {
        toast.error(res?.message || "Failed to create blog 😢");
        //console.log(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

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
          <FormInput
            control={form.control}
            name="thumbnail"
            label="Thumbnail URL"
            placeholder="https://..."
          />
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
