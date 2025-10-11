"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutData {
  id: number;
  name: string;
  positions: string[];
  bio: string;
  profilePic: string;
}

const AboutSection = () => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/about`);
        const data = await res.json();

        if (data?.data?.length) setAbout(data.data[0]);
        else if (data?.data) setAbout(data.data);
      } catch (error) {
        console.error("Failed to fetch about info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Skeleton className="w-full h-80 rounded-xl" />
      </div>
    );
  }

  if (!about) {
    return (
      <div className="text-center text-gray-500 py-20">
        No About information available.
      </div>
    );
  }

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6 py-28"
    >
      {/* Left Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full md:w-1/2 h-72 md:h-[420px]"
      >
        <Image
          src={about.profilePic}
          alt={about.name}
          fill
          className="object-cover rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        />
      </motion.div>

      {/* Right Side - Text */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 md:w-1/2 text-center md:text-left"
      >
        <h2 className="text-xl font-bold mb-4 text ">
          <span className="text-gray-800 dark:text-gray-200">ABOUT</span>{" "}
          <span className="text-chart-1">ME</span>
        </h2>

        <h3 className="text-3xl md:text-5xl font-bold mb-2">
          <span className="text-gray-700 dark:text-gray-300">I’m</span>{" "}
          <span className="text-chart-1">{about.name}</span>
        </h3>

        <div className="text-lg md:text-xl font-medium mb-4">
          <span className="text-gray-600 dark:text-gray-400 mr-2">
            I’m skilled in
          </span>
          <span className="text-chart-1 font-semibold">
            <TypeAnimation
              sequence={about.positions.flatMap((pos) => [pos, 2000])}
              wrapper="span"
              speed={70}
              repeat={Infinity}
            />
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
          {about.bio}
        </p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
