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

// 🧠 Dummy Data
const dummyBlogs = [
  {
    id: 1,
    title: "Mastering Next.js App Router",
    tags: ["nextjs", "react", "isr", "nextjs", "react", "isr"],
    createdAt: "2025-10-08",
    views: 450,
  },
  {
    id: 2,
    title: "Understanding Prisma with PostgreSQL",
    tags: ["prisma", "postgres"],
    createdAt: "2025-10-06",
    views: 220,
  },
  {
    id: 3,
    title: "Express.js Authentication Best Practices",
    tags: ["express", "jwt", "bcrypt"],
    createdAt: "2025-10-05",
    views: 180,
  },
  {
    id: 4,
    title: "Optimizing API Performance with Caching",
    tags: ["express", "redis"],
    createdAt: "2025-10-04",
    views: 300,
  },
  {
    id: 5,
    title: "Deploying Fullstack Apps to Vercel",
    tags: ["nextjs", "vercel"],
    createdAt: "2025-10-02",
    views: 120,
  },
  {
    id: 6,
    title: "TypeScript Tips for Clean Code",
    tags: ["typescript", "best-practices"],
    createdAt: "2025-10-01",
    views: 500,
  },
  {
    id: 7,
    title: "Node.js Error Handling Patterns",
    tags: ["nodejs", "error-handling"],
    createdAt: "2025-09-30",
    views: 340,
  },
  {
    id: 8,
    title: "Building REST APIs with Express and MongoDB",
    tags: ["express", "mongodb", "api"],
    createdAt: "2025-09-28",
    views: 290,
  },
  {
    id: 9,
    title: "Server-Side Rendering vs Static Site Generation",
    tags: ["nextjs", "ssr", "ssg"],
    createdAt: "2025-09-27",
    views: 375,
  },
  {
    id: 10,
    title: "Improving Lighthouse Performance in Next.js",
    tags: ["nextjs", "seo", "performance"],
    createdAt: "2025-09-25",
    views: 210,
  },
  {
    id: 11,
    title: "JWT vs Session-based Authentication",
    tags: ["jwt", "auth", "express"],
    createdAt: "2025-09-24",
    views: 190,
  },
  {
    id: 12,
    title: "Advanced TypeScript Utility Types Explained",
    tags: ["typescript", "generics", "utils"],
    createdAt: "2025-09-22",
    views: 420,
  },
  {
    id: 13,
    title: "Integrating Stripe Payments in Next.js Apps",
    tags: ["stripe", "payments", "nextjs"],
    createdAt: "2025-09-20",
    views: 370,
  },
  {
    id: 14,
    title: "Caching Strategies for Express Applications",
    tags: ["express", "redis", "performance"],
    createdAt: "2025-09-19",
    views: 260,
  },
  {
    id: 15,
    title: "Dark Mode Implementation in Tailwind CSS",
    tags: ["tailwind", "ui", "dark-mode"],
    createdAt: "2025-09-18",
    views: 470,
  },
  {
    id: 16,
    title: "Understanding Middleware in Express.js",
    tags: ["express", "middleware"],
    createdAt: "2025-09-16",
    views: 210,
  },
  {
    id: 17,
    title: "Deploying Node.js API on Render",
    tags: ["nodejs", "deployment", "render"],
    createdAt: "2025-09-15",
    views: 280,
  },
  {
    id: 18,
    title: "State Management in React Without Redux",
    tags: ["react", "zustand", "context"],
    createdAt: "2025-09-13",
    views: 390,
  },
  {
    id: 19,
    title: "Securing Express APIs with Helmet",
    tags: ["express", "security", "helmet"],
    createdAt: "2025-09-12",
    views: 240,
  },
  {
    id: 20,
    title: "Generating Static Blogs with MDX in Next.js",
    tags: ["nextjs", "mdx", "blog"],
    createdAt: "2025-09-10",
    views: 410,
  },
];

// Auto-generate 80 more (21–100)
for (let i = 21; i <= 100; i++) {
  dummyBlogs.push({
    id: i,
    title: `Blog Post Example ${i}`,
    tags:
      i % 4 === 0
        ? ["nextjs", "typescript", "react"]
        : i % 3 === 0
        ? ["express", "api", "nodejs"]
        : ["prisma", "postgres", "orm"],
    createdAt: `2025-09-${(i % 30 + 1).toString().padStart(2, "0")}`,
    views: Math.floor(Math.random() * 500) + 50,
  });
}




const AllBlogsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    tags: true,
    views: true,
    createdAt: true,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const filteredBlogs = dummyBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalPages = Math.ceil(filteredBlogs.length / limit);
  const paginatedBlogs = filteredBlogs.slice((page - 1) * limit, page * limit);

  return (
    <Card className="w-full shadow-md border rounded-2xl">
      {/*  Header Section */}
      <CardHeader className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-xl font-semibold">Manage Blogs</CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          {/*  Search */}
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
                        onClick={() => console.log("View blog")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => console.log("Edit blog")}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => console.log("Delete blog")}
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
