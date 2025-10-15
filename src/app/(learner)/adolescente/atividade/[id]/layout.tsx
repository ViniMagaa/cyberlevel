import { ReactNode } from "react";

export default function ArchetypeLayout({ children }: { children: ReactNode }) {
  return (
    <section className="absolute z-50 w-full bg-black">{children}</section>
  );
}
