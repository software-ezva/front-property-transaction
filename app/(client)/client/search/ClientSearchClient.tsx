"use client"

import { useState } from "react"
import { Search, Filter, Heart, MapPin } from "lucide-react"
import DashboardLayout from "@/components/templates/DashboardLayout"
import PropertyCard from "@/components/molecules/PropertyCard"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { useProperties } from "@/hooks/use-properties"


const mockClientUser = {
  id: "client-1",
  name: "Carlos Rodriguez",
  email: "carlos@email.com",
  role: "client" as const,
}

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
    status: "available" as const,
    image: "/placeholder.svg?height=200&width=300",
    type: "House",
  },
  {
    id: "3",
    title: "Cozy downtown loft",
    price: 380000,
    location: "Downtown, New York",
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    status: "available" as const,
    image: "/placeholder.svg?height=200&width=300",
    type: "Loft",
  },
  {
    id: "4",
    title: "Suburban family home",
    price: 520000,
    location: "Suburbs, New York",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    status: "available" as const,
    image: "/placeholder.svg?height=200&width=300",
    type: "House",
  },
  {
    id: "5",
    title: "Luxury penthouse",
    price: 750000,
    location: "Manhattan, New York",
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
    status: "available" as const,
    image: "/placeholder.svg?height=200&width=300",
    type: "Penthouse",
  },
]

interface SearchFilters {
  location: string
  minPrice: string
  maxPrice: string
  bedrooms: string
  bathrooms: string
  propertyType: string
}

export default function ClientSearchClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [savedProperties, setSavedProperties] = useState<string[]>(["1", "3"]) // Mock saved properties
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
  })

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      !filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())

    const matchesMinPrice = !filters.minPrice || property.price >= Number.parseInt(filters.minPrice)
    const matchesMaxPrice = !filters.maxPrice || property.price <= Number.parseInt(filters.maxPrice)
    const matchesBedrooms = !filters.bedrooms || property.bedrooms >= Number.parseInt(filters.bedrooms)
    const matchesBathrooms = !filters.bathrooms || property.bathrooms >= Number.parseInt(filters.bathrooms)
    const matchesType = !filters.propertyType || property.type.toLowerCase() === filters.propertyType.toLowerCase()

    return (
      matchesSearch &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesType
    )
  })

  const handleViewDetails = (id: string) => {
    console.log("View details:", id)
  }

  const handleToggleSave = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
    )
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      propertyType: "",
    })
    setSearchTerm("")
  }

  return (
    <DashboardLayout user={mockClientUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-primary">Search Properties</h1>
            <p className="text-muted-foreground font-secondary">
              Find your perfect home from {mockProperties.length} available properties
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{savedProperties.length} saved</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by title, location, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary/10" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Location"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Min Price"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  />
                  <Input
                    label="Max Price"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Bathrooms</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="loft">Loft</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{filteredProperties.length} properties found</p>
          <select className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Sort by: Price (Low to High)</option>
            <option>Sort by: Price (High to Low)</option>
            <option>Sort by: Newest</option>
            <option>Sort by: Bedrooms</option>
          </select>
        </div>

        {/* Properties Grid */}
        <div className="space-y-4">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} onViewDetails={handleViewDetails} />

                  {/* Save button overlay */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      savedProperties.includes(property.id)
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-white/90 hover:bg-white"
                    }`}
                    onClick={() => handleToggleSave(property.id)}
                  >
                    <Heart className={`w-4 h-4 ${savedProperties.includes(property.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-12 border border-border text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters.</p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
