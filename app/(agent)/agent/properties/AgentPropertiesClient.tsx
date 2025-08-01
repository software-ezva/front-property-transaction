"use client";

import { useState } from "react";
import { Search, Filter, Plus, MapPin, Edit, Trash2, Eye } from "lucide-react";
import PropertyCard from "@/components/molecules/PropertyCard";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useAgentAuth } from "@/hooks/use-agent-auth";
import PageTitle from "@/components/molecules/PageTitle";

export default function AgentPropertiesClient() {
  const { agentUser, agentProfile } = useAgentAuth();

  // Si llegamos aquí, ya sabemos que la autenticación fue exitosa gracias al layout
  if (!agentUser || !agentProfile) {
    return <div>Loading user data...</div>;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const mockProperties = [
    {
      id: "1",
      title: "Modern downtown apartment",
      price: 350000,
      location: "Downtown, New York",
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      status: "available" as const,
      image: "/placeholder.svg?height=200&width=300",
      type: "Apartment",
    },
    {
      id: "2",
      title: "Family house with garden",
      price: 450000,
      location: "Suburbs, Los Angeles",
      bedrooms: 4,
      bathrooms: 3,
      area: 180,
      status: "pending" as const,
      image: "/placeholder.svg?height=200&width=300",
      type: "House",
    },
    {
      id: "3",
      title: "Luxury penthouse",
      price: 750000,
      location: "Manhattan, New York",
      bedrooms: 3,
      bathrooms: 3,
      area: 150,
      status: "sold" as const,
      image: "/placeholder.svg?height=200&width=300",
      type: "Penthouse",
    },
    {
      id: "4",
      title: "Cozy studio apartment",
      price: 280000,
      location: "Brooklyn, New York",
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      status: "available" as const,
      image: "/placeholder.svg?height=200&width=300",
      type: "Studio",
    },
  ];

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;
    const matchesType =
      typeFilter === "all" ||
      property.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  const handleEditProperty = (id: string) => {
    console.log("Edit property:", id);
  };

  const handleDeleteProperty = (id: string) => {
    console.log("Delete property:", id);
  };

  const propertyStats = [
    {
      label: "Total Properties",
      value: mockProperties.length,
      color: "primary",
    },
    {
      label: "Available",
      value: mockProperties.filter((p) => p.status === "available").length,
      color: "accent",
    },
    {
      label: "Pending",
      value: mockProperties.filter((p) => p.status === "pending").length,
      color: "secondary",
    },
    {
      label: "Sold",
      value: mockProperties.filter((p) => p.status === "sold").length,
      color: "tertiary",
    },
  ];

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
        <Button className="sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {propertyStats.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-4 border border-border text-center"
          >
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="penthouse">Penthouse</option>
              <option value="studio">Studio</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-4">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="relative group">
                <PropertyCard
                  property={property}
                  onViewDetails={handleViewDetails}
                />

                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => handleViewDetails(property.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => handleEditProperty(property.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white text-destructive"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No properties found
            </h3>
            <p className="text-muted-foreground mb-4">
              No properties match your current search criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
