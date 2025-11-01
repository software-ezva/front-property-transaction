"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, LogIn } from "lucide-react";
import Button from "@/components/atoms/Button";
import {
  PageTitle,
  EmptyState,
  ErrorState,
  LoadingState,
  BrokerageInfoCard,
  AccessCodeCard,
  TeamMemberTabs,
  JoinBrokerageDialog,
} from "@/components/molecules";
import { useBrokerage } from "@/hooks/use-brokerage";
import { useToast } from "@/hooks/use-toast";
import { ENDPOINTS } from "@/lib/constants";
import { PROFILE_TYPES } from "@/lib/profile-utils";

export default function MyBrokerageClient() {
  const router = useRouter();
  const { brokerage, isLoading, error, refetch, regenerateAccessCode } =
    useBrokerage();
  const [isJoiningBrokerage, setIsJoiningBrokerage] = useState(false);
  const { toast } = useToast();

  const handleRegenerateAccessCode = async () => {
    try {
      await regenerateAccessCode();
      toast({
        title: "Success",
        description: "Access code regenerated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate access code",
        variant: "destructive",
      });
    }
  };

  const handleJoinBrokerage = async (accessCode: string) => {
    try {
      const response = await fetch(
        ENDPOINTS.internal.JOIN_BROKERAGE('brokers'),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join brokerage");
      }

      toast({
        title: "Success",
        description: "Successfully joined the brokerage",
      });

      // Close dialog and reload the page
      setIsJoiningBrokerage(false);
      await refetch();
    } catch (error: any) {
      throw new Error(error.message || "Failed to join brokerage");
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState title="Loading your brokerage information..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Error loading brokerage"
        description={error}
        onRetry={refetch}
      />
    );
  }

  // No brokerage assigned - Show empty state with actions
  if (!brokerage) {
    return (
      <div className="space-y-6">
        <PageTitle
          title="My Brokerage"
          subtitle="You are not currently assigned to any brokerage"
        />

        <EmptyState
          icon={Building2}
          title="No Brokerage Found"
          description="You can create your own brokerage or join an existing one to start managing your business."
          size="lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
          {/* Create Brokerage Card */}
          <div className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
              Create Brokerage
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Start your own brokerage and invite other professionals to join
            </p>
            <Button
              className="w-full"
              onClick={() => router.push("/broker/my-brokerage/create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Brokerage
            </Button>
          </div>

          {/* Join Brokerage Card */}
          <div className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
              Join Brokerage
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Enter an existing brokerage using an invitation code
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsJoiningBrokerage(true)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join Existing Brokerage
            </Button>
          </div>
        </div>

        <JoinBrokerageDialog
          isOpen={isJoiningBrokerage}
          onClose={() => setIsJoiningBrokerage(false)}
          onJoin={handleJoinBrokerage}
        />
      </div>
    );
  }

  // Has brokerage - Show brokerage details
  return (
    <div className="space-y-5">
      <PageTitle title={brokerage.name} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Column - Brokerage Info & Access Code */}
        <div className="lg:col-span-1 space-y-5">
          <BrokerageInfoCard
            email={brokerage.email}
            phoneNumber={brokerage.phoneNumber}
            address={brokerage.address}
            city={brokerage.city}
            county={brokerage.county}
            state={brokerage.state}
          />

          <AccessCodeCard
            accessCode={brokerage.accessCode}
            onRegenerate={handleRegenerateAccessCode}
          />
        </div>

        {/* Right Column - Team Members */}
        <div className="lg:col-span-3">
          <TeamMemberTabs
            brokers={brokerage.brokers}
            agents={brokerage.agents}
            supportingProfessionals={brokerage.supportingProfessionals}
          />
        </div>
      </div>
    </div>
  );
}
