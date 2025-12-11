"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus, MapPin, Edit, Trash2, Eye } from "lucide-react";
import PropertyCard from "@/components/molecules/PropertyCard";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";
import PageTitle from "@/components/molecules/PageTitle";
import { useProperties } from "@/hooks/use-properties";
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog";
import EmptyState from "@/components/molecules/EmptyState";
import LoadingState from "@/components/molecules/LoadingState";

export default function AgentPropertiesClient() {
  const router = useRouter();
  const {
    transactionCoordinatorAgentUser: agentUser,
    transactionCoordinatorAgentProfile: agentProfile,
  } = useTransactionCoordinatorAgentAuth();

  const { properties, loading, error, deleteProperty } = useProperties();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Si llegamos aquí, ya sabemos que la autenticación fue exitosa gracias al layout
  if (!agentUser || !agentProfile) {
    return <div>Loading user data...</div>;
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.address
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewDetails = (id: string) => {
    router.push(`/transaction-coordinator/properties/${id}`);
  };

  const handleEditProperty = (id: string) => {
    router.push(`/transaction-coordinator/properties/${id}`);
  };

  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      setIsDeleting(true);
      try {
        await deleteProperty(propertyToDelete);
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
      } catch (error) {
        console.error("Failed to delete property:", error);
        alert("Failed to delete property. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const propertyStats = [
    {
      label: "Total Properties",
      value: properties.length,
      color: "primary",
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageTitle
            title="Properties"
            subtitle="Manage your property portfolio and listings"
          />
        </div>
        <Link href="/transaction-coordinator/properties/create">
          <Button className="sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-4">
        {loading ? (
          <LoadingState title="Loading properties..." />
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
                actions={
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(property.id);
                      }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProperty(property.id);
                      }}
                      title="Edit Property"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProperty(property.id);
                      }}
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No properties found"
            description="No properties match your current search criteria."
            actionLabel="Clear Filters"
            onAction={() => setSearchTerm("")}
            icon={MapPin}
          />
        )}
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
