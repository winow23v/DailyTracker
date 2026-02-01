import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Asset Planner",
  description: "Total Life & Asset Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-50`}
      >
        <ThemeProvider defaultTheme="system" storageKey="life-asset-planner-theme">
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-col flex-1 w-full">
              <Header />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
