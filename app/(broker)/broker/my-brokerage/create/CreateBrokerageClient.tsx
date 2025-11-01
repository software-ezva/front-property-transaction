"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowLeft, Check, Copy } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/molecules/PageTitle";
import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";
import type { CreateBrokeragePayload, Brokerage } from "@/types/brokerage";

export default function CreateBrokerageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBrokerage, setCreatedBrokerage] = useState<Brokerage | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [formData, setFormData] = useState<CreateBrokeragePayload>({
    name: "",
    address: "",
    county: "",
    city: "",
    state: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateBrokeragePayload, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof CreateBrokeragePayload]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateBrokeragePayload, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Brokerage name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.county.trim()) newErrors.county = "County is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^(\+?1)?[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber =
        "Phone number must be a valid US phone number (10 digits, area code cannot start with 0 or 1)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await apiClient.post<Brokerage>(
        ENDPOINTS.internal.BROKERAGE,
        formData
      );

      setCreatedBrokerage(response);
    } catch (error: any) {
      console.error("Error creating brokerage:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (createdBrokerage?.accessCode) {
      navigator.clipboard.writeText(createdBrokerage.accessCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleGoToBrokerage = () => {
    router.push("/broker/my-brokerage");
  };

  // Success state - Show access code
  if (createdBrokerage) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PageTitle
          title="Brokerage Created Successfully!"
          subtitle="Your brokerage has been created. Share the access code with team members."
        />

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 border border-border text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            {createdBrokerage.name}
          </h2>

          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <p>{createdBrokerage.address}</p>
            <p>
              {createdBrokerage.city}, {createdBrokerage.state} -{" "}
              {createdBrokerage.county}
            </p>
            <p>{createdBrokerage.email}</p>
            <p>{createdBrokerage.phoneNumber}</p>
          </div>

          {/* Access Code */}
          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <p className="text-sm text-muted-foreground mb-2">Access Code</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl font-mono font-bold text-primary bg-primary/10 px-6 py-3 rounded-lg">
                {createdBrokerage.accessCode}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Share this code with agents, brokers, and professionals to invite
              them
            </p>
          </div>

          <Button className="w-full" onClick={handleGoToBrokerage}>
            <Building2 className="w-4 h-4 mr-2" />
            Go to My Brokerage
          </Button>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <PageTitle
          title="Create New Brokerage"
          subtitle="Fill in the information below to create your brokerage"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-lg p-6 border border-border space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Brokerage Information
          </h3>

          {/* Brokerage Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Brokerage Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sunshine Realty Group"
              error={errors.name}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., 123 Main Street"
              error={errors.address}
            />
          </div>

          {/* City, State, County */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Miami"
                error={errors.city}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g., FL"
                maxLength={2}
                error={errors.state}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                County <span className="text-red-500">*</span>
              </label>
              <Input
                name="county"
                value={formData.county}
                onChange={handleChange}
                placeholder="e.g., Miami-Dade"
                error={errors.county}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., 5551234567 or +15551234567"
                error={errors.phoneNumber}
              />
              <p className="text-xs text-muted-foreground mt-1">
                US phone number (10 digits, area code cannot start with 0 or 1)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., info@example.com"
                error={errors.email}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4 mr-2" />
                Create Brokerage
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
