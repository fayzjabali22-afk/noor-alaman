/**
 * Noor Al-Amani Production Relational Database Schema Specification
 * PostgreSQL / Prisma / Drizzle ORM Compatible Definitions
 * Phase 2 - Production Readiness Upgrade (NATVD v1.0)
 */

export interface PublisherDbSchema {
  id: string; // VARCHAR(64) PRIMARY KEY
  name: string; // VARCHAR(255) NOT NULL
  avatar: string; // TEXT
  location: string; // VARCHAR(100)
  description: string; // TEXT
  category: string; // VARCHAR(50) NOT NULL
  platform: string; // VARCHAR(50) NOT NULL
  external_url: string; // TEXT NOT NULL
  verification_level: 'BASIC' | 'GOLD' | 'PLATINUM'; // VARCHAR(20) DEFAULT 'BASIC'
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED'; // VARCHAR(20) DEFAULT 'PENDING'
  lifecycle_stage: string; // VARCHAR(50) NOT NULL DEFAULT 'ACTIVE_SUPPORT'
  total_visits: number; // INTEGER DEFAULT 0
  last_impression_time: Date; // TIMESTAMP WITH TIME ZONE
  trust_score: number; // INTEGER DEFAULT 80 (0-100)
  data_completeness_score: number; // INTEGER DEFAULT 90 (0-100)
  reports_count: number; // INTEGER DEFAULT 0
  joined_date: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  contact_phone: string; // VARCHAR(50)
  contact_email: string; // VARCHAR(255)
  is_gaza_pilot: boolean; // BOOLEAN DEFAULT TRUE
  created_at: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  updated_at: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
}

export interface PublisherChannelDbSchema {
  id: string; // VARCHAR(64) PRIMARY KEY
  publisher_id: string; // VARCHAR(64) REFERENCES publishers(id)
  platform: string; // VARCHAR(50) NOT NULL
  external_url: string; // TEXT NOT NULL
  subscribers_count: string; // VARCHAR(50)
  is_primary: boolean; // BOOLEAN DEFAULT TRUE
  is_verified: boolean; // BOOLEAN DEFAULT FALSE
  last_checked_at: Date; // TIMESTAMP WITH TIME ZONE
}

export interface VisitEventDbSchema {
  id: string; // VARCHAR(64) PRIMARY KEY
  publisher_id: string; // VARCHAR(64) REFERENCES publishers(id)
  supporter_id_hash: string; // VARCHAR(128)
  platform: string; // VARCHAR(50) NOT NULL
  ip_hash: string; // VARCHAR(128) NOT NULL
  session_token: string; // VARCHAR(128) NOT NULL
  anti_fraud_status: 'VERIFIED' | 'THROTTLED' | 'FLAGGED'; // VARCHAR(20) DEFAULT 'VERIFIED'
  timestamp: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
}

export interface ReportDbSchema {
  id: string; // VARCHAR(64) PRIMARY KEY
  publisher_id: string; // VARCHAR(64) REFERENCES publishers(id)
  reporter_type: 'SUPPORTER' | 'AUDITOR' | 'AUTOMATED'; // VARCHAR(20) NOT NULL
  reason_category: string; // VARCHAR(100) NOT NULL
  evidence_details: string; // TEXT
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'; // VARCHAR(20) DEFAULT 'OPEN'
  resolution_action?: string; // TEXT
  created_at: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
}

export interface AuditLogDbSchema {
  id: string; // VARCHAR(64) PRIMARY KEY
  actor_id: string; // VARCHAR(128) NOT NULL
  role: 'ADMIN' | 'REVIEWER' | 'SYSTEM' | 'AUDITOR'; // VARCHAR(20) NOT NULL
  action_type: string; // VARCHAR(100) NOT NULL
  details: string; // JSONB / TEXT
  timestamp: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
}

export interface FairEngineWeightsDbSchema {
  id: string; // VARCHAR(64) PRIMARY KEY
  visits_weight: number; // INTEGER DEFAULT 35
  verification_weight: number; // INTEGER DEFAULT 20
  trust_score_weight: number; // INTEGER DEFAULT 15
  report_penalty_weight: number; // INTEGER DEFAULT 15
  recency_weight: number; // INTEGER DEFAULT 10
  lifecycle_weight: number; // INTEGER DEFAULT 5
  updated_at: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
}

export interface AiGovernanceLogDbSchema {
  id: string; // VARCHAR(64) PRIMARY KEY
  prompt_hash: string; // VARCHAR(128) NOT NULL
  safety_status: 'PASSED' | 'POLICY_BLOCKED' | 'FLAGGED'; // VARCHAR(20) NOT NULL
  policy_check_details: string; // TEXT
  timestamp: Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
}
