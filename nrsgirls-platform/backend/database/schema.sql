-- NRSgirls Platform Database Schema
-- PostgreSQL 15 compatible
-- Lead Management + Discord Server Integration

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('admin', 'dj', 'performer', 'member', 'guest');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost', 'nurturing');
CREATE TYPE lead_source AS ENUM ('website', 'discord', 'referral', 'social_media', 'event', 'cold_outreach', 'partner', 'other');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing', 'paused');
CREATE TYPE discord_role_type AS ENUM ('admin', 'moderator', 'dj', 'performer', 'vip', 'member', 'guest');
CREATE TYPE notification_type AS ENUM ('email', 'discord', 'sms', 'push');
CREATE TYPE event_type AS ENUM ('workshop', 'performance', 'meetup', 'livestream', 'collaboration', 'competition');

-- ============================================
-- CORE USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    hashed_password VARCHAR(255),
    role user_role DEFAULT 'member',
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',
    locale VARCHAR(10) DEFAULT 'en-US',
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- DJS TABLE
-- ============================================
CREATE TABLE djs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    bio TEXT,
    genres TEXT[],
    experience_years INTEGER,
    equipment JSONB DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    booking_rate DECIMAL(10, 2),
    availability_schedule JSONB DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    portfolio_url VARCHAR(500),
    rights_clearance_status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_djs_user_id ON djs(user_id);
CREATE INDEX idx_djs_genres ON djs USING GIN(genres);
CREATE INDEX idx_djs_verified ON djs(verified);

-- ============================================
-- PERFORMERS TABLE
-- ============================================
CREATE TABLE performers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_name VARCHAR(100) NOT NULL,
    bio TEXT,
    specialties TEXT[],
    privacy_settings JSONB DEFAULT '{"show_real_name": false, "show_contact": false}',
    contact_preferences JSONB DEFAULT '{}',
    portfolio_links JSONB DEFAULT '{}',
    rates JSONB DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    consent_forms JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_performers_user_id ON performers(user_id);
CREATE INDEX idx_performers_verified ON performers(verified);

-- ============================================
-- LEAD MANAGEMENT TABLES
-- ============================================

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
    activity_type VARCHAR(50) NOT NULL, -- 'email_sent', 'call', 'meeting', 'note', 'status_change', 'discord_message'
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
    condition_type VARCHAR(50) NOT NULL, -- 'field_match', 'activity', 'behavior', 'discord_event'
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
    step_type VARCHAR(50) NOT NULL, -- 'email', 'wait', 'condition', 'discord_dm', 'notification'
    config JSONB NOT NULL,
    delay_hours INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_campaign_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES lead_campaigns(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused', 'exited'
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_step_at TIMESTAMP WITH TIME ZONE,
    next_step_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_campaign_enrollments_lead ON lead_campaign_enrollments(lead_id);
CREATE INDEX idx_campaign_enrollments_status ON lead_campaign_enrollments(status);

-- ============================================
-- DISCORD SERVER INTEGRATION TABLES
-- ============================================

-- Discord servers/guilds
CREATE TABLE discord_servers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id VARCHAR(50) UNIQUE NOT NULL,
    guild_name VARCHAR(200) NOT NULL,
    owner_id VARCHAR(50),
    icon_url VARCHAR(500),
    member_count INTEGER DEFAULT 0,
    bot_joined_at TIMESTAMP WITH TIME ZONE,
    bot_permissions BIGINT,
    welcome_channel_id VARCHAR(50),
    log_channel_id VARCHAR(50),
    announcement_channel_id VARCHAR(50),
    settings JSONB DEFAULT '{}',
    features TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discord_servers_guild_id ON discord_servers(guild_id);

-- Discord server channels
CREATE TABLE discord_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID REFERENCES discord_servers(id) ON DELETE CASCADE,
    channel_id VARCHAR(50) UNIQUE NOT NULL,
    channel_name VARCHAR(200) NOT NULL,
    channel_type VARCHAR(50), -- 'text', 'voice', 'category', 'announcement', 'forum', 'stage'
    parent_id VARCHAR(50),
    position INTEGER,
    topic TEXT,
    is_monitored BOOLEAN DEFAULT FALSE,
    monitor_config JSONB DEFAULT '{}', -- what to track: messages, joins, reactions, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discord_channels_server ON discord_channels(server_id);
CREATE INDEX idx_discord_channels_channel_id ON discord_channels(channel_id);

-- Discord members linked to users/leads
CREATE TABLE discord_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID REFERENCES discord_servers(id) ON DELETE CASCADE,
    discord_user_id VARCHAR(50) NOT NULL,
    discord_username VARCHAR(100),
    discord_discriminator VARCHAR(10),
    discord_avatar_url VARCHAR(500),
    display_name VARCHAR(100),

    -- Link to internal user or lead
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

    -- Discord role info
    role_ids TEXT[],
    primary_role discord_role_type DEFAULT 'member',

    -- Engagement metrics
    message_count INTEGER DEFAULT 0,
    reaction_count INTEGER DEFAULT 0,
    voice_minutes INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,
    last_voice_at TIMESTAMP WITH TIME ZONE,

    -- Status
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_bot BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,

    -- Moderation
    warning_count INTEGER DEFAULT 0,
    timeout_count INTEGER DEFAULT 0,
    ban_count INTEGER DEFAULT 0,

    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(server_id, discord_user_id)
);

