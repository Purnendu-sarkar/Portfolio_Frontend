/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectDetailsCard from "@/components/modules/Projects/ProjectDetailsCard";

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`);
  const result = await res.json();
  const projects = Array.isArray(result?.data) ? result.data : [];

  return projects.slice(0, 5).map((project: any) => ({
    projectId: String(project.id),
  }));
};

const ProjectDetailsPage = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const { projectId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/projects/${projectId}`,
    { cache: "no-store" }
  );
  const result = await res.json();
  const project = result?.data;

  return (
    <div className="py-28 max-w-7xl mx-auto">
      <ProjectDetailsCard project={project} />
    </div>
  );
};

export default ProjectDetailsPage;
