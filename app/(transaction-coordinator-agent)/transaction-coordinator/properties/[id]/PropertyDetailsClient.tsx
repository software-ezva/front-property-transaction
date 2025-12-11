"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Edit, X, FileX } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageTitle from "@/components/molecules/PageTitle";
import ReturnTo from "@/components/molecules/ReturnTo";
import { useProperty } from "@/hooks/use-property";
import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";

interface PropertyDetailsClientProps {
  propertyId: string;
}

export default function PropertyDetailsClient({
  propertyId,
}: PropertyDetailsClientProps) {
  const router = useRouter();
  const { transactionCoordinatorAgentUser } =
    useTransactionCoordinatorAgentAuth();
  const { property, loading, error, updateProperty } = useProperty(propertyId);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    address: "",
    price: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address,
        price: property.price.toString(),
        size: property.size.toString(),
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        description: property.description || "",
      });
    }
  }, [property]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError(null);

    try {
      await updateProperty({
        address: formData.address,
        price: Number(formData.price),
        size: Number(formData.size),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        description: formData.description,
      });
      setIsEditing(false);
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transactionCoordinatorAgentUser || loading) {
    return <LoadingState title="Loading property details..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        icon={FileX}
        actionLabel="Back to Properties"
        onAction={() => router.push("/transaction-coordinator/properties")}
      />
    );
  }

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        description="The property you are looking for does not exist."
        icon={FileX}
        actionLabel="Back to Properties"
        onAction={() => router.push("/transaction-coordinator/properties")}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-x-4">
          <ReturnTo
            href="/transaction-coordinator/properties"
            label="Back to Properties"
          />
          <PageTitle
            title={isEditing ? "Edit Property" : property.address}
            subtitle={
              isEditing ? "Update property details" : "Property Details"
            }
          />
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Property
          </Button>
        )}
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {updateError && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {updateError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
              required
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="250000.00"
                required
                min="0"
                step="0.01"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size (sqft)</Label>
              <Input
                id="size"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                placeholder="1500"
                required
                min="0"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="3"
                required
                min="0"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="2"
                required
                min="0"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Beautiful family home..."
              rows={4}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form to original values
                  if (property) {
                    setFormData({
                      address: property.address,
                      price: property.price.toString(),
                      size: property.size.toString(),
                      bedrooms: property.bedrooms.toString(),
                      bathrooms: property.bathrooms.toString(),
                      description: property.description || "",
                    });
                  }
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
