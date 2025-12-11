"use client";

import { useState } from "react";
import {
  User,
  Briefcase,
  Users,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import { MemberCard } from "@/components/molecules/MemberCard";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import { useTransactionPeople } from "@/hooks/use-transaction-people";
import { useToast } from "@/hooks/use-toast";

interface TransactionPeopleTabProps {
  transactionId: string;
  readOnly?: boolean;
}

export default function TransactionPeopleTab({
  transactionId,
  readOnly = false,
}: TransactionPeopleTabProps) {
  const { people, loading, error, regenerating, regenerateAccessCode } =
    useTransactionPeople(transactionId);
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);

  // Handle potential snake_case from API
  const accessCode = people?.accessCode || (people as any)?.access_code;

  const handleCopyCode = async () => {
    if (!accessCode) return;

    const textToCopy = accessCode;

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;

        // Ensure textarea is not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Copy command failed");
        }
      }

      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast({
        title: "Access code copied",
        description: "The access code has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy access code:", error);
      toast({
        title: "Copy failed",
        description:
          "Could not copy access code to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateCode = async () => {
    try {
      await regenerateAccessCode();
      toast({
        title: "Access code regenerated",
        description: "A new access code has been generated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error regenerating code",
        description: "Failed to regenerate the access code. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingState title="Loading people..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading people"
        description={error}
        icon={Users}
        actionLabel="Retry"
        onAction={() => window.location.reload()} // Simple reload for now, or pass refetch
      />
    );
  }

  if (!people) {
    return (
      <EmptyState
        title="No people found"
        description="No people information available for this transaction."
        icon={Users}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Access Code Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Transaction Access Code
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Share this code with clients and professionals to give them access
              to this transaction.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border">
            <code className="text-xl font-mono font-bold tracking-wider text-foreground">
              {accessCode || "No Code"}
            </code>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                disabled={!accessCode}
                className="h-8 w-8 p-0"
                title="Copy Code"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateCode}
                  disabled={regenerating}
                  className="h-8 w-8 p-0"
                  title="Regenerate Code"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`}
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Client */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4" /> Client
          </h3>
          {people.client ? (
            <MemberCard
              fullName={people.client.fullName}
              email={people.client.email}
              badge="Client"
              icon={User}
              iconColor="text-blue-500"
              iconBgColor="bg-blue-500/10"
            />
          ) : (
            <MemberCard
              isEmpty
              icon={User}
              iconColor="text-muted-foreground"
              iconBgColor="bg-muted"
              badge="No Client Assigned"
            />
          )}
        </div>

        {/* Real Estate Agent */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Real Estate Agent
          </h3>
          {people.realEstateAgent ? (
            <MemberCard
              fullName={people.realEstateAgent.fullName}
              email={people.realEstateAgent.email}
              badge="Agent"
              icon={Briefcase}
              iconColor="text-purple-500"
              iconBgColor="bg-purple-500/10"
            />
          ) : (
            <MemberCard
              isEmpty
              icon={Briefcase}
              iconColor="text-muted-foreground"
              iconBgColor="bg-muted"
              badge="No Agent Assigned"
            />
          )}
        </div>

        {/* Supporting Professionals */}
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4" /> Supporting Professionals
          </h3>
          <div className="space-y-4">
            {people.supportingProfessionals.length > 0 ? (
              people.supportingProfessionals.map((prof) => (
                <MemberCard
                  key={prof.id}
                  fullName={prof.fullName}
                  email={prof.email}
                  badge={prof.professionOf}
                  icon={Users}
                  iconColor="text-orange-500"
                  iconBgColor="bg-orange-500/10"
                />
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-lg text-center">
                No supporting professionals added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
