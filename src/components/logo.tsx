import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  onlyLogo?: boolean;
};

export function Logo({ onlyLogo }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/images/logo.png" alt="Logo" width={25} height={25} />
      {!onlyLogo && <p className="text-lg font-bold">CyberLevel</p>}
    </Link>
  );
}
