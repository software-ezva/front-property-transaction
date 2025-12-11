"use client";

import React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";
import { useClientAuth } from "@/hooks/use-client-auth";

interface WithAuthProps {
  userType: "agent" | "client";
}

interface WithAuthReturn {
  user: any;
  profile: any;
  userForHeader: any;
  isLoading: boolean;
  error: string | null;
}

// Higher-Order Component que wrappea componentes con autenticación y layout
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P & WithAuthReturn>,
  userType: "agent" | "client"
) {
  const AuthRenderer = ({ authHook, props }: { authHook: any; props: P }) => {
    const {
      user,
      agentProfile,
      agentUser,
      agentUserForHeader,
      clientProfile,
      clientUser,
      clientUserForHeader,
      isLoading,
      error,
    } = authHook;

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

    // Extract the appropriate values based on userType
    const profile = userType === "agent" ? agentProfile : clientProfile;
    const fullUser = userType === "agent" ? agentUser : clientUser;
    const userForHeader =
      userType === "agent" ? agentUserForHeader : clientUserForHeader;

    // Render wrapped component with DashboardLayout
    return (
      <DashboardLayout user={userForHeader}>
        <WrappedComponent
          {...props}
          user={user}
          profile={profile}
          fullUser={fullUser}
          userForHeader={userForHeader}
          isLoading={isLoading}
          error={error}
        />
      </DashboardLayout>
    );
  };

  if (userType === "agent") {
    const WithAgentAuth = (props: P) => {
      const authHook = useTransactionCoordinatorAgentAuth();
      return <AuthRenderer authHook={authHook} props={props} />;
    };
    WithAgentAuth.displayName = `withAuth(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;
    return WithAgentAuth;
  } else {
    const WithClientAuth = (props: P) => {
      const authHook = useClientAuth();
      return <AuthRenderer authHook={authHook} props={props} />;
    };
    WithClientAuth.displayName = `withAuth(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;
    return WithClientAuth;
  }
}

// Convenience wrappers
export function withAgentAuth<P extends object>(
  WrappedComponent: React.ComponentType<P & WithAuthReturn>
) {
  return withAuth(WrappedComponent, "agent");
}

export function withClientAuth<P extends object>(
  WrappedComponent: React.ComponentType<P & WithAuthReturn>
) {
  return withAuth(WrappedComponent, "client");
}
