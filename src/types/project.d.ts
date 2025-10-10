export interface Project {
  id: number;
  title: string;
  description?: string;
  projectType: "FullStack" | "Frontend" | "Backend";
  githubClient?: string;
  githubServer?: string;
  technologies: string[];
  features: string[];
  liveLink?: string;
  githubLink?: string;
  thumbnail?: string;
  views: number;
  createdAt: string;
  updatedAt?: string;
}
