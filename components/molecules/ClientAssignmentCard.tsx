import { useState, useEffect } from "react";
import { User, Copy, Mail } from "lucide-react";
import Button from "@/components/atoms/Button";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import { ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/lib/api-internal";

interface ClientAssignmentCardProps {
  transaction: Transaction;
  onClientAssignment: (clientId: string) => Promise<void>;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function ClientAssignmentCard({
  transaction,
  onClientAssignment,
}: ClientAssignmentCardProps) {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [isAssigningClient, setIsAssigningClient] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const data = await apiClient.get(ENDPOINTS.internal.CLIENT_PROFILE);
      setClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoadingClients(false);
    }
  };

  // Load clients when showing dropdown
  useEffect(() => {
    if (showClientDropdown && clients.length === 0) {
      fetchClients();
    }
  }, [showClientDropdown]);

  // Handle client assignment
  const handleClientAssignment = async (clientId: string) => {
    setIsAssigningClient(true);
    try {
      await onClientAssignment(clientId);
      setShowClientDropdown(false);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsAssigningClient(false);
    }
  };

  const renderClientDropdown = () => (
    <div className="mt-4 p-3 border border-border rounded-lg bg-card">
      <label className="block text-sm font-medium text-foreground mb-2">
        {transaction.clientName ? "Reassign Client" : "Select Client"}
      </label>
      <div className="flex gap-2">
        <select
          className="flex-1 px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          disabled={loadingClients || isAssigningClient}
          onChange={(e) => {
            if (e.target.value) {
              handleClientAssignment(e.target.value);
            }
          }}
          defaultValue=""
        >
          <option value="">
            {loadingClients ? "Loading clients..." : "Select a client"}
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName} - {client.email}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowClientDropdown(false)}
          disabled={isAssigningClient}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  if (transaction.clientName) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-secondary" />
          <h3 className="text-lg font-semibold text-foreground">
            Client Information
          </h3>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">
                {transaction.clientName}
              </h4>
              <p className="text-sm text-muted-foreground">
                {transaction.clientEmail || "Email not provided"}
              </p>
            </div>
            <div className="flex space-x-2">
              {/* Copy phone number to clipboard */}
              {transaction.clientPhoneNumber && (
                <Button
                  variant="outline"
                  size="sm"
                  title="Copy phone number"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      transaction.clientPhoneNumber || ""
                    );
                    toast({
                      title: "Phone number copied",
                      description: "Phone number copied to clipboard",
                      variant: "default",
                    });
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}

              {/* Email client */}
              {transaction.clientEmail && (
                <Button
                  variant="outline"
                  size="sm"
                  title="Send email"
                  onClick={() => {
                    window.location.href = `mailto:${transaction.clientEmail}`;
                  }}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">
                {transaction.clientPhoneNumber || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property Value:</span>
              <span className="font-medium">
                $
                {(
                  transaction.propertyPrice ||
                  transaction.propertyValue ||
                  0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold text-foreground">
          Client Information
        </h3>
      </div>
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="text-center mb-4">
          <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-3">
            No client assigned to this transaction
          </p>
        </div>

        {!showClientDropdown ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowClientDropdown(true)}
          >
            Assign Client
          </Button>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Select Client
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={loadingClients || isAssigningClient}
                onChange={(e) => {
                  if (e.target.value) {
                    handleClientAssignment(e.target.value);
                  }
                }}
                defaultValue=""
              >
                <option value="">
                  {loadingClients ? "Loading clients..." : "Select a client"}
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName} - {client.email}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClientDropdown(false)}
                disabled={isAssigningClient}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
