"use client";

import { BarChart3, LogIn, Users, Calendar } from "lucide-react";
import Button from "@/components/atoms/Button";
import { useSupportingProfessionalAuth } from "@/hooks/use-supporting-professional-auth";
import Link from "next/link";
import PageTitle from "@/components/molecules/PageTitle";

export default function SupportingProfessionalDashboard() {
  const { supportingProfessionalUser, supportingProfessionalProfile } =
    useSupportingProfessionalAuth();

  // Si llegamos aquí, ya sabemos que la autenticación fue exitosa gracias al layout
  // supportingProfessionalUser y supportingProfessionalProfile no serán null

  if (!supportingProfessionalUser || !supportingProfessionalProfile) {
    // Esto no debería pasar si el layout funciona correctamente
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <PageTitle
          title={`Welcome back, ${supportingProfessionalUser.name}`}
          subtitle="Here's your business overview for today."
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          href="/supporting-professional/brokerages"
          className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow"
        >
          <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Join Brokerage
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Join a brokerage using an access code
          </p>
          <Button className="w-full">View Brokerages</Button>
        </Link>

        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Create Transaction
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Start a new transaction
          </p>
          <Button variant="secondary" className="w-full">
            Add Transaction
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Manage Clients
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            View and manage your clients
          </p>
          <Button variant="tertiary" className="w-full">
            View Clients
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <Calendar className="w-12 h-12 text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Schedule Appointment
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Book a client appointment
          </p>
          <Button variant="outline" className="w-full">
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}
