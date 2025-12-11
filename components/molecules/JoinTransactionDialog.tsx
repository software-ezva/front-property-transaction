"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";

interface JoinTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JoinTransactionDialog({
  isOpen,
  onClose,
  onSuccess,
}: JoinTransactionDialogProps) {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setIsLoading(true);
    try {
      await apiClient.post(
        `${ENDPOINTS.internal.TRANSACTIONS}/join-with-code`,
        {
          accessCode: accessCode.trim(),
        }
      );

      toast({
        title: "Success",
        description: "Successfully joined the transaction",
        variant: "default",
      });

      onSuccess();
      onClose();
      setAccessCode("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join transaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Transaction</DialogTitle>
          <DialogDescription>
            Enter the access code provided by your transaction coordinator to
            join an existing transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="accessCode" className="text-sm font-medium">
              Access Code
            </label>
            <Input
              id="accessCode"
              placeholder="Enter code (e.g. XYZ123)"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!accessCode.trim() || isLoading}>
              {isLoading ? "Joining..." : "Join Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
