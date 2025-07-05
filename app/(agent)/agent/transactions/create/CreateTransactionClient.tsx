"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, User, FileText } from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import PageTitle from "@/components/molecules/PageTitle";
import ReturnTo from "@/components/molecules/ReturnTo";
import { ENDPOINTS } from "@/lib/constants";
import type { SimpleUserResponseDto } from "@/types/api";

export default function CreateTransactionClient() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [clients, setClients] = useState<SimpleUserResponseDto[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [formData, setFormData] = useState<TransactionFormData>({
    propertyId: "",
    clientId: "",
    notes: "",
    transactionType: "Purchase",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(ENDPOINTS.internal.PROPERTIES);
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(ENDPOINTS.internal.CLIENT_PROFILE);
        if (!response.ok) throw new Error("Failed to fetch clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  interface TransactionFormData {
    propertyId: string;
    clientId: string;
    notes: string;
    transactionType: string;
  }

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

  const selectedProperty = properties.find(
    (p) => String(p.id) === formData.propertyId
  );
  const selectedClient = clients.find(
    (c) => c.id === Number(formData.clientId)
  );

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
      // Construir el payload según lo que espera la API
      const payload = {
        propertyId: Number(formData.propertyId),
        agentId: user.profile?.id, // Asegúrate que el id del agente esté en el perfil
        clientId: formData.clientId ? Number(formData.clientId) : undefined,
        transactionType: formData.transactionType,
        additionalNotes: formData.notes,
      };

      const response = await fetch(ENDPOINTS.internal.TRANSACTIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create transaction");
      const data = await response.json();

      router.push(`/agent/transactions/${data.id || "new"}`);
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

  // Transaction type options
  const transactionTypes = [
    "Purchase",
    "Lease",
    "Listing for Sale",
    "Listing for Lease",
    "Other",
  ];

  return (
    <DashboardLayout user={agentUserForHeader}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className=" items-center space-x-4 space-y-5">
          <ReturnTo href="/agent/transactions" label="Back to Transactions" />
          <div>
            <PageTitle
              title="Create New Transaction"
              subtitle="Set up a new real estate transaction"
            />
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
                  {transactionTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange("transactionType", type)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        formData.transactionType === type
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {type}
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
                  disabled={loadingProperties}
                >
                  <option value="">
                    {loadingProperties ? "Loading..." : "Select a property"}
                  </option>
                  {properties &&
                    Array.isArray(properties) &&
                    properties.length > 0 &&
                    properties.map((property) => (
                      <option key={property.id} value={String(property.id)}>
                        {property.address} - $
                        {Number(property.price).toLocaleString()} (
                        {property.size} sqft)
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
                  disabled={loadingClients}
                >
                  <option value="">
                    {loadingClients ? "Loading..." : "No client assigned"}
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} - {client.email}
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
                      {selectedProperty.address}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedProperty.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="ml-1 font-medium">
                        {selectedProperty.size} sqft
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
                        ${Number(selectedProperty.price).toLocaleString()}
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
                      {selectedClient.firstName} {selectedClient.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.email}
                    </p>
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
                    {selectedClient?.firstName} {selectedClient?.lastName}
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
