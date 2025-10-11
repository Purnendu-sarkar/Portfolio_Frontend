"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { easeInOut, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { Tech } from "@/types/techStack";

export default function TechStack() {
  const [techs, setTechs] = useState<Tech[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/techs`);
        const data = await res.json();
        setTechs(data.data || []);
      } catch (error) {
        console.error("Error fetching techs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, []);

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Tools",
    "Database",
  ] as const;
  const filteredTechs = (category: string) =>
    category === "All" ? techs : techs.filter((t) => t.category === category);

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card
          key={i}
          className="p-5 flex flex-col items-center justify-center h-40"
        >
          <Skeleton className="w-16 h-16 rounded-md mb-3" />
          <Skeleton className="h-4 w-20" />
        </Card>
      ))}
    </div>
  );

  const floatingAnimation = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  return (
    <section ref={ref} className="py-20 container mx-auto px-4">
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold tracking-tight">💻 Tech Stack</h2>
        <p className="text-muted-foreground mt-3 text-base">
          Tools & Technologies I work with regularly
        </p>
      </motion.div>

      {/* Tabs Section */}
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="px-5 py-2 rounded-xl text-sm font-medium transition border hover:bg-accent hover:text-accent-foreground"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            {loading ? (
              renderSkeleton()
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
              >
                {filteredTechs(cat).length > 0 ? (
                  filteredTechs(cat).map((tech, index) => (
                    <motion.div
                      key={tech.id}
                      variants={floatingAnimation}
                      animate="animate"
                      transition={{
                        delay: (index % 5) * 0.2,
                      }}
                      whileHover={{
                        scale: 1.07,
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      }}
                      className="flex items-center justify-center"
                    >
                      <Card className="flex flex-col items-center justify-center text-center h-40 w-full p-5 rounded-2xl bg-card/70 backdrop-blur border shadow-sm hover:shadow-lg transition-all">
                        {tech.image ? (
                          <div className="relative w-16 h-16 mb-3 flex items-center justify-center">
                            <Image
                              src={tech.image}
                              alt={tech.name}
                              width={64}
                              height={64}
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Skeleton className="w-16 h-16 rounded-md mb-3" />
                        )}
                        <CardContent className="p-0">
                          <p className="text-sm font-medium text-muted-foreground">
                            {tech.name}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground col-span-full">
                    No techs found in this category.
                  </p>
                )}
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
