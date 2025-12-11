"use client";

import { MapPin, Bed, Bath, Square } from "lucide-react";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";

interface PropertyCardProps {
  property: {
    id: string;
    title?: string;
    address?: string;
    price: number;
    location?: string;
    bedrooms: number;
    bathrooms: number;
    area?: number;
    size?: number;
    status?: "available" | "pending" | "sold";
    image?: string;
    type?: string;
  };
  onViewDetails?: (id: string) => void;
  actions?: React.ReactNode;
}

const PropertyCard = ({
  property,
  onViewDetails,
  actions,
}: PropertyCardProps) => {
  const statusVariant = {
    available: "success" as const,
    pending: "warning" as const,
    sold: "error" as const,
  };

  const displayTitle =
    property.title || property.address || "Untitled Property";
  const displayLocation =
    property.location || property.address || "Unknown Location";
  const displayArea = property.area || property.size || 0;
  const displayImage = property.image || "/placeholder.svg";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="relative group">
        <img
          src={displayImage}
          alt={displayTitle}
          className="w-full h-48 object-cover"
        />
        {property.status && (
          <div className="absolute top-3 right-3">
            <Badge variant={statusVariant[property.status]}>
              {property.status}
            </Badge>
          </div>
        )}
        {actions && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {actions}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {displayTitle}
          </h3>
          <p className="text-sm text-muted-foreground">
            {property.type || "Property"}
          </p>
        </div>

        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{displayLocation}</span>
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
              <span>{displayArea}m²</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xl font-bold text-primary">
            {formatPrice(property.price)}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails?.(property.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
