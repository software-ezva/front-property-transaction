/**
 * Types for Broker profile
 */

export interface BrokerProfile {
  esign_name: string;
  esign_initials: string;
  phone_number: string;
  license_number: string;
  mls_number?: string;
  brokerage_id?: string; // Relación con Brokerage (nullable, ManyToOne)
}

export interface CreateBrokerPayload {
  esign_name: string;
  esign_initials: string;
  phone_number: string;
  license_number: string;
  mls_number?: string;
}

export interface BrokerResponse extends BrokerProfile {
  id: string;
  created_at: string;
  updated_at: string;
}
