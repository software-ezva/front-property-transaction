"use client";

import { BarChart3, Building2, Users, Calendar } from "lucide-react";
import Button from "@/components/atoms/Button";
import { useTransactionCoordinatorAgentAuth } from "@/hooks/use-transaction-coordinator-agent-auth";
import Link from "next/link";
import PageTitle from "@/components/molecules/PageTitle";
import UpcomingTasks from "@/components/organisms/UpcomingTasks";
import LoadingState from "@/components/molecules/LoadingState";

export default function AgentDashboard() {
  const {
    transactionCoordinatorAgentUser: agentUser,
    transactionCoordinatorAgentProfile: agentProfile,
  } = useTransactionCoordinatorAgentAuth();

  if (!agentUser || !agentProfile) {
    return <LoadingState title="Loading user data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <PageTitle
          title={`Welcome back, ${agentUser.name}`}
          subtitle="Here's your business overview for today."
        />
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">
            License: {agentUser.profile.license_number}
          </span>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            New Property
          </h3>

          <Link href="/transaction-coordinator/properties/create">
            <Button variant="primary" className="w-full">
              Add property
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
          <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Create Transaction
          </h3>

          <Link href="/transaction-coordinator/transactions/create">
            <Button variant="secondary" className="w-full">
              Add transaction
            </Button>
          </Link>
        </div>

        {/* <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
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
        </div> */}
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

      {/* Upcoming Tasks Section */}
      <UpcomingTasks />
    </div>
  );
}
