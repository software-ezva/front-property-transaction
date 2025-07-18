"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, Filter, Plus, FileText, Calendar, User } from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import TransactionCard from "@/components/molecules/TransactionCard";
import { TransactionStatus } from "@/types/transactions";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useUser } from "@auth0/nextjs-auth0";
import PageTitle from "@/components/molecules/PageTitle";
import type { Transaction } from "@/types/transactions";
export default function AgentTransactionsClient() {
  const { user, isLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      setError(null);
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data: Transaction[] = await res.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoadingTransactions(false);
      }
    };
    fetchTransactions();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user session found.</div>;
  if (!user.profile) return <div>No agent profile found.</div>;

  const agentProfile = user.profile as {
    esignName: string;
    esignInitials: string;
    licenseNumber: string;
    profileType: string;
  };

  const agentUserForHeader = {
    name: String(user.first_name + " " + user.last_name) || user.name || "",
    profile: agentProfile.profileType?.replace(/_/g, " ") || "agent",
    avatar: String(user.picture) || "",
  };

  // Filtrado
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.propertyAddress
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.clientName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const transactionStats = [
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: FileText,
      color: "primary",
    },
    {
      title: "In Progress",
      value: transactions.filter((t) =>
        [
          "preparation",
          "active",
          "under_contract",
          "pending",
          "review",
        ].includes(t.status)
      ).length,
      icon: Calendar,
      color: "secondary",
    },
    {
      title: "Sold/Leased",
      value: transactions.filter((t) =>
        ["sold", "leased", "completed"].includes(t.status)
      ).length,
      icon: User,
      color: "accent",
    },
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
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All statuses</option>
                <option value={TransactionStatus.IN_PREPARATION}>
                  In Preparation
                </option>
                <option value={TransactionStatus.ACTIVE}>Active</option>
                <option value={TransactionStatus.UNDER_CONTRACT}>
                  Under Contract
                </option>
                <option value={TransactionStatus.SOLD_LEASED}>
                  Sold/Leased
                </option>
                <option value={TransactionStatus.TERMINATED}>Terminated</option>
                <option value={TransactionStatus.WITHDRAWN}>Withdrawn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error/Loading */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-destructive text-center">
            {error}
          </div>
        )}
        {loadingTransactions && (
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading transactions...
            </h3>
          </div>
        )}

        {/* Transactions List */}
        {!loadingTransactions && !error && (
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.transactionId}
                  className="bg-card rounded-lg border border-border"
                >
                  <TransactionCard
                    transaction={transaction}
                    userRole="agent"
                    onViewDetails={() => {
                      window.location.href = `/agent/transactions/${transaction.transactionId}`;
                    }}
                  />
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
        )}
      </div>
    </DashboardLayout>
  );
}
