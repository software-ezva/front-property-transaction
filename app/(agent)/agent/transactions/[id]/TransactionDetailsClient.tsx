"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Edit,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Circle,
  PlayCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

// New data structures for workflow timeline
type ItemStatus = "not_started" | "in_progress" | "completed";

interface Item {
  description: string;
  order: number;
  status: ItemStatus;
  updatedAt: Date;
}

interface Checklist {
  name: string;
  order: number;
  updatedAt: Date;
  items: Item[];
}

// Original mock transaction data with new workflow structure
const mockTransactionData = {
  id: "txn_1706123456789",
  status: "in-progress" as const,
  transactionType: "sale",
  createdAt: "2024-01-15",
  expectedClosingDate: "2024-02-15",
  completedTasks: 8,
  totalTasks: 15,
  notes:
    "Client is very interested and pre-approved for financing. Property inspection scheduled for next week.",
  property: {
    id: "1",
    title: "Modern downtown apartment",
    price: 350000,
    location: "Downtown, New York",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    type: "Apartment",
    image: "/placeholder.svg?height=300&width=400",
  },
  client: {
    id: "1",
    name: "Carlos Rodriguez",
    email: "carlos@email.com",
    phone: "+1 (555) 123-4567",
    budget: { min: 300000, max: 500000 },
  },
  agent: {
    id: "agent-1",
    name: "Ana García",
    email: "ana@propmanager.com",
    phone: "+1 (555) 987-6543",
  },
  commission: 10500,
  // New workflow timeline data
  checklists: [
    {
      name: "Initial Setup & Documentation",
      order: 1,
      updatedAt: new Date("2024-01-20T16:00:00Z"),
      items: [
        {
          description: "Initial client consultation and needs assessment",
          order: 1,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-15T10:30:00Z"),
        },
        {
          description: "Property listing agreement signed",
          order: 2,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-16T14:00:00Z"),
        },
        {
          description: "MLS listing created and published",
          order: 3,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-17T11:00:00Z"),
        },
      ],
    },
    {
      name: "Marketing & Showings",
      order: 2,
      updatedAt: new Date("2024-01-25T12:00:00Z"),
      items: [
        {
          description: "Property photos and virtual tour completed",
          order: 1,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-20T15:00:00Z"),
        },
        {
          description: "Marketing materials created (flyers, brochures)",
          order: 2,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-21T10:00:00Z"),
        },
        {
          description: "Open house events scheduled and conducted",
          order: 3,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-22T16:00:00Z"),
        },
      ],
    },
    {
      name: "Offer & Negotiation",
      order: 3,
      updatedAt: new Date("2024-01-28T10:00:00Z"),
      items: [
        {
          description: "Buyer offer received and reviewed",
          order: 1,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-26T14:00:00Z"),
        },
        {
          description: "Offer terms negotiated with buyer's agent",
          order: 2,
          status: "completed" as ItemStatus,
          updatedAt: new Date("2024-01-27T11:00:00Z"),
        },
        {
          description: "Purchase agreement signed by all parties",
          order: 3,
          status: "in_progress" as ItemStatus,
          updatedAt: new Date("2024-01-28T10:00:00Z"),
        },
      ],
    },
    {
      name: "Due Diligence & Inspections",
      order: 4,
      updatedAt: new Date("2024-01-30T14:30:00Z"),
      items: [
        {
          description: "Home inspection scheduled and completed",
          order: 1,
          status: "in_progress" as ItemStatus,
          updatedAt: new Date("2024-01-29T13:00:00Z"),
        },
        {
          description: "Inspection report reviewed with client",
          order: 2,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-30T09:00:00Z"),
        },
        {
          description: "Appraisal ordered and scheduled",
          order: 3,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-30T14:30:00Z"),
        },
      ],
    },
    {
      name: "Financing & Final Approval",
      order: 5,
      updatedAt: new Date("2024-01-30T14:30:00Z"),
      items: [
        {
          description: "Buyer's mortgage application submitted",
          order: 1,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-29T16:00:00Z"),
        },
        {
          description: "Loan underwriting process",
          order: 2,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-30T14:30:00Z"),
        },
        {
          description: "Final loan approval received",
          order: 3,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-30T14:30:00Z"),
        },
      ],
    },
    {
      name: "Closing Preparation",
      order: 6,
      updatedAt: new Date("2024-01-30T14:30:00Z"),
      items: [
        {
          description: "Final walkthrough scheduled",
          order: 1,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-30T14:30:00Z"),
        },
        {
          description: "Closing documents prepared and reviewed",
          order: 2,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-30T14:30:00Z"),
        },
        {
          description: "Keys and property access prepared",
          order: 3,
          status: "not_started" as ItemStatus,
          updatedAt: new Date("2024-01-30T14:30:00Z"),
        },
      ],
    },
  ],
};

