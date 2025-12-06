-- Migration: 001_initial_schema
-- Description: Initial database schema with core tables
-- Created: 2025-12-06

-- Up Migration
BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'dj', 'performer', 'member', 'guest');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing', 'paused');

-- Users table
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

-- DJs table
CREATE TABLE djs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    bio TEXT,
    genres TEXT[],
    experience_years INTEGER,
    equipment JSONB DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_djs_user_id ON djs(user_id);

-- Performers table
CREATE TABLE performers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_name VARCHAR(100) NOT NULL,
    bio TEXT,
    specialties TEXT[],
    privacy_settings JSONB DEFAULT '{"show_real_name": false, "show_contact": false}',
    contact_preferences JSONB DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_performers_user_id ON performers(user_id);

-- Subscriptions table
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
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_djs_updated_at BEFORE UPDATE ON djs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_performers_updated_at BEFORE UPDATE ON performers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;

-- Down Migration (run to rollback)
-- BEGIN;
-- DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
-- DROP TRIGGER IF EXISTS update_performers_updated_at ON performers;
-- DROP TRIGGER IF EXISTS update_djs_updated_at ON djs;
-- DROP TRIGGER IF EXISTS update_users_updated_at ON users;
-- DROP FUNCTION IF EXISTS update_updated_at();
-- DROP TABLE IF EXISTS subscriptions;
-- DROP TABLE IF EXISTS performers;
-- DROP TABLE IF EXISTS djs;
-- DROP TABLE IF EXISTS users;
-- DROP TYPE IF EXISTS subscription_status;
-- DROP TYPE IF EXISTS user_role;
-- COMMIT;
