/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  projectType: "FullStack" | "Frontend" | "Backend";
  githubClient?: string;
  githubServer?: string;
  liveSite?: string;
  technologies: string[];
  features: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`);
      if (!res.ok) throw new Error("Failed to fetch projects 😢");

      const result = await res.json();
      setProjects(result?.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
};
