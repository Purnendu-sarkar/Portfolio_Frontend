import CreateBlogForm from "@/components/modules/Blogs/CreateBlogForm";
import React from "react";

const CreateBlog = () => {
  return (
    <div className="max-w-7xl mx-auto py-28 px-4">
      <h1 className="text-4xl font-semibold mb-6 text-center">
        📝 Create Blog
      </h1>
      <CreateBlogForm />
    </div>
  );
};

export default CreateBlog;