CREATE INDEX idx_discord_members_server ON discord_members(server_id);
CREATE INDEX idx_discord_members_user ON discord_members(discord_user_id);
CREATE INDEX idx_discord_members_linked_user ON discord_members(user_id);
CREATE INDEX idx_discord_members_linked_lead ON discord_members(lead_id);

-- Discord roles configuration
CREATE TABLE discord_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID REFERENCES discord_servers(id) ON DELETE CASCADE,
    role_id VARCHAR(50) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    color INTEGER,
    position INTEGER,
    permissions BIGINT,
    is_mentionable BOOLEAN DEFAULT FALSE,
    is_hoisted BOOLEAN DEFAULT FALSE,
    role_type discord_role_type,
    auto_assign_conditions JSONB DEFAULT '{}', -- conditions for auto-assignment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(server_id, role_id)
);

CREATE INDEX idx_discord_roles_server ON discord_roles(server_id);

-- Discord message logs (for analytics, not storing content for privacy)
CREATE TABLE discord_message_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID REFERENCES discord_servers(id) ON DELETE CASCADE,
    channel_id VARCHAR(50),
    member_id UUID REFERENCES discord_members(id) ON DELETE SET NULL,
    message_date DATE NOT NULL,
    message_count INTEGER DEFAULT 0,
    word_count INTEGER DEFAULT 0,
    attachment_count INTEGER DEFAULT 0,
    reaction_received_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    mention_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(server_id, channel_id, member_id, message_date)
);

CREATE INDEX idx_discord_message_stats_date ON discord_message_stats(message_date);
CREATE INDEX idx_discord_message_stats_member ON discord_message_stats(member_id);

-- Discord events log
CREATE TABLE discord_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID REFERENCES discord_servers(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'member_join', 'member_leave', 'role_change', 'ban', 'message_delete', etc.
    discord_user_id VARCHAR(50),
    member_id UUID REFERENCES discord_members(id) ON DELETE SET NULL,
    channel_id VARCHAR(50),
    target_user_id VARCHAR(50),
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discord_events_server ON discord_events(server_id);
CREATE INDEX idx_discord_events_type ON discord_events(event_type);
CREATE INDEX idx_discord_events_created ON discord_events(created_at);
CREATE INDEX idx_discord_events_user ON discord_events(discord_user_id);

-- Discord-to-Lead conversion tracking
CREATE TABLE discord_lead_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discord_member_id UUID REFERENCES discord_members(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    conversion_type VARCHAR(50), -- 'form_submission', 'dm_inquiry', 'event_signup', 'referral'
    referrer_discord_id VARCHAR(50),
    conversion_channel_id VARCHAR(50),
    conversion_message_id VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discord_lead_conv_member ON discord_lead_conversions(discord_member_id);
CREATE INDEX idx_discord_lead_conv_lead ON discord_lead_conversions(lead_id);

-- ============================================
-- SUBSCRIPTIONS TABLE (Stripe Integration)
-- ============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100) UNIQUE,
    stripe_price_id VARCHAR(100),
    plan_name VARCHAR(100),
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- MIXES AND CONTENT TABLES
-- ============================================
CREATE TABLE mixes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dj_id UUID REFERENCES djs(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_seconds INTEGER,
    file_path VARCHAR(500),
    file_size_bytes BIGINT,
    format VARCHAR(20),
    bitrate INTEGER,
    waveform_data JSONB,
    cover_art_url VARCHAR(500),
    genres TEXT[],
    bpm INTEGER,
    key VARCHAR(10),
    rights_metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    moderation_status VARCHAR(50) DEFAULT 'pending',
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderated_by UUID REFERENCES users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mixes_dj ON mixes(dj_id);
CREATE INDEX idx_mixes_published ON mixes(published_at);
CREATE INDEX idx_mixes_genres ON mixes USING GIN(genres);

-- Mix plays tracking
CREATE TABLE plays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mix_id UUID REFERENCES mixes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_listened INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    source VARCHAR(50), -- 'web', 'discord', 'embed', 'api'
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500)
);

CREATE INDEX idx_plays_mix ON plays(mix_id);
CREATE INDEX idx_plays_user ON plays(user_id);
CREATE INDEX idx_plays_played_at ON plays(played_at);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type event_type DEFAULT 'meetup',
    host_user_id UUID REFERENCES users(id),

    -- Timing
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',

    -- Location (physical or virtual)
    is_virtual BOOLEAN DEFAULT TRUE,
    location_name VARCHAR(200),
    location_address TEXT,
    virtual_link VARCHAR(500),
    discord_channel_id VARCHAR(50),
    discord_event_id VARCHAR(50),

    -- Capacity and registration
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMP WITH TIME ZONE,

    -- Content
    cover_image_url VARCHAR(500),
    tags TEXT[],

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'cancelled', 'completed'
    published_at TIMESTAMP WITH TIME ZONE,

    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_host ON events(host_user_id);
