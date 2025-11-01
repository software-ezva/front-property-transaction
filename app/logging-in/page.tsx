"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import { ENTERPRISE } from "@/utils/enterprise";
import { Building, Home, Key, CheckCircle } from "lucide-react";
import { getDashboardRoute, getStatusMessage } from "@/lib/profile-utils";

const LoadingPage: React.FC = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { icon: Building, text: "Verifying credentials", delay: 200 },
    { icon: CheckCircle, text: "Ready to go!", delay: 300 },
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/api/auth/login");
      return;
    }

    // Simular pasos de carga
    const timer = setTimeout(() => {
      if (loadingStep < loadingSteps.length - 1) {
        setLoadingStep((prev) => prev + 1);
      } else {
        // After final step, redirect based on user profile using centralized utility
        const redirectRoute = getDashboardRoute(user?.profile?.profileType);
        router.replace(redirectRoute);
      }
    }, loadingSteps[loadingStep]?.delay || 1000);

    return () => clearTimeout(timer);
  }, [loadingStep, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const CurrentIcon = loadingSteps[loadingStep]?.icon || Building;
  const currentText = loadingSteps[loadingStep]?.text || "Loading...";

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Welcome Message with User Name */}
        {user && (
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Welcome back,{" "}
              {user.given_name ||
                user.name?.split(" ")[0] ||
                user.email?.split("@")[0]}
            </h1>
            <p className="text-muted-foreground">
              Setting up your workspace...
            </p>
          </div>
        )}

        {/* Minimal Logo */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <Building className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-medium text-foreground">
            {ENTERPRISE.name}
          </h2>
        </div>

        {/* Minimal Loading Display */}
        <div className="text-center">
          {/* Simple Progress Indicator */}
          <div className="mb-6">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary"></div>
              <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Current Step Text */}
          <p className="text-foreground font-medium mb-2">{currentText}</p>

          {/* Simple Progress Bar */}
          <div className="w-48 mx-auto bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {getStatusMessage(user?.profile?.profileType)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
