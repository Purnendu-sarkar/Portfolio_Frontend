"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { LucideIcon, icons } from "lucide-react";
import { useTheme } from "next-themes";

interface SoftSkill {
  id: number;
  title: string;
  shortDesc: string;
  percentage: number;
  type: string;
  icon: string;
}

export default function SoftSkills() {
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  useEffect(() => {
    const fetchSoftSkills = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/soft-skills`
        );
        const data = await res.json();
        setSkills(data.data || []);
      } catch (error) {
        console.error("Error fetching soft skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSoftSkills();
  }, []);

  const categories = [
    "All",
    "Interpersonal",
    "Teamwork",
    "Leadership",
    "ProblemSolving",
    "Creativity",
    "Management",
    "Other",
  ] as const;

  const filteredSkills =
    activeTab === "All"
      ? skills
      : skills.filter((skill) => skill.type === activeTab);

  //  Animation Variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card
          key={i}
          className="h-64 flex flex-col justify-between p-6 rounded-2xl bg-card/50 border shadow-md"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </Card>
      ))}
    </div>
  );

  return (
    <section
      ref={ref}
      id="softskills"
      className="py-20 container mx-auto px-4 transition-colors duration-500"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold tracking-tight">💡 Soft Skills</h2>
        <p className="text-muted-foreground mt-3 text-base">
          A showcase of my interpersonal and professional abilities
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs
        defaultValue="All"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="px-5 py-2 rounded-xl text-sm font-medium border hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            renderSkeleton()
          ) : (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => {
                  const Icon = (icons[skill.icon as keyof typeof icons] ||
                    icons["Star"]) as LucideIcon;
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <Card
                        className="h-64 flex flex-col justify-between p-6 rounded-2xl border shadow-md bg-card/60 backdrop-blur transition-all duration-500 
                        hover:shadow-xl hover:-translate-y-2 hover:bg-accent/10 dark:hover:bg-accent/20"
                      >
                        {/* Top Section */}
                        <div className="flex justify-between items-center">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 10 }}
                            className="p-3 rounded-full bg-primary/15 shadow-inner transition-all duration-500"
                          >
                            <Icon className="w-7 h-7 text-primary drop-shadow-md" />
                          </motion.div>

                          {/* Circular Percentage */}
                          <div className="w-14 h-14">
                            <CircularProgressbar
                              value={skill.percentage}
                              text={`${skill.percentage}%`}
                              styles={buildStyles({
                                pathColor: isDark ? "#374151" : "#e5e7eb",
                                textColor: isDark ? "#ffffff" : "#000000",
                                trailColor: isDark ? "#e5e7eb" : "#111827",
                                textSize: "30px",
                                strokeLinecap: "round",
                                pathTransitionDuration: 0.6,
                              })}
                            />
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <CardContent className="p-0 mt-4 flex flex-col justify-end h-full">
                          <h3 className="text-lg font-semibold">
                            {skill.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {skill.shortDesc}
                          </p>

                          {/* Type */}
                          <span
                            className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium 
                            bg-primary/10 text-primary border border-primary/20 self-start transition-all 
                            duration-300 hover:bg-primary/20 dark:hover:bg-primary/25"
                          >
                            {skill.type}
                          </span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground col-span-full">
                  No soft skills available in this category.
                </p>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
