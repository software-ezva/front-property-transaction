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

    // Only run on root or after login
    if (pathname === "/") {
      if (!user.profile?.profileType) {
        router.replace("/signup/role-selection");
      } else if (user.profile?.profileType === "real_estate_agent") {
        router.replace("/agent/dashboard");
      } else if (user.profile?.profileType === "client") {
        router.replace("/client/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  return null;
}
