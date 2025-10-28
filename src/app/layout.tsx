import Preloader from "@/components/preloader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CyberLevel",
  description:
    "Uma plataforma de Cibersegurança focada em crianças e adolescentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${nunitoSans.className} bg-black text-white antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="#2db487" // cor da barra
            height={3} // altura da barra (em px)
            showSpinner={false} // desativa o spinner
            crawlSpeed={300} // velocidade da animação
            shadow="none" // remove sombra
          />
          {/* {children} */}
          <Preloader>{children}</Preloader>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
