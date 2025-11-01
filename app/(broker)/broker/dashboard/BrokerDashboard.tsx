"use client";

import {
  BarChart3,
  Briefcase,
  Users,
  Calendar,
  FileText,
  TrendingUp,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import { useBrokerAuth } from "@/hooks/use-broker-auth";
import Link from "next/link";
import PageTitle from "@/components/molecules/PageTitle";
import UpcomingTasks from "@/components/organisms/UpcomingTasks";

export default function BrokerDashboard() {
  const { brokerUser, brokerProfile } = useBrokerAuth();

  // Si llegamos aquí, ya sabemos que la autenticación fue exitosa gracias al layout
  // brokerUser y brokerProfile no serán null

  if (!brokerUser || !brokerProfile) {
    // Esto no debería pasar si el layout funciona correctamente
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <PageTitle
          title={`Welcome back, ${brokerUser.name}`}
          subtitle="Here's your business overview for today."
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            New Service
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Offer a new professional service
          </p>
          <Button className="w-full">Add Service</Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Create Transaction
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Start a new transaction
          </p>
          <Link href="/broker/transactions/create">
            <Button variant="secondary" className="w-full">
              Add Transaction
            </Button>
          </Link>
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

      {/* Broker Stats Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brokerStats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-accent mr-1" />
                <span className="text-sm text-accent font-medium">
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  vs last month
                </span>
              </div>
            </div>
          ))}
        </div> */}
    </div>
  );
}
