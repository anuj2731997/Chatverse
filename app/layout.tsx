import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Providers} from "./provider"

import {ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatverse",
  description: "Chatverse is a chat application built with Next.js, Convex, Clerk and TypeScript.",
  icons:{
    icon:"/chatverse.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <ClerkProvider>
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
    </ClerkProvider>
      </body>
    </html>

  );
}
