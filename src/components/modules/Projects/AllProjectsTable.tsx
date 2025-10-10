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
import {  useProjects } from "@/hooks/useProjects";


const AllProjectsTable = () => {
  const { projects, loading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    projectType: true,
    technologies: true,
    features: true,
    views: true,
    createdAt: true,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  //  Search filter
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalPages = Math.ceil(filteredProjects.length / limit);
  const paginatedProjects = filteredProjects.slice((page - 1) * limit, page * limit);

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
        Failed to load projects: {error}
      </Card>
    );

  return (
    <Card className="w-full shadow-md border rounded-2xl">
      {/* Header Section */}
      <CardHeader className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-xl font-semibold">Manage Projects</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[220px]"
            />
          </div>

          {/* View Columns */}
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
                  onClick={() => toggleColumn(key as keyof typeof visibleColumns)}
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

          {/* Add Project */}
          <Button
            size="sm"
            className="bg-primary dark:bg-secondary text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Project
          </Button>
        </div>
      </CardHeader>

      {/* Table Section */}
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                {visibleColumns.title && <TableHead>Title</TableHead>}
                {visibleColumns.projectType && <TableHead>Type</TableHead>}
                {visibleColumns.technologies && <TableHead>Technologies</TableHead>}
                {visibleColumns.features && <TableHead>Features</TableHead>}
                {visibleColumns.views && <TableHead>Views</TableHead>}
                {visibleColumns.createdAt && <TableHead>Created</TableHead>}
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    {visibleColumns.title && (
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                    )}
                    {visibleColumns.projectType && (
                      <TableCell>{project.projectType}</TableCell>
                    )}
                    {visibleColumns.technologies && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs px-2 py-1"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.features && (
                      <TableCell>
                        <ul className="text-xs list-disc ml-4">
                          {project.features.slice(0, 2).map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                          {project.features.length > 2 && (
                            <li className="text-muted-foreground">
                              +{project.features.length - 2} more
                            </li>
                          )}
                        </ul>
                      </TableCell>
                    )}
                    {visibleColumns.views && (
                      <TableCell>{project.views}</TableCell>
                    )}
                    {visibleColumns.createdAt && (
                      <TableCell>
                        {new Date(project.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                    )}
                    <TableCell className="text-center space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
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
                    No projects found 😴
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
          Showing {paginatedProjects.length} of {filteredProjects.length} projects
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

export default AllProjectsTable;
