export interface Project {
  id: number; 
  title: string;
  description?: string;
  projectType: "FullStack" | "Frontend" | "Backend";
  technologies: string[];
  features: string[];
  liveLink?: string;
  githubLink?: string;
  thumbnail?: string;
  views: number;
  createdAt: string;
  updatedAt?: string;
}
