/**
 * Types for Brokerage entities and related operations
 */

import { ProfessionalType } from "./professionals";

export interface BrokerageMember {
  email: string;
  fullName: string;
}

export interface SupportingProfessionalMember extends BrokerageMember {
  professionalOf: ProfessionalType;
}

export interface Brokerage {
  id: string;
  name: string;
  address?: string;
  county?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  email?: string;
  agents: BrokerageMember[];
  brokers: BrokerageMember[];
  supportingProfessionals: SupportingProfessionalMember[];
  accessCode?: string;
  createdAt: string;
}

export interface CreateBrokeragePayload {
  name: string;
  address: string;
  county: string;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
}

export interface JoinBrokeragePayload {
  accessCode: string;
}
