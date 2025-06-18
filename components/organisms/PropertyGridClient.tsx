"use client"

import PropertyCard from "../molecules/PropertyCard"

interface Property {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  status: "available" | "pending" | "sold"
  image: string
  type: string
}

interface PropertyGridClientProps {
  properties: Property[]
}

const PropertyGridClient = ({ properties }: PropertyGridClientProps) => {
  const handleViewDetails = (id: string) => {
    console.log("View details:", id)
    // In a real app, you would navigate to the property details page
    // router.push(`/properties/${id}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} onViewDetails={handleViewDetails} />
      ))}
    </div>
  )
}

export default PropertyGridClient
