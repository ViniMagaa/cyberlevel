import { ReactNode } from "react";

export default function ArchetypeLayout({ children }: { children: ReactNode }) {
  return (
    <section className="absolute z-30 min-h-screen w-full bg-black">
      {children}
    </section>
  );
}
