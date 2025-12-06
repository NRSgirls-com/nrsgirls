-- Migration: 002_lead_management
-- Description: Lead management system tables
-- Created: 2025-12-06

-- Up Migration
BEGIN;

-- Lead status and source enums
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost', 'nurturing');
CREATE TYPE lead_source AS ENUM ('website', 'discord', 'referral', 'social_media', 'event', 'cold_outreach', 'partner', 'other');

-- Main leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(200),
    job_title VARCHAR(100),

    -- Lead scoring and status
    status lead_status DEFAULT 'new',
    source lead_source DEFAULT 'website',
    score INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=urgent

    -- Tracking
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    referrer_url VARCHAR(500),
    landing_page VARCHAR(500),
    ip_address INET,
    user_agent TEXT,

    -- Assignment
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Conversion tracking
    converted_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    converted_at TIMESTAMP WITH TIME ZONE,

    -- Interest and qualification
    interests TEXT[],
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    notes TEXT,

    -- Metadata
    custom_fields JSONB DEFAULT '{}',
    tags TEXT[],

    -- Discord integration
    discord_id VARCHAR(50),
    discord_username VARCHAR(100),
    discord_joined_via_lead BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    next_followup_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_discord_id ON leads(discord_id);
CREATE INDEX idx_leads_tags ON leads USING GIN(tags);

-- Lead activities/interactions
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(200),
    description TEXT,
    outcome VARCHAR(100),
    duration_minutes INTEGER,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at);

-- Lead scoring rules
CREATE TABLE lead_scoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    condition_type VARCHAR(50) NOT NULL,
    condition_config JSONB NOT NULL,
    points INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lead nurture campaigns
CREATE TABLE lead_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    trigger_conditions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_campaign_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES lead_campaigns(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    delay_hours INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_campaign_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES lead_campaigns(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_step_at TIMESTAMP WITH TIME ZONE,
    next_step_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_campaign_enrollments_lead ON lead_campaign_enrollments(lead_id);
CREATE INDEX idx_campaign_enrollments_status ON lead_campaign_enrollments(status);

-- Apply update trigger to leads
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lead_scoring_rules_updated_at BEFORE UPDATE ON lead_scoring_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lead_campaigns_updated_at BEFORE UPDATE ON lead_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Lead summary view
CREATE VIEW lead_summary AS
SELECT
    l.id,
    l.email,
    l.first_name,
    l.last_name,
    l.status,
    l.source,
    l.score,
    l.priority,
    l.discord_username,
    u.display_name AS assigned_to_name,
    COUNT(DISTINCT la.id) AS activity_count,
    MAX(la.created_at) AS last_activity_at,
    l.created_at,
    l.updated_at
FROM leads l
LEFT JOIN users u ON l.assigned_to = u.id
LEFT JOIN lead_activities la ON l.id = la.lead_id
GROUP BY l.id, u.display_name;

-- Default scoring rules
INSERT INTO lead_scoring_rules (name, description, condition_type, condition_config, points, is_active) VALUES
('Email Provided', 'Lead provided email address', 'field_match', '{"field": "email", "operator": "exists"}', 10, true),
('Phone Provided', 'Lead provided phone number', 'field_match', '{"field": "phone", "operator": "exists"}', 15, true),
('Discord Connected', 'Lead connected Discord account', 'discord_event', '{"event": "discord_connected"}', 20, true),
('Website Referral', 'Lead came from website', 'field_match', '{"field": "source", "operator": "equals", "value": "website"}', 5, true),
('Discord Referral', 'Lead came from Discord', 'field_match', '{"field": "source", "operator": "equals", "value": "discord"}', 25, true);

COMMIT;

-- Down Migration
-- BEGIN;
-- DROP VIEW IF EXISTS lead_summary;
-- DROP TRIGGER IF EXISTS update_lead_campaigns_updated_at ON lead_campaigns;
-- DROP TRIGGER IF EXISTS update_lead_scoring_rules_updated_at ON lead_scoring_rules;
-- DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
-- DROP TABLE IF EXISTS lead_campaign_enrollments;
-- DROP TABLE IF EXISTS lead_campaign_steps;
-- DROP TABLE IF EXISTS lead_campaigns;
-- DROP TABLE IF EXISTS lead_scoring_rules;
-- DROP TABLE IF EXISTS lead_activities;
-- DROP TABLE IF EXISTS leads;
-- DROP TYPE IF EXISTS lead_source;
-- DROP TYPE IF EXISTS lead_status;
-- COMMIT;
