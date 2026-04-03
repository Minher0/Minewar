import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MineWar - Serveur Minecraft Fabric 1.20.1",
  description: "MineWar - Serveur Minecraft Fabric 1.20.1. Un NationGlory mais c'est que entre nous !",
  keywords: ["MineWar", "Minecraft", "Fabric", "1.20.1", "Serveur", "Server", "Multiplayer", "PVP"],
  authors: [{ name: "MineWar Team" }],
  icons: {
    icon: "/logo-minewar.png",
  },
  openGraph: {
    title: "MineWar - Serveur Minecraft Fabric 1.20.1",
    description: "Serveur Minecraft Fabric 1.20.1 entre potes. Rejoins-nous !",
    url: "https://minewar.vercel.app",
    siteName: "MineWar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MineWar - Serveur Minecraft Fabric 1.20.1",
    description: "Serveur Minecraft Fabric 1.20.1 entre potes. Rejoins-nous !",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
