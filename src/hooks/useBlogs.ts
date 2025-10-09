/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export interface Blog {
  id: number;
  title: string;
  content: string; 
  thumbnail?: string; 
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string; 
}


export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs?limit=500&page=1`, {
          next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error("Failed to fetch blogs 😢");

        const result = await res.json();
        setBlogs(result?.data.blogs || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { blogs, loading, error };
};
