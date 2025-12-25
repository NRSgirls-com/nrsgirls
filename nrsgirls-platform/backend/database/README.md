# Database

PostgreSQL 15 database schema for NRSgirls platform.

## Schema Overview

### Core Tables
- **users** - User accounts with role-based access (admin, dj, performer, member, guest)
- **djs** - DJ profiles with genres, equipment, social links, booking info
- **performers** - Performer profiles with privacy settings and consent forms
- **subscriptions** - Stripe subscription tracking

### Lead Management
- **leads** - Lead tracking with scoring, status, UTM tracking, assignment
- **lead_activities** - CRM-style activity log (calls, emails, meetings)
- **lead_scoring_rules** - Configurable scoring rules
- **lead_campaigns** - Nurture campaign definitions
- **lead_campaign_steps** - Campaign automation steps
- **lead_campaign_enrollments** - Lead enrollment tracking

### Discord Integration
- **discord_servers** - Discord guild configurations
- **discord_channels** - Channel monitoring settings
- **discord_members** - Members linked to users/leads with engagement metrics
- **discord_roles** - Role configurations with auto-assign rules
- **discord_message_stats** - Privacy-focused message analytics (no content stored)
- **discord_events** - Event log for analytics and moderation
- **discord_lead_conversions** - Discord-to-lead conversion tracking

### Content & Events
- **mixes** - DJ mix uploads with moderation status
- **plays** - Mix play tracking
- **events** - Platform events (workshops, performances, meetups)
- **event_registrations** - Event attendance tracking
- **notifications** - User notification system
- **audit_logs** - System audit trail

## Migration Files

Located in `./migrations/`:

1. `001_initial_schema.sql` - Core tables (users, djs, performers, subscriptions)
2. `002_lead_management.sql` - Lead management system
3. `003_discord_integration.sql` - Discord server integration

Run migrations in order using:
```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
psql $DATABASE_URL -f migrations/002_lead_management.sql
psql $DATABASE_URL -f migrations/003_discord_integration.sql
```

Or use the full schema:
```bash
psql $DATABASE_URL -f schema.sql
```

## Environment Variables

```bash
DATABASE_URL=postgres://postgres:example@localhost:5432/nrsgirls
```

## Views

- `lead_summary` - Lead overview with activity counts
- `discord_engagement_summary` - Member engagement metrics
- `daily_stats` - Daily platform statistics

## Indexes

All tables include strategic indexes for:
- Primary key lookups
- Foreign key relationships
- Common query patterns (status, date ranges, scores)
- Full-text search on arrays (GIN indexes)

## Data Types

Custom ENUMs:
- `user_role`: admin, dj, performer, member, guest
- `lead_status`: new, contacted, qualified, converted, lost, nurturing
- `lead_source`: website, discord, referral, social_media, event, cold_outreach, partner, other
- `subscription_status`: active, past_due, cancelled, trialing, paused
- `discord_role_type`: admin, moderator, dj, performer, vip, member, guest
- `notification_type`: email, discord, sms, push
- `event_type`: workshop, performance, meetup, livestream, collaboration, competition

## Backup & Restore

Use the platform scripts:
```bash
# Backup
./scripts/backup-db.sh

# Restore
./scripts/restore-db.sh <backup-file.sql.gz>
```
