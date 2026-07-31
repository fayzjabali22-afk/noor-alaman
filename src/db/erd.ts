/**
 * Entity Relationship Diagram (ERD) Specifications & Relationship Graph
 * Phase 2 - Production Readiness Upgrade (NATVD v1.0)
 */

export const ERD_SPECIFICATION_MARKDOWN = `
# Noor Al-Amani Platform Relational Entity Relationship Diagram (ERD)

\`\`\`mermaid
erDiagram
    PUBLISHERS ||--o{ PUBLISHER_CHANNELS : "owns multiple channels"
    PUBLISHERS ||--o{ VISIT_EVENTS : "receives outbound redirections"
    PUBLISHERS ||--o{ REPORTS : "flagged by supporters/auditors"
    PUBLISHERS ||--o{ DALAL_TRANSITION_SECTOR : "graduates to transition"
    PUBLISHERS ||--o{ RAEDA_SUCCESS_ARCHIVE : "archives success story"
    
    PUBLISHERS {
        string id PK
        string name
        string avatar
        string location
        string category
        string verification_level
        string status
        string lifecycle_stage
        int total_visits
        int trust_score
        int data_completeness_score
        int reports_count
        timestamp last_impression_time
        timestamp joined_date
    }

    PUBLISHER_CHANNELS {
        string id PK
        string publisher_id FK
        string platform
        string external_url
        boolean is_primary
        boolean is_verified
    }

    VISIT_EVENTS {
        string id PK
        string publisher_id FK
        string supporter_id_hash
        string platform
        string ip_hash
        string session_token
        string anti_fraud_status
        timestamp timestamp
    }

    REPORTS {
        string id PK
        string publisher_id FK
        string reporter_type
        string reason_category
        string evidence_details
        string status
        timestamp created_at
    }

    AUDIT_LOGS {
        string id PK
        string actor_id
        string role
        string action_type
        string details
        timestamp timestamp
    }

    FAIR_ENGINE_WEIGHTS {
        string id PK
        int visits_weight
        int verification_weight
        int trust_score_weight
        int report_penalty_weight
        int recency_weight
        int lifecycle_weight
    }
\`\`\`
`;
