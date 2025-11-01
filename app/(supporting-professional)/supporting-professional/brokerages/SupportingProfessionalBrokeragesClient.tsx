"use client";

import { useState } from "react";
import { Building2, LogIn, MapPin, Mail, Phone } from "lucide-react";
import Button from "@/components/atoms/Button";
import {
  PageTitle,
  EmptyState,
  ErrorState,
  LoadingState,
  JoinBrokerageDialog,
} from "@/components/molecules";
import { useToast } from "@/hooks/use-toast";
import { useBrokerages } from "@/hooks/use-brokerages";

export default function SupportingProfessionalBrokeragesClient() {
  const { brokerages, isLoading, error, refetch } = useBrokerages();
  const [isJoiningBrokerage, setIsJoiningBrokerage] = useState(false);
  const { toast } = useToast();

  const handleJoinBrokerage = async (accessCode: string) => {
    try {
      const response = await fetch(
        "/api/supporting-professionals/brokerage/join",
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

      // Close dialog and reload
      setIsJoiningBrokerage(false);
      await refetch();
    } catch (error: any) {
      throw new Error(error.message || "Failed to join brokerage");
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState title="Loading your brokerages..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Error loading brokerages"
        description={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Join Button */}
      <div className="flex items-center justify-between">
        <div className="block">
          <PageTitle
            title="My Brokerages"
            subtitle="Manage the brokerages you're associated with"
          />
        </div>
        <Button onClick={() => setIsJoiningBrokerage(true)}>
          <LogIn className="w-4 h-4 mr-2" />
          Join Brokerage
        </Button>
      </div>

      {/* No brokerages - Empty State */}
      {brokerages.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            icon={Building2}
            title="No Brokerages Found"
            description="You are not currently associated with any brokerage. Join an existing brokerage using an access code to start collaborating."
            size="lg"
          />

          <div className="max-w-md mx-auto mt-8">
            <div className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                Join a Brokerage
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Enter an access code provided by a brokerage to join and start
                providing your professional services
              </p>
              <Button
                className="w-full"
                onClick={() => setIsJoiningBrokerage(true)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Join Using Access Code
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Brokerages Grid - 2 Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brokerages.map((brokerage) => (
            <div
              key={brokerage.id}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {brokerage.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {brokerage.address && (
                  <div className="flex items-start space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{brokerage.address}</p>
                      {(brokerage.city || brokerage.state) && (
                        <p>
                          {[brokerage.city, brokerage.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {brokerage.email && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{brokerage.email}</span>
                  </div>
                )}

                {brokerage.phoneNumber && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{brokerage.phoneNumber}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Team Members</span>
                  <span className="font-medium text-foreground">
                    {(brokerage.brokers?.length || 0) +
                      (brokerage.agents?.length || 0) +
                      (brokerage.supportingProfessionals?.length || 0)}{" "}
                    members
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Brokerage Dialog */}
      <JoinBrokerageDialog
        isOpen={isJoiningBrokerage}
        onClose={() => setIsJoiningBrokerage(false)}
        onJoin={handleJoinBrokerage}
      />
    </div>
  );
}
