-- Migration: 003_discord_integration
-- Description: Discord server integration tables
-- Created: 2025-12-06

-- Up Migration
BEGIN;

-- Discord role type enum
CREATE TYPE discord_role_type AS ENUM ('admin', 'moderator', 'dj', 'performer', 'vip', 'member', 'guest');

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
    channel_type VARCHAR(50),
    parent_id VARCHAR(50),
    position INTEGER,
    topic TEXT,
    is_monitored BOOLEAN DEFAULT FALSE,
    monitor_config JSONB DEFAULT '{}',
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
    auto_assign_conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(server_id, role_id)
);

CREATE INDEX idx_discord_roles_server ON discord_roles(server_id);

-- Discord message stats (for analytics, privacy-focused)
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
    event_type VARCHAR(50) NOT NULL,
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
    conversion_type VARCHAR(50),
    referrer_discord_id VARCHAR(50),
    conversion_channel_id VARCHAR(50),
    conversion_message_id VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discord_lead_conv_member ON discord_lead_conversions(discord_member_id);
CREATE INDEX idx_discord_lead_conv_lead ON discord_lead_conversions(lead_id);

-- Apply update triggers
CREATE TRIGGER update_discord_servers_updated_at BEFORE UPDATE ON discord_servers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_discord_channels_updated_at BEFORE UPDATE ON discord_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_discord_members_updated_at BEFORE UPDATE ON discord_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_discord_roles_updated_at BEFORE UPDATE ON discord_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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

COMMIT;

-- Down Migration
-- BEGIN;
-- DROP VIEW IF EXISTS discord_engagement_summary;
-- DROP TRIGGER IF EXISTS update_discord_roles_updated_at ON discord_roles;
-- DROP TRIGGER IF EXISTS update_discord_members_updated_at ON discord_members;
-- DROP TRIGGER IF EXISTS update_discord_channels_updated_at ON discord_channels;
-- DROP TRIGGER IF EXISTS update_discord_servers_updated_at ON discord_servers;
-- DROP TABLE IF EXISTS discord_lead_conversions;
-- DROP TABLE IF EXISTS discord_events;
-- DROP TABLE IF EXISTS discord_message_stats;
-- DROP TABLE IF EXISTS discord_roles;
-- DROP TABLE IF EXISTS discord_members;
-- DROP TABLE IF EXISTS discord_channels;
-- DROP TABLE IF EXISTS discord_servers;
-- DROP TYPE IF EXISTS discord_role_type;
-- COMMIT;
