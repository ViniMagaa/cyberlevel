"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 800);
    };
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex h-screen items-center justify-center overflow-hidden">
          <Image
            width={448}
            height={448}
            src="/images/loader.svg"
            alt="Carregando..."
          />
        </div>
      )}
      <main
        className={
          loading
            ? "h-screen overflow-hidden opacity-0"
            : "opacity-100 transition-opacity duration-1000"
        }
      >
        {children}
      </main>
    </>
  );
}
