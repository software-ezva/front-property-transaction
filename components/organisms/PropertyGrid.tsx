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

interface PropertyGridProps {
  properties: Property[]
  onViewDetails?: (id: string) => void
}

const PropertyGrid = ({ properties, onViewDetails }: PropertyGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}

export default PropertyGrid
