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

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) => {
  const { blogId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blogs/${blogId}`,
    { cache: "no-store" }
  );

  const result = await res.json();
  const blog = result?.data;

  if (!blog) {
    return {
      title: "Blog Not Found | Portfolio",
      description: "The requested blog post could not be found.",
    };
  }

  const title = blog?.title
    ? `${blog?.title} | Portfolio`
    : "Blog Details | Portfolio";
  const description =
    blog.content?.slice(0, 150).replace(/<[^>]+>/g, "") ||
    "Read insightful articles and updates on my personal portfolio.";
  const image = blog?.thumbnail;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 800,
          height: 450,
          alt: blog.title,
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
