"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";

interface BlogDetailsData {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  createdAt?: string;
  views?: number;
}

interface BlogDetailsProps {
  data: BlogDetailsData;
}

export default function BlogDetailsCard({ data }: BlogDetailsProps) {
  const { resolvedTheme } = useTheme();

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
        <Image
          src={data.thumbnail}
          alt={data.title}
          width={800}
          height={450}
          className="rounded-2xl shadow-lg mb-6 w-full object-cover"
        />

        <h1 className="text-4xl font-extrabold mb-4">{data.title}</h1>

        {(data.createdAt || data.views) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            {data.createdAt && (
              <span>📅 {new Date(data.createdAt).toDateString()}</span>
            )}
            {data.views !== undefined && <span>🔥 {data.views} views</span>}
          </div>
        )}

        <Separator className="my-6" />

        <article className="prose prose-lg dark:prose-invert max-w-none">
          {data.content}
        </article>

        <div className="flex gap-2 mt-8 flex-wrap">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 text-sm rounded-full ${
                resolvedTheme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
