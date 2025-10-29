import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  onlyLogo?: boolean;
  path?: string;
};

export function Logo({ onlyLogo, path }: LogoProps) {
  return (
    <Link href={path || "/"} className="flex items-center gap-2">
      <Image src="/images/logo.png" alt="Logo" width={25} height={25} />
      {!onlyLogo && <p className="text-lg font-bold">CyberLevel</p>}
    </Link>
  );
}
