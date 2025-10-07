const BlogDetailsPage = async ({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) => {
  console.log(await params);

  return (
    <div className="py-30 px-4 max-w-7xl mx-auto">
      <h1> Blog Details Page</h1>
    </div>
  );
};

export default BlogDetailsPage;
