/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectCard from "@/components/modules/Projects/ProjectCard";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = "Projects | Portfolio";
  const description =
    "Explore all my web development projects — full-stack, frontend, and backend — built with modern technologies.";
  const image = "/logo_dark.png";
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/projects`;

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
          alt: "Projects Page Banner",
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

export default async function AllProjectsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`, {
    cache: "no-store",
  });
  const result = await res.json();
  //console.log(result)
  const projects = Array.isArray(result?.data) ? result.data : [];
  //console.log(projects)

  return (
    <div className="py-28 px-4 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-bold mb-8">All Projects</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
