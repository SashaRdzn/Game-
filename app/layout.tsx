import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEMORIA — Remote Recovery System",
  description: "Интерактивная детективная история в оболочке забытой операционной системы.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
