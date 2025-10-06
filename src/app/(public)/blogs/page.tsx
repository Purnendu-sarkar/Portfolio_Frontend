import BlogCard from "@/components/modules/Blogs/BlogCard";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AllBlogsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`, {
    cache: "no-store",
  });
  const result = await res.json();
  const blogs = result?.data.blogs ?? [];
  // console.log(blogs);
  return (
    <div className="container mx-auto px-4 py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog: any) => (
          <BlogCard key={blog?.id} data={blog} />
        ))}
      </div>
    </div>
  );
}
