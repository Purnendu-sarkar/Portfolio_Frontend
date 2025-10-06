"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface BlogData {
  id: number | string;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  href?: string;
}

interface BlogCardProps {
  data: BlogData;
}

export default function BlogCard({ data }: BlogCardProps) {
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={data.href || `/blogs/${data.id}`}>
        <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
          <Image
            src={data.thumbnail}
            alt={data.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
          <CardHeader>
            <CardTitle className="line-clamp-2">{data.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {data.content}
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded-full ${
                    resolvedTheme === "dark"
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
