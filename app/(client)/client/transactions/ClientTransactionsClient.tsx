"use client"

import { useState } from "react"
import { FileText, CheckCircle, Clock, MessageSquare, Phone } from "lucide-react"
import DashboardLayout from "@/components/templates/DashboardLayout"
import TransactionCard from "@/components/molecules/TransactionCard"
import Button from "@/components/atoms/Button"

const mockClientUser = {
  name: "Carlos Rodriguez",
  role: "client" as const,
}

// Solo las transacciones del cliente actual
const clientTransactions = [
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
    agentPhone: "+1 (555) 123-4567",
    agentEmail: "ana@propmanager.com",
  },
]

const transactionSteps = [
  { id: 1, title: "Initial Consultation", completed: true, date: "2024-01-15" },
  { id: 2, title: "Property Viewing", completed: true, date: "2024-01-16" },
  { id: 3, title: "Offer Submitted", completed: true, date: "2024-01-18" },
  { id: 4, title: "Offer Accepted", completed: true, date: "2024-01-20" },
  { id: 5, title: "Home Inspection", completed: true, date: "2024-01-22" },
  { id: 6, title: "Financing Approval", completed: true, date: "2024-01-25" },
  { id: 7, title: "Appraisal", completed: true, date: "2024-01-28" },
  { id: 8, title: "Final Walkthrough", completed: true, date: "2024-01-30" },
  { id: 9, title: "Title Search", completed: false, inProgress: true, expectedDate: "2024-02-01" },
  { id: 10, title: "Insurance Setup", completed: false, expectedDate: "2024-02-03" },
  { id: 11, title: "Final Documentation", completed: false, expectedDate: "2024-02-05" },
  { id: 12, title: "Closing", completed: false, expectedDate: "2024-02-08" },
]

export default function ClientTransactionsClient() {
  const [selectedTransaction, setSelectedTransaction] = useState(clientTransactions[0]?.id || null)

  const handleViewDetails = (id: string) => {
    setSelectedTransaction(id)
  }

  const handleContactAgent = () => {
    console.log("Contact agent")
  }

  const currentTransaction = clientTransactions.find((t) => t.id === selectedTransaction)

  return (
    <DashboardLayout user={mockClientUser}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-primary">My Transactions</h1>
          <p className="text-muted-foreground font-secondary">Track the progress of your real estate transactions</p>
        </div>

        {clientTransactions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Your Transactions</h2>
              {clientTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`cursor-pointer transition-all ${
                    selectedTransaction === transaction.id ? "ring-2 ring-primary" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedTransaction(transaction.id)}
                >
                  <TransactionCard transaction={transaction} userRole="client" onViewDetails={handleViewDetails} />
                </div>
              ))}
            </div>

            {/* Transaction Details */}
            <div className="lg:col-span-2 space-y-6">
              {currentTransaction && (
                <>
                  {/* Transaction Overview */}
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{currentTransaction.propertyTitle}</h2>
                        <p className="text-muted-foreground">
                          Transaction started on {new Date(currentTransaction.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${currentTransaction.propertyPrice?.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Property Value</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">{currentTransaction.completedTasks}</div>
                        <div className="text-sm text-muted-foreground">Steps Completed</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {currentTransaction.totalTasks - currentTransaction.completedTasks}
                        </div>
                        <div className="text-sm text-muted-foreground">Steps Remaining</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">
                          {Math.round((currentTransaction.completedTasks / currentTransaction.totalTasks) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all"
                          style={{
                            width: `${(currentTransaction.completedTasks / currentTransaction.totalTasks) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {currentTransaction.nextDeadline && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Next milestone: {new Date(currentTransaction.nextDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Agent Contact */}
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Your Agent</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold">AG</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{currentTransaction.agentName}</h4>
                          <p className="text-sm text-muted-foreground">{currentTransaction.agentEmail}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleContactAgent}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleContactAgent}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Steps */}
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Progress</h3>
                    <div className="space-y-4">
                      {transactionSteps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {step.completed ? (
                              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            ) : step.inProgress ? (
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-primary-foreground animate-pulse" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-muted rounded-full border-2 border-border" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`font-medium ${
                                  step.completed
                                    ? "text-foreground"
                                    : step.inProgress
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {step.title}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {step.completed
                                  ? step.date
                                  : step.inProgress
                                    ? "In Progress"
                                    : step.expectedDate
                                      ? `Expected: ${step.expectedDate}`
                                      : ""}
                              </span>
                            </div>
                            {step.inProgress && <p className="text-sm text-primary mt-1">Currently being processed</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Active Transactions</h3>
            <p className="text-muted-foreground mb-4">You don't have any active transactions at the moment.</p>
            <Button onClick={() => (window.location.href = "/client/search")}>Browse Properties</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
