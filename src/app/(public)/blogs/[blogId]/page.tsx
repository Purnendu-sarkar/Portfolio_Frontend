/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogDetailsCard from "@/components/modules/Blogs/BlogDetailsCard";

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`);
  const result = await res.json();
  const blogs = result?.data.blogs ?? [];

  return blogs.slice(0, 3).map((blog: any) => ({
    blogId: String(blog.id),
  }));
};

const BlogDetailsPage = async ({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) => {
  //console.log(await params);
  const { blogId } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blogs/${blogId}`,
    { cache: "no-store" }
  );
  const result = await res.json();
  const blog = result?.data;
  console.log(blog);
  return (
    <div className="py-28 max-w-7xl mx-auto">
      <BlogDetailsCard blog={blog} />
    </div>
  );
};

export default BlogDetailsPage;
