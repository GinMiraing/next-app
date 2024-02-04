import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Menu from "@/components/Menu";

import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="stylesheet"
          href="https://s1.hdslb.com/bfs/static/jinkela/long/font/medium.css"
        />
        <link
          rel="stylesheet"
          href="https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css"
        />
      </head>
      <body className="font-regular">
        <Header />
        <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-5xl px-6 pb-20 pt-20 sm:pb-0">
          {children}
        </main>
        <Footer />
        <Menu />
      </body>
    </html>
  );
}
