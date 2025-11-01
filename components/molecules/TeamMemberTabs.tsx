"use client";

import { Briefcase, UserCheck, Wrench } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberCard } from "./MemberCard";
import { BrokerageMember, SupportingProfessionalMember } from "@/types/brokerage";
import { ProfessionalType } from "@/types/professionals";

interface TeamMemberTabsProps {
  brokers?: BrokerageMember[];
  agents?: BrokerageMember[];
  supportingProfessionals?: SupportingProfessionalMember[];
}

export function TeamMemberTabs({
  brokers,
  agents,
  supportingProfessionals,
}: TeamMemberTabsProps) {
  return (
    <Tabs defaultValue="brokers" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="brokers">
          Brokers ({brokers?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="agents">
          Agents ({agents?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="professionals">
          Professionals ({supportingProfessionals?.length || 0})
        </TabsTrigger>
      </TabsList>

      {/* Brokers Tab */}
      <TabsContent value="brokers">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {brokers && brokers.length > 0 ? (
            brokers.map((broker) => (
              <MemberCard
                key={broker.email}
                fullName={broker.fullName}
                email={broker.email}
                icon={Briefcase}
                iconColor="text-primary"
                iconBgColor="bg-primary/20"
              />
            ))
          ) : (
            <div className="col-span-full bg-card rounded-lg p-12 border border-border text-center">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Brokers Yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Invite brokers to join your brokerage using the access code
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Agents Tab */}
      <TabsContent value="agents">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents && agents.length > 0 ? (
            agents.map((agent) => (
              <MemberCard
                key={agent.email}
                fullName={agent.fullName}
                email={agent.email}
                icon={UserCheck}
                iconColor="text-secondary"
                iconBgColor="bg-secondary/20"
              />
            ))
          ) : (
            <div className="col-span-full bg-card rounded-lg p-12 border border-border text-center">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Agents Yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Invite agents to join your brokerage using the access code
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Supporting Professionals Tab */}
      <TabsContent value="professionals">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.values(ProfessionalType).map((professionalType) => {
            const professional = supportingProfessionals?.find(
              (p) => p.professionalOf === professionalType
            );

            return (
              <MemberCard
                key={professionalType}
                fullName={professional?.fullName}
                email={professional?.email}
                badge={professionalType}
                icon={Wrench}
                iconColor="text-tertiary"
                iconBgColor="bg-tertiary/20"
                isEmpty={!professional}
              />
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
