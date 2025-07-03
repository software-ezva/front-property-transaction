"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, User, FileText } from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

const mockProperties = [
  {
    id: "1",
    title: "Modern downtown apartment",
    price: 350000,
    location: "Downtown, New York",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    type: "Apartment",
    status: "available",
  },
  {
    id: "2",
    title: "Family house with garden",
    price: 450000,
    location: "Suburbs, Los Angeles",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    type: "House",
    status: "available",
  },
  {
    id: "3",
    title: "Luxury penthouse",
    price: 750000,
    location: "Manhattan, New York",
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
    type: "Penthouse",
    status: "available",
  },
  {
    id: "4",
    title: "Cozy studio apartment",
    price: 280000,
    location: "Brooklyn, New York",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    type: "Studio",
    status: "available",
  },
];

const mockClients = [
  {
    id: "1",
    name: "Carlos Rodriguez",
    email: "carlos@email.com",
    phone: "+1 (555) 123-4567",
    budget: { min: 300000, max: 500000 },
  },
  {
    id: "2",
    name: "Maria Lopez",
    email: "maria@email.com",
    phone: "+1 (555) 987-6543",
    budget: { min: 400000, max: 600000 },
  },
  {
    id: "3",
    name: "Juan Martinez",
    email: "juan@email.com",
    phone: "+1 (555) 456-7890",
    budget: { min: 500000, max: 800000 },
  },
  {
    id: "4",
    name: "Sofia Chen",
    email: "sofia@email.com",
    phone: "+1 (555) 321-0987",
    budget: { min: 250000, max: 400000 },
  },
];

interface TransactionFormData {
  propertyId: string;
  clientId: string;
  notes: string;
  transactionType:
    | "Purchase"
    | "Listing for Sale"
    | "Listing for Lease"
    | "Lease"
    | "Other";
}

export default function CreateTransactionClient() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [formData, setFormData] = useState<TransactionFormData>({
    propertyId: "",
    clientId: "",
    notes: "",
    transactionType: "Purchase",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user session found.</div>;
  if (!user.profile) return <div>No agent profile found.</div>;

  // Prepara el usuario para DashboardLayout
  const agentProfile = user.profile as {
    esignName: string;
    esignInitials: string;
    licenseNumber: string;
    profileType: string;
  };

  const agentUserForHeader = {
    name: String(user.first_name + " " + user.last_name) || user.name || "",
    profile: agentProfile.profileType?.replace(/_/g, " ") || "agent",
    avatar: String(user.picture) || "",
  };

  const selectedProperty = mockProperties.find(
    (p) => p.id === formData.propertyId
  );
  const selectedClient = mockClients.find((c) => c.id === formData.clientId);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = "Property selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generar ID de transacción simulado
      const newTransactionId = `txn_${Date.now()}`;

      console.log("Transaction created:", {
        id: newTransactionId,
        ...formData,
        agentId: "agent-1", // ID del agente actual
        createdAt: new Date().toISOString(),
      });

      // Redirigir a la página de detalles de la transacción
      router.push(`/agent/transactions/${newTransactionId}`);
    } catch (error) {
      console.error("Error creating transaction:", error);
      setErrors({ general: "Failed to create transaction. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof TransactionFormData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const calculateCommission = (price: number) => {
    return Math.round(price * 0.03); // 3% commission
  };

  return (
    <DashboardLayout user={agentUserForHeader}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/agent/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-primary">
              Create New Transaction
            </h1>
            <p className="text-muted-foreground font-secondary">
              Set up a new real estate transaction
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-lg p-6 border border-border space-y-6"
            >
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-destructive text-sm">{errors.general}</p>
                </div>
              )}

              {/* Transaction Type */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Transaction Type <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "Purchase", label: "Purchase" },
                    { value: "Lease", label: "Lease" },
                    { value: "Listing for Sale", label: "Listing for Sale" },
                    { value: "Listing for Lease", label: "Listing for Lease" },
                    { value: "Other", label: "Other" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        handleInputChange("transactionType", type.value)
                      }
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        formData.transactionType === type.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Selection */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Property <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) =>
                    handleInputChange("propertyId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.propertyId ? "border-destructive" : "border-input"
                  }`}
                  required
                >
                  <option value="">Select a property</option>
                  {mockProperties
                    .filter((p) => p.status === "available")
                    .map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title} - ${property.price.toLocaleString()} (
                        {property.location})
                      </option>
                    ))}
                </select>
                {errors.propertyId && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.propertyId}
                  </p>
                )}
              </div>

              {/* Client Selection */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Client{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) =>
                    handleInputChange("clientId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No client assigned</option>
                  {mockClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  You can assign a client later if needed
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                  placeholder="Add any additional notes or special instructions..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <Link href="/agent/transactions" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.propertyId}
                  className="flex-1"
                >
                  {isSubmitting
                    ? "Creating Transaction..."
                    : "Create Transaction"}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview/Summary */}
          <div className="space-y-6">
            {/* Property Preview */}
            {selectedProperty && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Selected Property
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {selectedProperty.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedProperty.location}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-1 font-medium">
                        {selectedProperty.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Area:</span>
                      <span className="ml-1 font-medium">
                        {selectedProperty.area}m²
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bedrooms:</span>
                      <span className="ml-1 font-medium">
                        {selectedProperty.bedrooms}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bathrooms:</span>
                      <span className="ml-1 font-medium">
                        {selectedProperty.bathrooms}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="text-xl font-bold text-primary">
                        ${selectedProperty.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted-foreground">
                        Est. Commission (3%):
                      </span>
                      <span className="font-semibold text-accent">
                        $
                        {calculateCommission(
                          selectedProperty.price
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Preview */}
            {selectedClient && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-foreground">
                    Selected Client
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {selectedClient.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.phone}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Budget Range:
                      </span>
                      <div className="font-medium">
                        ${selectedClient.budget.min.toLocaleString()} - $
                        {selectedClient.budget.max.toLocaleString()}
                      </div>
                    </div>
                    {selectedProperty && (
                      <div className="mt-2">
                        {selectedProperty.price >= selectedClient.budget.min &&
                        selectedProperty.price <= selectedClient.budget.max ? (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            ✓ Within budget
                          </span>
                        ) : (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                            ⚠ Outside budget range
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Summary */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-tertiary" />
                <h3 className="font-semibold text-foreground">
                  Transaction Summary
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">
                    {formData.transactionType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent:</span>
                  <span className="font-medium">{agentUserForHeader.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-medium">
                    {selectedClient?.name || "Not assigned"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
