"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, ArrowRight, ArrowLeft } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/lib/api-internal";

type UserRole = "client" | "realestateagent" | null;

interface FormData {
  role: UserRole;
  esign_name: string;
  esign_initials: string;
  phone_number: string;
  license_number?: string;
  date_of_birth?: string;
}

export default function RoleSelectionClient() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [step, setStep] = useState<"role" | "details">("role");
  const [formData, setFormData] = useState<FormData>({
    role: null,
    esign_name: "",
    esign_initials: "",
    phone_number: "",
    license_number: "",
    date_of_birth: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    }

    if (formData.role === "realestateagent") {
      // License number is optional, so no validation here
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
      if (formData.role === "realestateagent") {
        endpoint = ENDPOINTS.internal.AGENT_PROFILE;
        payload = {
          esign_name: formData.esign_name,
          esign_initials: formData.esign_initials,
          phone_number: formData.phone_number,
        };
        // Only include license_number if it has a value
        if (formData.license_number && formData.license_number.trim()) {
          payload.license_number = formData.license_number;
        }
      } else if (formData.role === "client") {
        endpoint = ENDPOINTS.internal.CLIENT_PROFILE;
        payload = {
          esign_name: formData.esign_name,
          esign_initials: formData.esign_initials,
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth,
        };
      } else {
        throw new Error("Invalid role");
      }

      // Always use the internal ApiClientSide route for both roles
      const res = await apiClient.post(endpoint, payload);

      // Redirect to dashboard according to role
      if (formData.role === "realestateagent") {
        router.push("/agent/dashboard");
      } else if (formData.role === "client") {
        router.push("/client/dashboard");
      } else {
        router.push("/");
      }
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

  // El código de depuración ha sido eliminado para simplificar

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect("realestateagent")}
              className="w-full p-6 bg-card border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-foreground">
                    Real Estate Agent
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage properties, clients, and transactions
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("client")}
              className="w-full p-6 bg-card border border-border rounded-lg hover:border-secondary hover:bg-secondary/5 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <User className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-foreground">
                    Client
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse properties and manage your transactions
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
            </button>

            <div className="text-center pt-4">
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
                {formData.role === "realestateagent" ? (
                  <Building2 className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-secondary" />
                )}
                <span className="font-medium text-foreground capitalize">
                  {formData.role === "realestateagent"
                    ? "Real Estate Agent"
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

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                error={errors.phone_number}
                placeholder="Enter phone number (e.g., +15552234567)"
                required
              />

              {formData.role === "realestateagent" && (
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
