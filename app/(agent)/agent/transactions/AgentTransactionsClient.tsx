"use client";

import type React from "react";
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import TransactionCard from "@/components/molecules/TransactionCard";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useUser } from "@auth0/nextjs-auth0";
import PageTitle from "@/components/molecules/PageTitle";

export default function AgentTransactionsClient() {
  const { user, isLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newTransaction, setNewTransaction] = useState({
    propertyId: "",
    clientId: "",
    notes: "",
  });

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

  // Prepara el usuario para DashboardLayout
  const agentUserForHeader = {
    name: String(user.first_name + " " + user.last_name) || user.name || "",
    profile: agentProfile.profileType?.replace(/_/g, " ") || "agent",
    avatar: String(user.picture) || "",
  };

  const mockTransactions = [
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
      propertyPrice: 350000,
      commission: 10500,
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
      propertyPrice: 450000,
      commission: 13500,
    },
    {
      id: "3",
      propertyTitle: "Penthouse with terrace",
      clientName: "Juan Martinez",
      agentName: "Ana Garcia",
      status: "completed" as const,
      startDate: "2023-12-01",
      completedTasks: 18,
      totalTasks: 18,
      propertyPrice: 520000,
      commission: 15600,
    },
    {
      id: "4",
      propertyTitle: "Downtown commercial space",
      clientName: "", // Sin cliente asignado
      agentName: "Ana Garcia",
      status: "pending" as const,
      startDate: "2024-01-10",
      completedTasks: 2,
      totalTasks: 20,
      nextDeadline: "2024-01-28",
      propertyPrice: 750000,
      commission: 22500,
    },
  ];

  const mockProperties = [
    { id: "1", title: "Modern downtown apartment", price: 350000 },
    { id: "2", title: "Family house with garden", price: 450000 },
    { id: "3", title: "Luxury penthouse", price: 750000 },
    { id: "4", title: "Cozy studio apartment", price: 280000 },
  ];

  const mockClients = [
    { id: "1", name: "Carlos Rodriguez", email: "carlos@email.com" },
    { id: "2", name: "Maria Lopez", email: "maria@email.com" },
    { id: "3", name: "Juan Martinez", email: "juan@email.com" },
    { id: "4", name: "Sofia Chen", email: "sofia@email.com" },
  ];

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.propertyTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  const transactionStats = [
    {
      title: "Total Transactions",
      value: mockTransactions.length,
      icon: FileText,
      color: "primary",
    },
    {
      title: "In Progress",
      value: mockTransactions.filter((t) => t.status === "in-progress").length,
      icon: Calendar,
      color: "secondary",
    },
    {
      title: "Completed",
      value: mockTransactions.filter((t) => t.status === "completed").length,
      icon: User,
      color: "accent",
    },
    // {
    //   title: "Total Commission",
    //   value: `$${mockTransactions
    //     .reduce((sum, t) => sum + (t.commission || 0), 0)
    //     .toLocaleString()}`,
    //   icon: DollarSign,
    //   color: "tertiary",
    // },
  ];

  return (
    <DashboardLayout user={agentUserForHeader}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <PageTitle
              title="Transactions"
              subtitle="Manage and monitor all your real estate transactions."
            />
          </div>
          <Button
            onClick={() => {
              window.location.href = "/agent/transactions/create";
            }}
            className="sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactionStats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-4 border border-border text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by property or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-card rounded-lg border border-border"
              >
                <TransactionCard
                  transaction={transaction}
                  userRole="agent"
                  onViewDetails={handleViewDetails}
                />

                {/* Additional agent info */}
                <div className="px-4 pb-4 border-t border-border mt-4 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex space-x-4">
                      <span className="text-muted-foreground">
                        Property Value:{" "}
                        <span className="font-medium text-foreground">
                          ${transaction.propertyPrice?.toLocaleString()}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Commission:{" "}
                        <span className="font-medium text-accent">
                          ${transaction.commission?.toLocaleString()}
                        </span>
                      </span>
                    </div>
                    {!transaction.clientName && (
                      <span className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded">
                        No client assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card rounded-lg p-12 border border-border text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No transactions found
              </h3>
              <p className="text-muted-foreground mb-4">
                No transactions match the applied filters.
              </p>
              <Button
                onClick={() => {
                  window.location.href = "/agent/transactions/create";
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Transaction
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
