"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";

export default function AuthRedirect() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    // Only redirect from root page if user doesn't have a profile
    // Let Auth0 returnTo handle direct redirections to /logging-in
    if (pathname === "/") {
      if (!user.profile?.profileType) {
        router.replace("/signup/role-selection");
      } else {
        // If user has profile but is on root, redirect to loading
        router.replace("/logging-in");
      }
    }
  }, [user, isLoading, pathname, router]);

  return null;
}
