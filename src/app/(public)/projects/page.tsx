/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectCard from "@/components/modules/Projects/ProjectCard";

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
