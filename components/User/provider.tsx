"use client";

import { ReactNode, createContext, useState } from "react";

import type { UserProfile } from "@/lib/type";

import { UserForm, UserProfileDialog } from ".";

export const UserContext = createContext<{
  isLogin: boolean;
  userData?: UserProfile;
  setUserFormOpen: (open: boolean) => void;
  setUserProfileOpen: (open: boolean) => void;
}>({
  isLogin: false,
  setUserFormOpen: () => {},
  setUserProfileOpen: () => {},
});

export const UserProvider: React.FC<{
  children: ReactNode;
  userData?: {
    name: string;
    emailMdD5: string;
    siteUrl: string;
    tag: string;
    commentCount: number;
    replyCount: number;
  };
}> = ({ children, userData }) => {
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);

  return (
    <UserContext.Provider
      value={{
        isLogin: userData ? true : false,
        userData,
        setUserFormOpen,
        setUserProfileOpen,
      }}
    >
      {children}
      {userData ? (
        <UserProfileDialog
          data={userData}
          open={userProfileOpen}
          setOpen={setUserProfileOpen}
        />
      ) : (
        <UserForm
          open={userFormOpen}
          setOpen={setUserFormOpen}
        />
      )}
    </UserContext.Provider>
  );
};
