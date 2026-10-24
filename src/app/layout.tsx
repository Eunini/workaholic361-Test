import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talent pipeline · Workaholic360",
  description:
    "A focused talent operations dashboard for tracking candidates from first contact to hired.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
