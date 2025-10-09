import AllBlogsTable from "@/components/modules/Blogs/AllBlogsTable";

const AllBlogs = () => {
  return (
    <div className="max-w-7xl mx-auto py-28 px-4">
      <h1 className="text-4xl font-semibold mb-6 text-center">📝 All Blogs</h1>
      <AllBlogsTable />
    </div>
  );
};

export default AllBlogs;