interface TransactionDetailsClientProps {
  transactionId: string;
}

export default function TransactionDetailsClient({
  transactionId,
}: TransactionDetailsClientProps) {
  const { user, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "documents"
  >("overview");
  const [expandedChecklists, setExpandedChecklists] = useState<number[]>([
    1, 2, 3, 4,
  ]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user session found.</div>;
  if (!user.profile) return <div>No agent profile found.</div>;

  // Prepara el usuario para DashboardLayout
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

  // En una app real, aquí harías fetch de los datos usando el transactionId
  const transaction = mockTransactionData;

  const statusVariant = {
    pending: "warning" as const,
    "in-progress": "default" as const,
    completed: "success" as const,
    cancelled: "error" as const,
  };

  const progress = (transaction.completedTasks / transaction.totalTasks) * 100;

  // New workflow timeline functions
  const toggleChecklistExpansion = (checklistOrder: number) => {
    setExpandedChecklists((prev) =>
      prev.includes(checklistOrder)
        ? prev.filter((order) => order !== checklistOrder)
        : [...prev, checklistOrder]
    );
  };

  const getChecklistStatus = (
    checklist: (typeof transaction.checklists)[0]
  ) => {
    const completed = checklist.items.filter(
      (item) => item.status === "completed"
    ).length;
    const inProgress = checklist.items.filter(
      (item) => item.status === "in_progress"
    ).length;
    const total = checklist.items.length;

    if (completed === total) return "completed";
    if (inProgress > 0 || completed > 0) return "in_progress";
    return "not_started";
  };

  const getStatusIcon = (status: ItemStatus | string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case "in_progress":
        return <PlayCircle className="w-5 h-5 text-primary" />;
      case "not_started":
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: ItemStatus | string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "not_started":
      default:
        return <Badge variant="default">Not Started</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <DashboardLayout user={agentUserForHeader}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/agent/transactions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Transactions
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-primary">
                Transaction Details
              </h1>
              <p className="text-muted-foreground font-secondary">
                ID: {transaction.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={statusVariant[transaction.status]}>
              {transaction.status.replace("-", " ").toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              ${transaction.property.price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Property Value</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              ${transaction.commission.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Commission</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <CheckCircle className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {transaction.completedTasks}
            </div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <Calendar className="w-6 h-6 text-tertiary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {transaction.expectedClosingDate
                ? new Date(transaction.expectedClosingDate).toLocaleDateString()
                : "TBD"}
            </div>
            <div className="text-sm text-muted-foreground">
              Expected Closing
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Overall Progress
            </h2>
            <span className="text-sm font-medium">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>
              {transaction.completedTasks} of {transaction.totalTasks} tasks
              completed
            </span>
            <span>
              Started {new Date(transaction.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg border border-border">
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "timeline", label: "Timeline" },
                { id: "documents", label: "Documents" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">
                        Property Details
                      </h3>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {transaction.property.title}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {transaction.property.address}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="ml-1 font-medium">
                            {transaction.property.type}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Area:</span>
                          <span className="ml-1 font-medium">
                            {transaction.property.area}m²
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Bedrooms:
                          </span>
                          <span className="ml-1 font-medium">
                            {transaction.property.bedrooms}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Bathrooms:
                          </span>
                          <span className="ml-1 font-medium">
                            {transaction.property.bathrooms}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="text-xl font-bold text-primary">
                          ${transaction.property.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Info */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="w-5 h-5 text-tertiary" />
                      <h3 className="text-lg font-semibold text-foreground">
                        Transaction Information
                      </h3>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium capitalize">
                          {transaction.transactionType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Expected Closing:
                        </span>
                        <span className="font-medium">
                          {transaction.expectedClosingDate
                            ? new Date(
                                transaction.expectedClosingDate
                              ).toLocaleDateString()
                            : "TBD"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Commission:
                        </span>
                        <span className="font-medium text-accent">
                          ${transaction.commission.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {transaction.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium text-foreground mb-2">
                          Notes
                        </h4>
                        <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                          {transaction.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Details */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-5 h-5 text-secondary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Client Information
                    </h3>
                  </div>
                  {transaction.client ? (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">
                            {transaction.client.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {transaction.client.email}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">
                            {transaction.client.phone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Budget Range:
                          </span>
                          <span className="font-medium">
                            ${transaction.client.budget.min.toLocaleString()} -
                            ${transaction.client.budget.max.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        {transaction.property.price >=
                          transaction.client.budget.min &&
                        transaction.property.price <=
                          transaction.client.budget.max ? (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            ✓ Property within client budget
                          </span>
                        ) : (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                            ⚠ Property outside client budget range
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-3">
                        No client assigned to this transaction
                      </p>
                      <Button variant="outline" size="sm">
                        Assign Client
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Workflow Timeline
                </h3>
                <div className="space-y-6">
                  {transaction.checklists
                    .sort((a, b) => a.order - b.order)
                    .map((checklist, checklistIndex) => {
                      const checklistStatus = getChecklistStatus(checklist);
                      const isExpanded = expandedChecklists.includes(
                        checklist.order
                      );
                      const completedInChecklist = checklist.items.filter(
                        (item) => item.status === "completed"
                      ).length;
                      const checklistProgress = Math.round(
                        (completedInChecklist / checklist.items.length) * 100
                      );

                      return (
                        <div key={checklist.order} className="relative">
                          {/* Vertical line connecting checklists */}
                          {checklistIndex <
                            transaction.checklists.length - 1 && (
                            <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />
                          )}

                          {/* Checklist Header */}
                          <div
                            className="flex items-center space-x-4 cursor-pointer hover:bg-muted/30 rounded-lg p-3 transition-colors"
                            onClick={() =>
                              toggleChecklistExpansion(checklist.order)
                            }
                          >
                            <div className="flex-shrink-0">
                              {getStatusIcon(checklistStatus)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {checklist.name}
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-muted-foreground">
                                    {completedInChecklist}/
                                    {checklist.items.length} tasks
                                  </span>
                                  {getStatusBadge(checklistStatus)}
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>

                              <div className="mt-2">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">
                                    Progress
                                  </span>
                                  <span className="font-medium">
                                    {checklistProgress}%
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      checklistStatus === "completed"
                                        ? "bg-accent"
                                        : checklistStatus === "in_progress"
                                        ? "bg-primary"
                                        : "bg-muted-foreground"
                                    }`}
                                    style={{ width: `${checklistProgress}%` }}
                                  />
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mt-1">
                                Last updated: {formatDate(checklist.updatedAt)}
                              </p>
                            </div>
                          </div>

                          {/* Checklist Items */}
                          {isExpanded && (
                            <div className="ml-10 mt-4 space-y-3">
                              {checklist.items
                                .sort((a, b) => a.order - b.order)
                                .map((item, itemIndex) => (
                                  <div
                                    key={`${checklist.order}-${item.order}`}
                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors"
                                  >
                                    <div className="flex-shrink-0 mt-0.5">
                                      {getStatusIcon(item.status)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <p
                                          className={`text-sm ${
                                            item.status === "completed"
                                              ? "text-foreground line-through"
                                              : item.status === "in_progress"
                                              ? "text-foreground font-medium"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {item.description}
                                        </p>
                                        <div className="flex items-center space-x-2 ml-4">
                                          {getStatusBadge(item.status)}
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2"
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>

                                      <p className="text-xs text-muted-foreground mt-1">
                                        Updated: {formatDate(item.updatedAt)}
                                      </p>

                                      {item.status === "in_progress" && (
                                        <div className="mt-2 flex space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-xs bg-transparent"
                                          >
                                            Mark Complete
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs"
                                          >
                                            Add Note
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Documents
                </h3>
                <p className="text-muted-foreground mb-4">
                  Document management feature coming soon
                </p>
                <Button variant="outline">Upload Document</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
