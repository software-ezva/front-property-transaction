"use client";

import {
  Heart,
  FileText,
  Calendar,
  MessageSquare,
  Search,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import TransactionCard from "@/components/molecules/TransactionCard";
import PropertyCard from "@/components/molecules/PropertyCard";
import Button from "@components/atoms/Button";
import { useUser } from "@auth0/nextjs-auth0";

export default function ClientDashboard() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user session found.</div>;
  if (!user.profile) return <div>No client profile found.</div>;

  // El perfil guardado en la sesión
  const clientProfile = user.profile as {
    esign_name: string;
    esign_initials: string;
    date_of_birth: string;
    preferred_locations?: string[];
    budget_range?: { min: number; max: number };
    profileType?: string;
  };

  // Prepara el usuario para DashboardLayout
  const clientUserForHeader = {
    name: String(user.first_name + " " + user.last_name) || user.name || "",
    profile: clientProfile.profileType?.replace(/_/g, " ") || "client",
    avatar: String(user.picture) || "",
  };

  const clientStats = [
    {
      title: "Saved Properties",
      value: "12",
      icon: Heart,
      change: "+3 this week",
    },
    {
      title: "Active Transactions",
      value: "1",
      icon: FileText,
      change: "In progress",
    },
    {
      title: "Scheduled Viewings",
      value: "2",
      icon: Calendar,
      change: "This week",
    },
    {
      title: "Unread Messages",
      value: "3",
      icon: MessageSquare,
      change: "From agent",
    },
  ];

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
    },
  ];

  const savedProperties = [
    {
      id: "1",
      title: "Cozy downtown loft",
      price: 380000,
      location: "Downtown, New York",
      bedrooms: 1,
      bathrooms: 1,
      area: 65,
      status: "available" as const,
      image: "/placeholder.svg?height=200&width=300",
      type: "Loft",
    },
    {
      id: "2",
      title: "Suburban family home",
      price: 450000,
      location: "Suburbs, New York",
      bedrooms: 3,
      bathrooms: 2,
      area: 140,
      status: "available" as const,
      image: "/placeholder.svg?height=200&width=300",
      type: "House",
    },
  ];

  const upcomingViewings = [
    {
      id: "1",
      property: "Modern downtown apartment",
      date: "2024-01-25",
      time: "2:00 PM",
      agent: "Ana Garcia",
      address: "123 Main St, Downtown",
    },
    {
      id: "2",
      property: "Cozy downtown loft",
      date: "2024-01-27",
      time: "10:00 AM",
      agent: "Ana Garcia",
      address: "456 Oak Ave, Downtown",
    },
  ];

  const agentInfo = {
    name: "Ana Garcia",
    phone: "+1 (555) 123-4567",
    email: "ana@propmanager.com",
    rating: 4.9,
    reviews: 127,
  };

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  const handleContactAgent = () => {
    console.log("Contact agent");
  };

  // Usa clientProfile en vez de mockClientUser.profile
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground font-primary">
          Welcome back, {clientUserForHeader.name}
        </h1>
        <p className="text-muted-foreground font-secondary mt-2">
          Continue your property search and track your progress. You have 2
          viewings scheduled this week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Transaction */}
        <div className="lg:col-span-2 space-y-6">
          {clientTransactions.length > 0 && (
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground font-secondary">
                  Your Active Transaction
                </h2>
              </div>
              <div className="p-6">
                {clientTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    userRole="client"
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Viewings */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground font-secondary">
                  Upcoming Viewings
                </h2>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule More
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {upcomingViewings.map((viewing) => (
                <div
                  key={viewing.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {viewing.property}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {viewing.address}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {viewing.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {viewing.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {viewing.agent}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground font-secondary">
                Your Agent
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-lg">
                    AG
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">
                  {agentInfo.name}
                </h3>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">
                    {agentInfo.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({agentInfo.reviews} reviews)
                  </span>
                </div>
                <div className="space-y-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleContactAgent}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {agentInfo.phone}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleContactAgent}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <Search className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Search Properties
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Find your perfect home
          </p>
          <Button className="w-full">Start Searching</Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <Calendar className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Schedule Viewing
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Book a property visit
          </p>
          <Button variant="secondary" className="w-full">
            Schedule Visit
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <MessageSquare className="w-12 h-12 text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Contact Agent
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Get expert advice
          </p>
          <Button variant="tertiary" className="w-full">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
