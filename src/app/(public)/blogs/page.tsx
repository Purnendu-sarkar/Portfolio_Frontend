import BlogCard from "@/components/modules/Blogs/BlogCard";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = "All Blogs | Portfolio";
  const description =
    "Explore all insightful blogs on web development, programming, and tech — written and managed from my personal portfolio.";
  const image = "/logo_dark.png"; 
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "All Blogs Page Banner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AllBlogsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs?limit=500&page=1`, {
    next: { tags: ["blogs"] },
  });
  const result = await res.json();
  const blogs = result?.data.blogs ?? [];
  // console.log(blogs);
  return (
    <div className="py-28 px-4 max-w-7xl mx-auto ">
      <h2 className="text-center text-4xl">All Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto my-5">
        {blogs.map((blog: any) => (
          <BlogCard key={blog?.id} data={blog} />
        ))}
      </div>
    </div>
  );
}
