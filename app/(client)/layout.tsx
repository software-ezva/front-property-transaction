"use client";

import type React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import { useClientAuth } from "@/hooks/use-client-auth";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clientUserForHeader, isLoading, error } = useClientAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={clientUserForHeader || undefined}>
      {children}
    </DashboardLayout>
  );
}
