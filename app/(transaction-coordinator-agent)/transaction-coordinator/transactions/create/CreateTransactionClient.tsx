"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, User, FileText } from "lucide-react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";
import { useTransactions } from "@/hooks/use-transactions";
import PageTitle from "@/components/molecules/PageTitle";
import ReturnTo from "@/components/molecules/ReturnTo";
import { ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/lib/api-internal";
import type { SimpleUserResponseDto } from "@/types/api";
import type {
  WorkflowTemplate,
  TransactionType,
} from "@/types/workflow-templates";

export default function CreateTransactionClient() {
  const { createTransaction } = useTransactions();
  const router = useRouter();

  // State hooks (only one declaration each, in logical order)
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [formData, setFormData] = useState<TransactionFormData>({
    propertyId: "",
    notes: "",
    transactionType: "Purchase",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<
    WorkflowTemplate[]
  >([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // Load templates on mount
  useEffect(() => {
    fetch(ENDPOINTS.internal.TEMPLATES)
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch(() => setTemplates([]));
  }, []);

  // Filter templates by transactionType
  useEffect(() => {
    if (formData.transactionType) {
      setFilteredTemplates(
        templates.filter(
          (tpl) => tpl.transactionType === formData.transactionType
        )
      );
      setSelectedTemplateId(""); // Reset selection when type changes
    } else {
      setFilteredTemplates([]);
      setSelectedTemplateId("");
    }
  }, [formData.transactionType, templates]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await apiClient.get(ENDPOINTS.internal.PROPERTIES);
        setProperties(data);
      } catch (error) {
        // Error is automatically shown as toast
        console.error("Error loading properties:", error);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, []);

  const {
    transactionCoordinatorAgentUser: agentUser,
    transactionCoordinatorAgentProfile: agentProfile,
  } = useTransactionCoordinatorAgentAuth();

  // If we reach here, authentication was successful thanks to the layout
  if (!agentUser || !agentProfile) {
    return <div>Loading user data...</div>;
  }

  interface TransactionFormData {
    propertyId: string;
    notes: string;
    transactionType: string;
  }

  const selectedProperty = properties.find(
    (p) => String(p.id) === formData.propertyId
  );

  const validateForm = (): boolean => {
    if (!formData.propertyId) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        propertyId: formData.propertyId,
        workflowTemplateId: selectedTemplateId,
        additionalNotes: formData.notes || undefined,
      };

      const result = await createTransaction(payload);
      router.push(
        `/transaction-coordinator/transactions/${result.transactionId}`
      );
    } catch (error) {
      // Error is automatically shown as toast
      console.error("Error creating transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof TransactionFormData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="items-center space-x-4 space-y-5">
        <ReturnTo
          href="/transaction-coordinator/transactions"
          label="Back to Transactions"
        />
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

            {/* Template Selection (filtered by type) */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Template <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring border-input"
                required
                disabled={filteredTemplates.length === 0}
              >
                <option value="">
                  {filteredTemplates.length === 0
                    ? "Select a transaction type first"
                    : "Select a template"}
                </option>
                {filteredTemplates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
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
                className="w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring border-input"
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
                      {Number(property.price).toLocaleString()} ({property.size}{" "}
                      sqft)
                    </option>
                  ))}
              </select>
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
              <Link
                href="/transaction-coordinator/transactions"
                className="flex-1"
              >
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
                <span className="font-medium">{agentUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
