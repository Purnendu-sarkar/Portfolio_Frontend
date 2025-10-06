import Navbar from "@/components/shared/Navbar/Navbar";
import ParticlesBackground from "@/components/shared/ParticlesBackground";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <ParticlesBackground />
      <Navbar />
      <main className="min-h-dvh relative z-10">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center relative z-10">
        &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
      </footer>
    </>
  );
}
