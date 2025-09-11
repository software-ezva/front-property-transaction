import { Building2, MapPin } from "lucide-react";
import { Transaction } from "@/types/transactions";

interface PropertyDetailsCardProps {
  transaction: Transaction;
}

export default function PropertyDetailsCard({
  transaction,
}: PropertyDetailsCardProps) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Building2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Property Details
        </h3>
      </div>
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <div>
          <h4 className="font-medium text-foreground">Property</h4>
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {transaction.propertyAddress}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <span className="ml-1 font-medium">
              {transaction.transactionType}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Size:</span>
            <span className="ml-1 font-medium">
              {transaction.propertySize
                ? `${transaction.propertySize.toLocaleString()} sqft`
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Bedrooms:</span>
            <span className="ml-1 font-medium">
              {transaction.propertyBedrooms || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Bathrooms:</span>
            <span className="ml-1 font-medium">
              {transaction.propertyBathrooms || "N/A"}
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <div className="text-xl font-bold text-primary">
            $
            {(
              transaction.propertyPrice ||
              transaction.propertyValue ||
              0
            ).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
