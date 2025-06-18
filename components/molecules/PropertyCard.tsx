"use client"

import { MapPin, Bed, Bath, Square } from "lucide-react"
import Button from "../atoms/Button"
import Badge from "../atoms/Badge"

interface PropertyCardProps {
  property: {
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
  onViewDetails?: (id: string) => void
}

const PropertyCard = ({ property, onViewDetails }: PropertyCardProps) => {
  const statusVariant = {
    available: "success" as const,
    pending: "warning" as const,
    sold: "error" as const,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={property.image || "/placeholder.svg"} alt={property.title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariant[property.status]}>{property.status}</Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{property.title}</h3>
          <p className="text-sm text-muted-foreground">{property.type}</p>
        </div>

        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area}m²</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xl font-bold text-primary">{formatPrice(property.price)}</div>
          <Button size="sm" variant="outline" onClick={() => onViewDetails?.(property.id)}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
