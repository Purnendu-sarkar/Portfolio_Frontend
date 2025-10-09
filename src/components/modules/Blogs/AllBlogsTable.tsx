/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Blog, useBlogs } from "@/hooks/useBlogs";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import EditBlogModal from "./EditBlogModal";
import { toast } from "sonner";
import ConfirmModal from "@/components/shared/ConfirmModal";

const AllBlogsTable = () => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { blogs, loading, error, refetch } = useBlogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    tags: true,
    views: true,
    createdAt: true,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // ✅ Search filter
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalPages = Math.ceil(filteredBlogs.length / limit);
  const paginatedBlogs = filteredBlogs.slice((page - 1) * limit, page * limit);

  if (loading)
    return (
      <Card className="w-full shadow-md border rounded-2xl p-4">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );

  if (error)
    return (
      <Card className="w-full shadow-md border rounded-2xl p-8 text-center text-red-500">
        Failed to load blogs: {error}
      </Card>
    );

  return (
    <Card className="w-full shadow-md border rounded-2xl">
      {/* Header Section */}
      <CardHeader className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-xl font-semibold">Manage Blogs</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[220px]"
            />
          </div>

          {/*  View Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              className="w-44 z-50"
              forceMount
            >
              {Object.keys(visibleColumns).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() =>
                    toggleColumn(key as keyof typeof visibleColumns)
                  }
                  className="flex justify-between cursor-pointer"
                >
                  <span className="capitalize">{key}</span>
                  <Checkbox
                    checked={visibleColumns[key as keyof typeof visibleColumns]}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/*  Add Blog */}
          <Button
            size="sm"
            className="bg-primary dark:bg-secondary text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Blog
          </Button>
        </div>
      </CardHeader>

      {/*  Table Section */}
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                {visibleColumns.title && <TableHead>Title</TableHead>}
                {visibleColumns.tags && <TableHead>Tags</TableHead>}
                {visibleColumns.views && <TableHead>Views</TableHead>}
                {visibleColumns.createdAt && <TableHead>Published</TableHead>}
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedBlogs.length > 0 ? (
                paginatedBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    {visibleColumns.title && (
                      <TableCell className="font-medium">
                        {blog.title}
                      </TableCell>
                    )}
                    {visibleColumns.tags && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1 items-center">
                          {blog.tags.slice(0, 3).map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs px-2 py-1"
                            >
                              {tag}
                            </Badge>
                          ))}

                          {blog.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{blog.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.views && (
                      <TableCell>{blog.views}</TableCell>
                    )}
                    {visibleColumns.createdAt && (
                      <TableCell>{blog.createdAt}</TableCell>
                    )}
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBlog(blog);
                          setIsModalOpen(true);
                          //console.log(blog);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingBlog(blog);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          setDeletingBlog(blog);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      Object.values(visibleColumns).filter(Boolean).length + 2
                    }
                    className="text-center py-6 text-muted-foreground"
                  >
                    No blogs found 😴
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* View Blog Modal */}
          {selectedBlog && (
            <Modal
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              title={selectedBlog.title}
              description={`Published on ${new Date(
                selectedBlog.createdAt
              ).toLocaleDateString()}`}
              size="lg"
            >
              <div className="space-y-4">
                {/* Thumbnail */}
                {selectedBlog.thumbnail && (
                  <Image
                    src={selectedBlog.thumbnail}
                    alt={selectedBlog.title}
                    width={800}
                    height={400}
                    className="w-full h-60 object-cover rounded-xl border"
                  />
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Views */}
                <p className="text-sm text-muted-foreground">
                  👀 <strong>{selectedBlog.views}</strong> views
                </p>

                {/* Content */}
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedBlog.content}
                </p>

                {/* Created & Updated */}
                <div className="text-xs text-muted-foreground border-t pt-3">
                  Created at:{" "}
                  {new Date(selectedBlog.createdAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {new Date(selectedBlog.updatedAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </Modal>
          )}
          {/* Edit Blog Modal */}
          {editingBlog && (
            <EditBlogModal
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
              blog={editingBlog}
              onUpdated={refetch}
            />
          )}
          {/* Delete Confirmation Modal */}
          {deletingBlog && (
            <ConfirmModal
              open={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              title="Delete blog?"
              description={`This action will permanently delete “${deletingBlog.title}”.`}
              confirmText="Delete"
              cancelText="Cancel"
              loading={deleting}
              onConfirm={async () => {
                try {
                  setDeleting(true);

                  const token =
                    (typeof window !== "undefined" &&
                      localStorage.getItem("token")) ||
                    process.env.NEXT_PUBLIC_ADMIN_TOKEN;

                  if (!token) {
                    toast.error("No token found — please log in first!");
                    return;
                  }

                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API}/blogs/${deletingBlog.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (!res.ok) throw new Error("Failed to delete blog ❌");

                  toast.success("Blog deleted successfully 🗑️");
                  setIsDeleteModalOpen(false);
                  await refetch();
                } catch (err: any) {
                  console.error("Delete error:", err);
                  toast.error(err.message || "Delete failed");
                } finally {
                  setDeleting(false);
                }
              }}
            />
          )}
        </div>
      </CardContent>

      {/* Pagination Footer */}
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t py-4 gap-3 sm:gap-0">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Rows per page:</p>
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setPage(1);
              setLimit(Number(value));
            }}
          >
            <SelectTrigger className="w-[70px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {paginatedBlogs.length} of {filteredBlogs.length} blogs
        </p>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="icon"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AllBlogsTable;
