"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
    projectType: string;
    githubClient?: string;
    githubServer?: string;
    liveSite?: string;
    technologies: string[];
    features: string[];
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="cursor-pointer"
    >
      <Link
        href={`/projects/${project.id}`}
        className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="relative w-full h-52 overflow-hidden">
          <Image
            src={project.thumbnail || ""}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        <div className="p-5 flex flex-col gap-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {project.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 my-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4 mt-auto">
            {project.liveSite && (
              <a
                href={project.liveSite}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <ExternalLink size={16} /> Live
              </a>
            )}
            {project.githubClient && (
              <a
                href={project.githubClient}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-gray-800 dark:text-gray-200 hover:underline"
              >
                <Github size={16} /> Client
              </a>
            )}
            {project.githubServer && (
              <a
                href={project.githubServer}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-gray-800 dark:text-gray-200 hover:underline"
              >
                <Github size={16} /> Server
              </a>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