CREATE INDEX idx_events_start ON events(start_time);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);

-- Event registrations
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    discord_member_id UUID REFERENCES discord_members(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'waitlisted', 'cancelled', 'attended', 'no_show'
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attended_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX idx_event_reg_user ON event_registrations(user_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type,
    title VARCHAR(200),
    message TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_djs_updated_at BEFORE UPDATE ON djs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_performers_updated_at BEFORE UPDATE ON performers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lead_scoring_rules_updated_at BEFORE UPDATE ON lead_scoring_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lead_campaigns_updated_at BEFORE UPDATE ON lead_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_discord_servers_updated_at BEFORE UPDATE ON discord_servers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_discord_channels_updated_at BEFORE UPDATE ON discord_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_discord_members_updated_at BEFORE UPDATE ON discord_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_discord_roles_updated_at BEFORE UPDATE ON discord_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_mixes_updated_at BEFORE UPDATE ON mixes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Lead score update function
CREATE OR REPLACE FUNCTION update_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    total_score INTEGER := 0;
    rule RECORD;
BEGIN
    FOR rule IN SELECT * FROM lead_scoring_rules WHERE is_active = TRUE
    LOOP
        -- Simple scoring based on field presence/values
        CASE rule.condition_type
            WHEN 'field_match' THEN
                IF NEW.email IS NOT NULL AND rule.condition_config->>'field' = 'email' THEN
                    total_score := total_score + rule.points;
                END IF;
            WHEN 'activity' THEN
                -- Activity-based scoring handled separately
                NULL;
            WHEN 'discord_event' THEN
                IF NEW.discord_id IS NOT NULL THEN
                    total_score := total_score + rule.points;
                END IF;
            ELSE
                NULL;
        END CASE;
    END LOOP;

    NEW.score := GREATEST(NEW.score, total_score);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_score_trigger BEFORE INSERT OR UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_lead_score();

-- ============================================
-- VIEWS
-- ============================================

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

-- Discord engagement view
CREATE VIEW discord_engagement_summary AS
SELECT
    dm.id,
    dm.discord_username,
    dm.display_name,
    ds.guild_name AS server_name,
    dm.message_count,
    dm.reaction_count,
    dm.voice_minutes,
    dm.last_message_at,
    dm.joined_at,
    dm.is_active,
    u.email AS linked_user_email,
    l.email AS linked_lead_email,
    l.status AS lead_status
FROM discord_members dm
JOIN discord_servers ds ON dm.server_id = ds.id
LEFT JOIN users u ON dm.user_id = u.id
LEFT JOIN leads l ON dm.lead_id = l.id;

-- Daily stats view
CREATE VIEW daily_stats AS
SELECT
    DATE(created_at) AS date,
    'leads' AS metric_type,
    COUNT(*) AS count
FROM leads
GROUP BY DATE(created_at)
UNION ALL
SELECT
    DATE(created_at) AS date,
    'users' AS metric_type,
    COUNT(*) AS count
FROM users
GROUP BY DATE(created_at)
UNION ALL
SELECT
    DATE(joined_at) AS date,
    'discord_joins' AS metric_type,
    COUNT(*) AS count
FROM discord_members
WHERE joined_at IS NOT NULL
GROUP BY DATE(joined_at);

-- ============================================
-- INITIAL SEED DATA
-- ============================================

-- Default lead scoring rules
INSERT INTO lead_scoring_rules (name, description, condition_type, condition_config, points, is_active) VALUES
('Email Provided', 'Lead provided email address', 'field_match', '{"field": "email", "operator": "exists"}', 10, true),
('Phone Provided', 'Lead provided phone number', 'field_match', '{"field": "phone", "operator": "exists"}', 15, true),
('Discord Connected', 'Lead connected Discord account', 'discord_event', '{"event": "discord_connected"}', 20, true),
('Website Referral', 'Lead came from website', 'field_match', '{"field": "source", "operator": "equals", "value": "website"}', 5, true),
('Discord Referral', 'Lead came from Discord', 'field_match', '{"field": "source", "operator": "equals", "value": "discord"}', 25, true),
('High Engagement', 'Lead shows high engagement', 'activity', '{"min_activities": 5}', 30, true);

COMMENT ON TABLE leads IS 'Main lead management table for tracking potential customers and community members';
COMMENT ON TABLE discord_servers IS 'Discord server/guild configurations and settings';
COMMENT ON TABLE discord_members IS 'Discord server members linked to users and leads';
COMMENT ON TABLE discord_events IS 'Discord event log for analytics and moderation';
COMMENT ON TABLE lead_activities IS 'CRM-style activity tracking for leads';
