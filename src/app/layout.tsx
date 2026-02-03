import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import ResponsiveNav from "@/components/layout/ResponsiveNav";
import TopBar from "@/components/layout/TopBar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import FAB from '@/components/ui/FAB'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoKr = Noto_Sans_KR({
  variable: '--font-noto-kr',
  weight: ['400','700'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoKr.variable} antialiased bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-50`}
      >
        <style>{`
          :root {
            --color-bg: var(--color-bg);
            --color-surface: var(--color-surface);
            --color-muted: var(--color-muted);
            --color-accent: var(--color-accent);
            --color-success: var(--color-success);
            --color-warning: var(--color-warning);
            --color-danger: var(--color-danger);
            --radius-card: var(--radius-card);
            --spacing-base: var(--spacing-base);
          }
        `}</style>
        <ThemeProvider defaultTheme="system" storageKey="life-asset-planner-theme">
          <div className="flex min-h-screen w-full">
            <ResponsiveNav />
            <div className="flex flex-col flex-1 w-full">
              <TopBar />
              <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>
          </div>
          <Toaster richColors />
          <FAB />
        </ThemeProvider>
      </body>
    </html>
  );
}
