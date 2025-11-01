"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccessCodeCardProps {
  accessCode?: string;
  onRegenerate: () => Promise<void>;
}

export function AccessCodeCard({
  accessCode,
  onRegenerate,
}: AccessCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    if (!accessCode) return;
    await navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Access Code
      </h2>
      {accessCode ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 bg-muted px-4 py-3 rounded-md font-mono text-lg tracking-wider">
              {accessCode}
            </div>
            <button
              onClick={handleCopy}
              className="p-3 hover:bg-muted rounded-md transition-colors"
              title="Copy access code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
          <Button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            variant="outline"
            className="w-full"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Access Code
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Share this code with team members to invite them to join your
            brokerage
          </p>
        </div>
      ) : (
        <div className="text-center p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
          <p className="text-xs text-muted-foreground">
            No access code available
          </p>
        </div>
      )}
    </div>
  );
}
