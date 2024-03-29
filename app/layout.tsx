import { Aperture, LayoutList, Pencil, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Toaster } from "@/lib/hooks/Toast/provider";
import Prisma from "@/lib/prisma";
import type { UserProfile } from "@/lib/type";

import { CommentProvider } from "@/components/Comment/provider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { UserProvider } from "@/components/User/provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: "/favicon.ico",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    {
      name: "文章",
      link: "/posts",
      icon: <Pencil className="h-5 w-5" />,
    },
    {
      name: "动态",
      link: "/moments",
      icon: <Aperture className="h-5 w-5" />,
    },
    {
      name: "关于",
      link: "/about",
      icon: <UserRound className="h-5 w-5" />,
    },
  ];

  let userData: UserProfile | undefined = undefined;

  const userSession = cookies().get("USER_SESSION");

  if (userSession) {
    const user = await Prisma.user.findFirst({
      select: {
        name: true,
        site_url: true,
        tag: true,
      },
      where: {
        email_md5: userSession.value,
        banned: false,
      },
    });

    if (user) {
      const commentCount = await Prisma.comment.count({
        where: {
          user_email_md5: userSession.value,
          published: true,
        },
      });
      const replyCount = await Prisma.reply.count({
        where: {
          user_email_md5: userSession.value,
          published: true,
        },
      });

      userData = {
        name: user.name,
        emailMdD5: userSession.value,
        siteUrl: user.site_url,
        tag: user.tag,
        commentCount: commentCount,
        replyCount: replyCount,
      };
    }
  }

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
        <link
          rel="stylesheet"
          href="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/github-dark-dimmed.min.css"
        ></link>
      </head>
      <body className="font-regular">
        <UserProvider userData={userData}>
          <Header
            items={menuItems}
            userData={userData}
            isLogin={!!userData}
          />
          <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-4xl px-4 pb-20 pt-20 sm:pb-0">
            <CommentProvider>{children}</CommentProvider>
          </main>
          <Footer />
          <Menu items={menuItems} />
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
