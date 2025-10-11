export interface Tech {
  id: number;
  name: string;
  category: "Frontend" | "Backend" | "Tools" | "Database";
  image?: string;
}