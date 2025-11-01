"use client";

import { Mail, Phone, MapPin } from "lucide-react";

interface BrokerageInfoCardProps {
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
}

export function BrokerageInfoCard({
  email,
  phoneNumber,
  address,
  city,
  county,
  state,
}: BrokerageInfoCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Information
      </h2>
      <div className="space-y-3">
        {(address || city || county || state) && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Address
            </p>
            <div className="flex items-start gap-2 text-base text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                {address && <p>{address}</p>}
                {(city || county || state) && (
                  <p>
                    {city}
                    {county && `, ${county}`}
                    {state && `, ${state}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Email
          </p>
          <div className="flex items-center gap-2 text-base text-foreground">
            <Mail className="w-4 h-4 text-muted-foreground" />
            {email || "Not provided"}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Phone Number
          </p>
          <div className="flex items-center gap-2 text-base text-foreground">
            <Phone className="w-4 h-4 text-muted-foreground" />
            {phoneNumber || "Not provided"}
          </div>
        </div>
      </div>
    </div>
  );
}
