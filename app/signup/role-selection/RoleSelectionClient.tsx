"use client";

import type React from "react";
import { useState } from "react";
import {
  Building2,
  User,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  UserCheck,
  BadgeCheck,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/lib/api-internal";
import { ProfessionalType } from "@/types/professionals";
import { cn } from "@/lib/utils";
import LoadingState from "@/components/molecules/LoadingState";

type UserRole =
  | "client"
  | "transaction_coordinator_agent"
  | "real_estate_agent"
  | "broker"
  | "supporting_professional"
  | null;

interface FormData {
  role: UserRole;
  esign_name: string;
  esign_initials: string;
  phone_number: string;
  license_number?: string;
  date_of_birth?: string;
  professional_type?: ProfessionalType;
  mls_number?: string;
}

export default function RoleSelectionClient() {
  const { user, isLoading } = useUser();
  const [step, setStep] = useState<"role" | "details">("role");
  const [formData, setFormData] = useState<FormData>({
    role: null,
    esign_name: "",
    esign_initials: "",
    phone_number: "",
    license_number: "",
    date_of_birth: "",
    professional_type: undefined,
    mls_number: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PHONE_REGEX = /^(\+?1)?[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}$/;

  if (isLoading) {
    return <LoadingState title="Checking authentication..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center mb-4">
            <User className="w-16 h-16 text-muted-foreground bg-muted/30 p-4 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            User not authenticated
          </h2>
          <p className="text-muted-foreground">
            You need to be signed in to select a role and complete your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try again
            </Button>
            <Link href={ENDPOINTS.auth0.LOGIN}>
              <Button>Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
    setStep("details");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.esign_name.trim()) {
      newErrors.esign_name = "E-signature name is required";
    }

    if (!formData.esign_initials.trim()) {
      newErrors.esign_initials = "E-signature initials are required";
    } else if (formData.esign_initials.length > 4) {
      newErrors.esign_initials = "Initials should be 4 characters or less";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!PHONE_REGEX.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number format";
    }

    if (formData.role === "transaction_coordinator_agent") {
      // License number is optional, so no validation here
    }

    if (formData.role === "real_estate_agent") {
      if (!formData.license_number?.trim()) {
        newErrors.license_number = "License number is required";
      }
    }

    if (formData.role === "client") {
      if (!formData.date_of_birth?.trim()) {
        newErrors.date_of_birth = "Date of birth is required";
      } else {
        const birthDate = new Date(formData.date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          newErrors.date_of_birth = "You must be at least 18 years old";
        }
      }
    }

    if (formData.role === "broker") {
      if (!formData.license_number?.trim()) {
        newErrors.license_number = "License number is required";
      }
      // mls_number and brokerage_id are optional
    }

    if (formData.role === "supporting_professional") {
      if (!formData.professional_type) {
        newErrors.professional_type = "Professional type is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    let endpoint = "";
    try {
      if (!user) throw new Error("User not authenticated");

      let payload: Record<string, any> = {};
      if (formData.role === "transaction_coordinator_agent") {
        endpoint = ENDPOINTS.internal.TRANSACTION_COORDINATOR_AGENT_PROFILE;
        payload = {
          esign_name: formData.esign_name,
          esign_initials: formData.esign_initials,
          phone_number: formData.phone_number,
        };
        // Only include license_number if it has a value
        if (formData.license_number && formData.license_number.trim()) {
          payload.license_number = formData.license_number;
        }
      } else if (formData.role === "real_estate_agent") {
        endpoint = ENDPOINTS.internal.REAL_ESTATE_AGENT_PROFILE;
        payload = {
          esign_name: formData.esign_name,
          esign_initials: formData.esign_initials,
          phone_number: formData.phone_number,
          license_number: formData.license_number,
          mls_number: formData.mls_number,
        };
      } else if (formData.role === "client") {
        endpoint = ENDPOINTS.internal.CLIENT_PROFILE;
        payload = {
          esign_name: formData.esign_name,
          esign_initials: formData.esign_initials,
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth,
        };
      } else if (formData.role === "broker") {
        endpoint = ENDPOINTS.internal.BROKER_PROFILE;
        payload = {
          esign_name: formData.esign_name,
          esign_initials: formData.esign_initials,
          phone_number: formData.phone_number,
          license_number: formData.license_number,
          mls_number: formData.mls_number,
        };
      } else if (formData.role === "supporting_professional") {
        endpoint = ENDPOINTS.internal.SUPPORTING_PROFESSIONALS;
        payload = {
          esign_name: formData.esign_name,
          esign_initials: formData.esign_initials,
          phone_number: formData.phone_number,
          professional_of: formData.professional_type,
        };
      } else {
        throw new Error("Invalid role");
      }

      // Always use the internal ApiClientSide route for both roles
      const res = await apiClient.post(endpoint, payload);

      // Redirect to refetch-profile to update session and redirect to dashboard
      // We use window.location.href to ensure a full page reload and proper session update
      window.location.href = "/api/auth/refetch-profile";
    } catch (error) {
      // Error se muestra automáticamente como toast
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handlePhoneChange = (value: string) => {
    // Allow only digits
    const digits = value.replace(/\D/g, "");

    // Limit to 10 digits (since we handle +1 automatically)
    const truncated = digits.slice(0, 10);

    // Construct full number for validation and storage
    const fullNumber = truncated ? `+1${truncated}` : "";

    setFormData({ ...formData, phone_number: fullNumber });

    // Real-time validation
    if (truncated.length === 10) {
      if (PHONE_REGEX.test(fullNumber)) {
        setErrors((prev) => ({ ...prev, phone_number: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Invalid US phone number",
        }));
      }
    } else {
      if (errors.phone_number) {
        setErrors((prev) => ({ ...prev, phone_number: "" }));
      }
    }
  };

  const handleBlur = (field: keyof FormData) => {
    if (field === "phone_number") {
      if (formData.phone_number && !PHONE_REGEX.test(formData.phone_number)) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Invalid phone number format",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-primary font-primary">
              PropManager
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {step === "role" ? "Choose Your Role" : "Complete Your Profile"}
          </h2>
          <p className="text-muted-foreground">
            {step === "role"
              ? "Select your role to get started with the right tools for you"
              : "Provide your information to set up your account"}
          </p>
        </div>

        {step === "role" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() =>
                  handleRoleSelect("transaction_coordinator_agent")
                }
                className="p-6 bg-card border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center text-center h-full"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Transaction Coordinator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Manage and coordinate transactions
                </p>
              </button>

              <button
                onClick={() => handleRoleSelect("real_estate_agent")}
                className="p-6 bg-card border border-border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group flex flex-col items-center text-center h-full"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors mb-4">
                  <BadgeCheck className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Real Estate Agent
                </h3>
                <p className="text-xs text-muted-foreground">
                  Manage listings and clients
                </p>
              </button>

              <button
                onClick={() => handleRoleSelect("client")}
                className="p-6 bg-card border border-border rounded-lg hover:border-secondary hover:bg-secondary/5 transition-all group flex flex-col items-center text-center h-full"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors mb-4">
                  <User className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Client
                </h3>
                <p className="text-xs text-muted-foreground">
                  Browse properties and transactions
                </p>
              </button>

              <button
                onClick={() => handleRoleSelect("broker")}
                className="p-6 bg-card border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all group flex flex-col items-center text-center h-full"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors mb-4">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Broker
                </h3>
                <p className="text-xs text-muted-foreground">
                  Manage brokerage operations
                </p>
              </button>

              <button
                onClick={() => handleRoleSelect("supporting_professional")}
                className="p-6 bg-card border border-border rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group flex flex-col items-center text-center h-full md:col-span-2"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors mb-4">
                  <UserCheck className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Supporting Professional
                </h3>
                <p className="text-xs text-muted-foreground">
                  Provide specialized services
                </p>
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                {formData.role === "transaction_coordinator_agent" ? (
                  <Building2 className="w-5 h-5 text-primary" />
                ) : formData.role === "real_estate_agent" ? (
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                ) : formData.role === "broker" ? (
                  <Briefcase className="w-5 h-5 text-accent" />
                ) : formData.role === "supporting_professional" ? (
                  <UserCheck className="w-5 h-5 text-orange-500" />
                ) : (
                  <User className="w-5 h-5 text-secondary" />
                )}
                <span className="font-medium text-foreground capitalize">
                  {formData.role === "transaction_coordinator_agent"
                    ? "Transaction Coordinator"
                    : formData.role === "real_estate_agent"
                    ? "Real Estate Agent"
                    : formData.role === "broker"
                    ? "Broker"
                    : formData.role === "supporting_professional"
                    ? "Supporting Professional"
                    : "Client"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="E-signature Full Name"
                type="text"
                value={formData.esign_name}
                onChange={(e) =>
                  handleInputChange("esign_name", e.target.value)
                }
                error={errors.esign_name}
                placeholder="Enter your full legal name"
                required
              />

              <Input
                label="E-signature Initials"
                type="text"
                value={formData.esign_initials}
                onChange={(e) =>
                  handleInputChange(
                    "esign_initials",
                    e.target.value.toUpperCase()
                  )
                }
                error={errors.esign_initials}
                placeholder="e.g., JD"
                maxLength={4}
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  Phone Number <span className="text-destructive ml-1">*</span>
                </label>
                <div
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-card text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    errors.phone_number
                      ? "border-destructive focus-within:ring-destructive"
                      : ""
                  )}
                >
                  <div className="flex items-center px-3 border-r border-input bg-muted/50 text-muted-foreground select-none">
                    +1
                  </div>
                  <input
                    className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    type="tel"
                    value={formData.phone_number.replace(/^\+1/, "")}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => handleBlur("phone_number")}
                    placeholder="2125551234"
                    required
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-sm text-destructive">
                    {errors.phone_number}
                  </p>
                )}
              </div>

              {formData.role === "transaction_coordinator_agent" && (
                <Input
                  label="Real Estate License Number"
                  type="text"
                  value={formData.license_number || ""}
                  onChange={(e) =>
                    handleInputChange("license_number", e.target.value)
                  }
                  error={errors.license_number}
                  placeholder="Enter your license number"
                />
              )}

              {formData.role === "client" && (
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={(e) =>
                    handleInputChange("date_of_birth", e.target.value)
                  }
                  error={errors.date_of_birth}
                  required
                />
              )}

              {formData.role === "real_estate_agent" && (
                <>
                  <Input
                    label="Real Estate License Number"
                    type="text"
                    value={formData.license_number || ""}
                    onChange={(e) =>
                      handleInputChange("license_number", e.target.value)
                    }
                    error={errors.license_number}
                    placeholder="Enter your license number"
                    required
                  />
                  <Input
                    label="MLS Number"
                    type="text"
                    value={formData.mls_number || ""}
                    onChange={(e) =>
                      handleInputChange("mls_number", e.target.value)
                    }
                    error={errors.mls_number}
                    placeholder="Enter your MLS number (optional)"
                  />
                </>
              )}

              {formData.role === "broker" && (
                <>
                  <Input
                    label="Real Estate License Number"
                    type="text"
                    value={formData.license_number || ""}
                    onChange={(e) =>
                      handleInputChange("license_number", e.target.value)
                    }
                    error={errors.license_number}
                    placeholder="Enter your license number"
                    required
                  />
                  <Input
                    label="MLS Number"
                    type="text"
                    value={formData.mls_number || ""}
                    onChange={(e) =>
                      handleInputChange("mls_number", e.target.value)
                    }
                    error={errors.mls_number}
                    placeholder="Enter your MLS number (optional)"
                  />
                </>
              )}

              {formData.role === "supporting_professional" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Professional Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.professional_type || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "professional_type",
                        e.target.value as ProfessionalType
                      )
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select your professional type</option>
                    {Object.values(ProfessionalType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.professional_type && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.professional_type}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("role")}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Creating Profile..." : "Create Profile"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
