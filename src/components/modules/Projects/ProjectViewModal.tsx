"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types/project";

interface ProjectViewModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

const ProjectViewModal = ({
  open,
  onClose,
  project,
}: ProjectViewModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {project.title}
          </DialogTitle>
          <DialogDescription>
            Project Type:{" "}
            <span className="font-medium text-foreground">
              {project.projectType}
            </span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] mt-4 pr-2">
          <div className="space-y-5">
            {/* Thumbnail */}
            {project.thumbnail && (
              <div className="relative w-full h-56 rounded-lg overflow-hidden">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div>
                <h4 className="font-semibold text-lg mb-1">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Technologies */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="px-2 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Key Features</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {project.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mt-4">
              {project.liveLink && (
                <Button
                  asChild
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <a href={project.liveLink} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-1" /> Live Demo
                  </a>
                </Button>
              )}
              {project.githubLink && (
                <Button asChild size="sm" variant="outline">
                  <a href={project.githubLink} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-1" /> GitHub Repo
                  </a>
                </Button>
              )}
            </div>

            {/* Meta Info */}
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>
                Created:{" "}
                {new Date(project.createdAt).toLocaleDateString("en-GB")}
              </span>
              <span>Views: {project.views}</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewModal;
