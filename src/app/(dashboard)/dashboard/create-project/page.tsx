import CreateProjectForm from "@/components/modules/Projects/CreateProjectForm";

const CreateProject = () => {
  return (
    <div className="max-w-7xl mx-auto py-28 px-4">
      <h1 className="text-4xl font-semibold mb-6 text-center">
        📝 Create Project
      </h1>
      <CreateProjectForm />
    </div>
  );
};

export default CreateProject;
