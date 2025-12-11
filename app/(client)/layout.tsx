"use client";

import type React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import { useClientAuth } from "@/hooks/use-client-auth";
import Button from "@/components/atoms/Button";
import LoadingState from "@/components/molecules/LoadingState";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clientUserForHeader, isLoading, error } = useClientAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState title="Loading..." />
      </div>
    );
  }

  // Error state
  if (error) {
    const isSessionError = error === "No user session found.";

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6 bg-card rounded-lg border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {isSessionError ? "Authentication Required" : "Error"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isSessionError ? "Please log in to access this page." : error}
          </p>

          {isSessionError ? (
            <Button onClick={() => (window.location.href = "/auth/login")}>
              Log In
            </Button>
          ) : (
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          )}
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
