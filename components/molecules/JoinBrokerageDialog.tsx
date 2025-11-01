"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";

interface JoinBrokerageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (accessCode: string) => Promise<void>;
}

export function JoinBrokerageDialog({
  isOpen,
  onClose,
  onJoin,
}: JoinBrokerageDialogProps) {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate access code format (6 characters, alphanumeric)
    const codePattern = /^[A-Z0-9]{6}$/i;
    if (!codePattern.test(accessCode.trim())) {
      setError("Access code must be 6 alphanumeric characters (e.g., ABC123)");
      return;
    }

    setIsLoading(true);
    try {
      await onJoin(accessCode.trim().toUpperCase());
      // Success - dialog will be closed by parent component
    } catch (err: any) {
      setError(err.message || "Failed to join brokerage");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAccessCode("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Join Brokerage
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="accessCode"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Access Code
            </label>
            <Input
              id="accessCode"
              type="text"
              placeholder="ABC123"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value.toUpperCase());
                setError("");
              }}
              maxLength={6}
              className="font-mono text-lg tracking-wider"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the 6-character code provided by the brokerage
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !accessCode.trim()}
              className="flex-1"
            >
              {isLoading ? "Joining..." : "Join Brokerage"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
