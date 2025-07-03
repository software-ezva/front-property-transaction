"use client";

import {
  BarChart3,
  Building2,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Plus,
  Calendar,
  Phone,
} from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import TransactionCard from "@/components/molecules/TransactionCard";
import Button from "@/components/atoms/Button";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function AgentDashboard() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user session found.</div>;
  if (!user.profile) return <div>No agent profile found.</div>;

  // El perfil guardado en la sesión
  const agentProfile = user.profile as {
    esignName: string;
    esignInitials: string;
    licenseNumber: string;
    profileType: string;
  };

  // Puedes usar user.name, user.email, etc. según lo que tengas en la sesión
  const agentUser = {
    id: user.sub || user.id || "",
    name: user.first_name + " " + user.last_name || user.name || "Agent",
    email: user.email || "",
    role: agentProfile.profileType || "realestateagent",
    profile: {
      esign_name: agentProfile.esignName,
      esign_initials: agentProfile.esignInitials,
      license_number: agentProfile.licenseNumber,
    },
  };

  const agentUserForHeader = {
    name: String(user.first_name + " " + user.last_name) || "",
    profile: String(agentProfile.profileType.replace(/_/g, " ")) || "",
    avatar: String(user.picture) || "",
  };

  const agentStats = [
    {
      title: "Active Properties",
      value: "24",
      icon: Building2,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Ongoing Transactions",
      value: "8",
      icon: FileText,
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Active Clients",
      value: "156",
      icon: Users,
      change: "+18%",
      changeType: "positive" as const,
    },
    {
      title: "Monthly Revenue",
      value: "$45,200",
      icon: DollarSign,
      change: "+23%",
      changeType: "positive" as const,
    },
  ];

  const agentTransactions = [
    {
      id: "1",
      propertyTitle: "Modern downtown apartment",
      clientName: "Carlos Rodriguez",
      agentName: "Ana Garcia",
      status: "in-progress" as const,
      startDate: "2024-01-15",
      completedTasks: 8,
      totalTasks: 12,
      nextDeadline: "2024-02-01",
    },
    {
      id: "2",
      propertyTitle: "Family house with garden",
      clientName: "Maria Lopez",
      agentName: "Ana Garcia",
      status: "pending" as const,
      startDate: "2024-01-20",
      completedTasks: 3,
      totalTasks: 15,
      nextDeadline: "2024-01-25",
    },
  ];

  const recentClients = [
    {
      id: "1",
      name: "Carlos Rodriguez",
      email: "carlos@email.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      lastContact: "2024-01-20",
    },
    {
      id: "2",
      name: "Maria Lopez",
      email: "maria@email.com",
      phone: "+1 (555) 987-6543",
      status: "prospect",
      lastContact: "2024-01-18",
    },
  ];

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  const handleContactClient = (clientId: string) => {
    console.log("Contact client:", clientId);
  };

  return (
    <DashboardLayout user={agentUserForHeader}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-foreground font-primary">
            Welcome back, {agentUser.name}
          </h1>
          <p className="text-muted-foreground font-secondary mt-2">
            Here's your business overview for today.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">
              License: {agentUser.profile.license_number}
            </span>
            {/* Si tienes más datos, agrégalos aquí */}
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
            <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              New Property
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add a new property
            </p>
            <Button className="w-full">Add Property</Button>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Create Transaction
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add a new transaction
            </p>
            <Link href="/agent/transactions/create">
              <Button variant="secondary" className="w-full">
                Add Transaction
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
            <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              New Client
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Register a new client
            </p>
            <Button variant="tertiary" className="w-full">
              Add Client
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
            <Calendar className="w-12 h-12 text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Schedule Meeting
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Book a client meeting
            </p>
            <Button variant="outline" className="w-full">
              Schedule
            </Button>
          </div>
        </div>

        {/* Agent Stats Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground font-secondary">
                  Recent Transactions
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {agentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  userRole="agent"
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>

          {/* Recent Clients */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground font-secondary">
                  Recent Clients
                </h2>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {client.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {client.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last contact: {client.lastContact}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        client.status === "active"
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {client.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleContactClient(client.id)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
