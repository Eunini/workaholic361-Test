import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/toast/toast-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Talent pipeline · Workaholic360",
  description: "Track candidates from first contact to hired.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
