import Image from "next/image";

export const Logo = () => {
  return (
    <div className="relative w-[90px] h-[90px]">
      {/* Light mode logo */}
      <Image
        src="/logo_dark.png"
        alt="My Logo"
        fill
        className="object-contain dark:hidden"
      />

      {/* Dark mode logo */}
      <Image
        src="/logo_white.png"
        alt="My Logo"
        fill
        className="object-contain hidden dark:block"
      />
    </div>
  );
};
