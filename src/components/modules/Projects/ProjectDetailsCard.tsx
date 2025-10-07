"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github } from "lucide-react";

interface ProjectDetailsData {
  title: string;
  description: string;
  thumbnail?: string;
  projectType: string;
  githubClient?: string;
  githubServer?: string;
  liveSite?: string;
  technologies: string[];
  features: string[];
  views?: number;
  createdAt?: string;
}

interface ProjectDetailsProps {
  project: ProjectDetailsData;
}

export default function ProjectDetailsCard({ project }: ProjectDetailsProps) {
  return (
    <motion.section
      className="container mx-auto px-4 py-12 max-w-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Thumbnail */}
        {project?.thumbnail && (
          <Image
            src={project.thumbnail}
            alt={project.title}
            width={800}
            height={450}
            className="rounded-2xl shadow-lg mb-6 w-full object-cover"
          />
        )}

        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-4">{project.title}</h1>

        {/* Meta Info */}
        {(project?.createdAt || project?.views) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            {project?.createdAt && (
              <span>📅 {new Date(project.createdAt).toDateString()}</span>
            )}
            {project?.views !== undefined && <span>🔥 {project.views} views</span>}
          </div>
        )}

        <Separator className="my-6" />

        {/* Description */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {project?.description}
        </article>

        {/* Technologies */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Technologies Used:</h2>
          <div className="flex gap-2 flex-wrap">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Key Features:</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {project.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="flex gap-6 mt-8 flex-wrap">
          {project.liveSite && (
            <a
              href={project.liveSite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink size={18} /> Live Site
            </a>
          )}
          {project.githubClient && (
            <a
              href={project.githubClient}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:underline"
            >
              <Github size={18} /> Client
            </a>
          )}
          {project.githubServer && (
            <a
              href={project.githubServer}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:underline"
            >
              <Github size={18} /> Server
            </a>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
