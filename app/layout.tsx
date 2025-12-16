import type React from "react";
import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import AuthRedirect from "./_auth-redirect";
import { ErrorNotificationProvider } from "@/hooks/use-error-notification";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PropManager - Real Estate Management Platform",
  description:
    "The comprehensive platform for real estate agents and clients. Manage properties, transactions, and business relationships efficiently.",
  keywords: [
    "real estate",
    "property management",
    "transactions",
    "agents",
    "clients",
  ],
  authors: [{ name: "PropManager Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DEBUG: Log environment variables at runtime
  console.log("--- [DEBUG] RUNTIME ENVIRONMENT VARIABLES ---");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("APP_BASE_URL:", process.env.APP_BASE_URL);
  console.log("BACKEND_API_URL:", process.env.BACKEND_API_URL);
  console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
  console.log("AUTH0_CLIENT_ID:", process.env.AUTH0_CLIENT_ID);
  console.log("AUTH0_SECRET (Exists?):", !!process.env.AUTH0_SECRET);
  console.log(
    "AUTH0_CLIENT_SECRET (Exists?):",
    !!process.env.AUTH0_CLIENT_SECRET
  );
  console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);
  console.log("AUTH0_SCOPE:", process.env.AUTH0_SCOPE);
  console.log("AUTH0_COOKIE_SAME_SITE:", process.env.AUTH0_COOKIE_SAME_SITE);
  console.log("AUTH0_COOKIE_SECURE:", process.env.AUTH0_COOKIE_SECURE);
  console.log("---------------------------------------------");

  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorNotificationProvider>
          {children}
          <Toaster />
        </ErrorNotificationProvider>
      </body>
    </html>
  );
}
