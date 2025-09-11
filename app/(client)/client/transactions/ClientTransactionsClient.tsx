"use client";

import type React from "react";
import { useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Phone,
  Search,
  TrendingUp,
  AlertCircle,
  Calendar,
  Home,
  Star,
} from "lucide-react";
import TransactionCard from "@/components/molecules/TransactionCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/molecules/PageTitle";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import TransactionProgressMessage from "@/components/molecules/TransactionProgressMessage";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useTransactions } from "@/hooks/use-transactions";
import type { Transaction } from "@/types/transactions";

export default function ClientTransactionsClient() {
  const { clientUser, clientProfile } = useClientAuth();
  const { transactions, loading, error, refetch } = useTransactions();

  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado de transacciones del cliente específico
  const clientTransactions = transactions.filter(
    (transaction: Transaction) =>
      transaction.clientName === clientUser?.name || transaction.transactionId // En una implementación real, filtrarías por clientId
  );

  const filteredTransactions = clientTransactions.filter(
    (transaction: Transaction) =>
      transaction.propertyAddress
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas específicas del cliente
  const stats = {
    total: clientTransactions.length,
    inProgress: clientTransactions.filter((t: Transaction) =>
      [
        "in_preparation",
        "active",
        "under_contract",
        "pending",
        "review",
      ].includes(t.status)
    ).length,
    completed: clientTransactions.filter((t: Transaction) =>
      ["sold_leased", "completed"].includes(t.status)
    ).length,
    upcomingDeadlines: clientTransactions.filter((t: Transaction) => {
      if (!t.nextIncompleteItemDate) return false;
      const deadline = new Date(t.nextIncompleteItemDate);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return deadline <= nextWeek && deadline >= new Date();
    }).length,
  };

  const activeTransaction =
    clientTransactions.find((t: Transaction) =>
      ["preparation", "active", "under_contract", "pending"].includes(t.status)
    ) || null;

  const hasUrgentActions = clientTransactions.some((t: Transaction) => {
    if (!t.nextIncompleteItemDate) return false;
    const deadline = new Date(t.nextIncompleteItemDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return deadline <= tomorrow;
  });

  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    activeTransaction?.transactionId || null
  );

  const handleViewDetails = (transactionId: string) => {
    setSelectedTransaction(transactionId);
  };

  const handleContactAgent = () => {
    // En una implementación real, esto abriría un modal de contacto o navegaría a la página del agente
    console.log("Contact agent");
  };

  const handleViewTransactionDetails = (transactionId: string) => {
    window.location.href = `/client/transactions/${transactionId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header con mensaje motivador */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <PageTitle
          title={`Welcome back, ${clientUser?.name || "Client"}!`}
          subtitle={
            hasUrgentActions
              ? "You have important tasks requiring your attention"
              : transactions.length > 0
              ? "Your real estate journey is progressing beautifully"
              : "Ready to start your real estate journey?"
          }
        />

        {stats.inProgress > 0 && !hasUrgentActions && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800">
                Great progress! You have {stats.inProgress} active transaction
                {stats.inProgress > 1 ? "s" : ""} moving forward.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress-based Messages */}
      {!loading && !error && (
        <div className="space-y-4">
          {/* No transactions at all */}
          {clientTransactions.length === 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🏠 Preparing Your Real Estate Transaction
                </h3>
                <p className="text-blue-700 mb-3">
                  We are working to start your transaction and you will soon be
                  assigned to a specific transaction.
                </p>
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-blue-800 text-sm font-medium">
                    We'll notify you as soon as your transaction is ready. Thank
                    you for your patience!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Completed transactions */}
          {stats.completed > 0 && stats.inProgress === 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  🎉 Transaction Successfully Completed!
                </h3>
                <p className="text-purple-700 mb-3">
                  Thank you for trusting us. Your real estate transaction has
                  been successfully completed.
                </p>
                <div className="bg-purple-100 rounded-lg p-3">
                  <p className="text-purple-800 text-sm font-medium">
                    🏆 We appreciate your trust and hope we have exceeded your
                    expectations. Congratulations on your new property!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Individual transaction progress details */}
          {stats.inProgress > 0 &&
            filteredTransactions.map((transaction: Transaction) => {
              const progressPercentage = Math.round(
                (transaction.completedWorkflowItems /
                  transaction.totalWorkflowItems) *
                  100
              );

              // Low progress (0-30%)
              if (progressPercentage <= 30) {
                return (
                  <div
                    key={`progress-${transaction.transactionId}`}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                          �️ Transaction in Early Stages
                        </h3>
                        <p className="text-yellow-800 mb-2">
                          <strong>{transaction.propertyAddress}</strong> - We're
                          working hard to get everything set up for you.
                        </p>
                        <p className="text-yellow-700 text-sm mb-3">
                          Your transaction is in the initial preparation phase.
                          Our team is handling all the groundwork to ensure a
                          smooth process ahead.
                        </p>
                        <div className="bg-yellow-100 rounded-lg p-3">
                          <p className="text-yellow-800 text-sm font-medium">
                            💡 Please be patient while we complete the initial
                            steps. Great things take time!
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-yellow-600">
                          {progressPercentage}%
                        </div>
                        <div className="text-sm text-yellow-600">Complete</div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Medium progress (31-80%)
              if (progressPercentage <= 80) {
                return (
                  <div
                    key={`progress-${transaction.transactionId}`}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                          🚀 Great Progress on Your Transaction!
                        </h3>
                        <p className="text-blue-800 mb-2">
                          <strong>{transaction.propertyAddress}</strong> - We're
                          making excellent progress together.
                        </p>
                        <p className="text-blue-700 text-sm mb-3">
                          Your transaction is moving along nicely! We've
                          completed {transaction.completedWorkflowItems} out of{" "}
                          {transaction.totalWorkflowItems} steps.
                        </p>
                        <div className="bg-blue-100 rounded-lg p-3">
                          <p className="text-blue-800 text-sm font-medium">
                            🎯 We're continuing to work diligently on your
                            behalf. Stay tuned for more updates!
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {progressPercentage}%
                        </div>
                        <div className="text-sm text-blue-600">Complete</div>
                      </div>
                    </div>
                  </div>
                );
              }

              // High progress (81-99%)
              if (progressPercentage < 100) {
                return (
                  <div
                    key={`progress-${transaction.transactionId}`}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">
                          🏁 Almost There - Final Steps!
                        </h3>
                        <p className="text-green-800 mb-2">
                          <strong>{transaction.propertyAddress}</strong> - We're
                          in the final stretch!
                        </p>
                        <p className="text-green-700 text-sm mb-3">
                          Fantastic progress! Only{" "}
                          {transaction.totalWorkflowItems -
                            transaction.completedWorkflowItems}{" "}
                          step(s) remaining to complete your transaction.
                        </p>
                        <div className="bg-green-100 rounded-lg p-3">
                          <p className="text-green-800 text-sm font-medium">
                            ✨ We're putting the finishing touches on
                            everything. Completion is just around the corner!
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-green-600">
                          {progressPercentage}%
                        </div>
                        <div className="text-sm text-green-600">Complete</div>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}

          {/* Completed transactions celebration */}
          {stats.completed > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    🎉 Congratulations! Transaction
                    {stats.completed > 1 ? "s" : ""} Successfully Completed!
                  </h3>
                  <p className="text-purple-700 mb-2">
                    We're thrilled to announce that {stats.completed} of your
                    transaction{stats.completed > 1 ? "s have" : " has"} been
                    successfully completed!
                  </p>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <p className="text-purple-800 text-sm font-medium">
                      🏆 Thank you for your trust and patience throughout this
                      journey. We hope you're delighted with the outcome!
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.completed}
                  </div>
                  <div className="text-sm text-purple-600">Completed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      {transactions.length > 1 && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <LoadingState
          title="Loading your transactions..."
          description="Please wait while we fetch your real estate journey"
          icon={FileText}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <h3 className="font-semibold text-destructive mb-2">
            Unable to load transactions
          </h3>
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={refetch}>
            Try Again
          </Button>
        </div>
      )}

      {/* Transactions Content */}
      {!loading && !error && (
        <>
          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Your Transactions
                </h2>
                {stats.completed > 0 && (
                  <div className="flex items-center text-sm text-accent">
                    <Star className="w-4 h-4 mr-1" />
                    <span>{stats.completed} completed</span>
                  </div>
                )}
              </div>

              {filteredTransactions.map((transaction: Transaction) => (
                <div
                  key={transaction.transactionId}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <TransactionCard
                    transaction={transaction}
                    userRole="client"
                    onViewDetails={() =>
                      handleViewTransactionDetails(transaction.transactionId)
                    }
                  />

                  {/* Motivational message based on progress */}
                  {transaction.completedWorkflowItems > 0 && (
                    <div className="px-6 pb-4">
                      <div className="bg-accent/10 rounded-lg p-3">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-accent mr-2" />
                          <span className="text-sm text-accent font-medium">
                            {Math.round(
                              (transaction.completedWorkflowItems /
                                transaction.totalWorkflowItems) *
                                100
                            )}
                            % complete - You're making excellent progress! 🎉
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No transactions yet"
              description="You don't have any active transactions at the moment. Contact your agent to get started with your real estate journey."
              icon={Home}
              actionLabel="Contact Agent"
              onAction={handleContactAgent}
            />
          )}
        </>
      )}
    </div>
  );
}
