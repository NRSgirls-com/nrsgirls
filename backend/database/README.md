# Database - NRSgirls Backend

## Overview
Database schema and management for the NRSgirls platform, supporting user management, content storage, streaming sessions, and financial transactions.

## Database Architecture

### Primary Database: PostgreSQL
- User accounts and authentication
- Profile data (DJs and Performers)
- Streaming sessions
- Financial transactions
- Relationships and follows

### Secondary Database: MongoDB
- Media metadata and tags
- Chat messages
- Activity logs
- Analytics data

### Cache Layer: Redis
- Session storage
- Real-time viewer counts
- Rate limiting data
- Temporary tokens

## PostgreSQL Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('dj', 'performer', 'viewer', 'admin')),
    verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    deleted_at TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);
```

### DJ Profiles Table
```sql
CREATE TABLE dj_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    bio TEXT,
    genres TEXT[], -- Array of genre strings
    avatar_url VARCHAR(500),
    banner_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    follower_count INTEGER DEFAULT 0,
    stream_count INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    verified_artist BOOLEAN DEFAULT FALSE,
    social_links JSONB, -- {twitter: '', instagram: '', etc}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_stage_name (stage_name),
    INDEX idx_rating (rating),
    FULLTEXT INDEX idx_bio (bio)
);
```

### Performer Profiles Table
```sql
CREATE TABLE performer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    banner_url VARCHAR(500),
    privacy_settings JSONB NOT NULL DEFAULT '{}',
    blocked_regions TEXT[], -- Array of country/region codes
    blocked_users UUID[], -- Array of user IDs
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    follower_count INTEGER DEFAULT 0,
    stream_count INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    verified_performer BOOLEAN DEFAULT FALSE,
    social_links JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_stage_name (stage_name),
    FULLTEXT INDEX idx_bio (bio)
);
```

### Tracks Table
```sql
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dj_id UUID NOT NULL REFERENCES dj_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    album VARCHAR(255),
    genre VARCHAR(100),
    bpm INTEGER,
    duration INTEGER NOT NULL, -- Duration in seconds
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_format VARCHAR(20) NOT NULL,
    waveform_data JSONB, -- Waveform visualization data
    scanned BOOLEAN DEFAULT FALSE,
    scan_results JSONB,
    copyright_status VARCHAR(50),
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    INDEX idx_dj_id (dj_id),
    INDEX idx_title (title),
    INDEX idx_genre (genre),
    INDEX idx_upload_date (upload_date)
);
```

### Streams Table
```sql
CREATE TABLE streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL,
    creator_type VARCHAR(20) NOT NULL CHECK (creator_type IN ('dj', 'performer')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    tags TEXT[],
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    scheduled_start TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    viewer_count INTEGER DEFAULT 0,
    peak_viewers INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    recording_url VARCHAR(500),
    recording_enabled BOOLEAN DEFAULT TRUE,
    earnings DECIMAL(10,2) DEFAULT 0.00,
    chat_enabled BOOLEAN DEFAULT TRUE,
    multistream_config JSONB, -- Configuration for multi-platform streaming
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_creator (creator_id, creator_type),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_category (category),
    FULLTEXT INDEX idx_title_desc (title, description)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    creator_id UUID NOT NULL,
    creator_type VARCHAR(20) NOT NULL CHECK (creator_type IN ('dj', 'performer')),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('tip', 'subscription', 'private_show', 'payout')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    platform_fee DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50), -- stripe, paypal, etc
    provider_transaction_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_creator (creator_id, creator_type),
    INDEX idx_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES users(id),
    creator_id UUID NOT NULL,
    creator_type VARCHAR(20) NOT NULL CHECK (creator_type IN ('dj', 'performer')),
    tier VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_subscriber (subscriber_id),
    INDEX idx_creator (creator_id, creator_type),
    INDEX idx_status (status),
    INDEX idx_period_end (current_period_end)
);
```

### Follows Table
```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id),
    following_id UUID NOT NULL,
    following_type VARCHAR(20) NOT NULL CHECK (following_type IN ('dj', 'performer')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id, following_type),
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id, following_type)
);
```

### Reports Table
```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    reported_user_id UUID,
    reported_stream_id UUID REFERENCES streams(id),
    reported_message_id UUID,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('harassment', 'spam', 'inappropriate_content', 'copyright', 'other')),
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reporter (reporter_id),
    INDEX idx_reported_user (reported_user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    data JSONB, -- Additional notification data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_read (read),
    INDEX idx_created_at (created_at)
);
```

### Payouts Table
```sql
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL,
    creator_type VARCHAR(20) NOT NULL CHECK (creator_type IN ('dj', 'performer')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSONB, -- Bank account, PayPal email, etc (encrypted)
    scheduled_date DATE NOT NULL,
    processed_date TIMESTAMP,
    transaction_ids UUID[], -- Array of transaction IDs included in payout
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_creator (creator_id, creator_type),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date)
);
```

### Settings Table
```sql
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50),
    theme VARCHAR(20) DEFAULT 'light',
    notification_preferences JSONB DEFAULT '{}',
    privacy_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);
```

## MongoDB Collections

### Chat Messages Collection
```javascript
{
  _id: ObjectId,
  streamId: UUID,
  userId: UUID,
  username: String,
  userRole: String, // 'viewer', 'subscriber', 'moderator'
  message: String,
  timestamp: ISODate,
  deleted: Boolean,
  deletedAt: ISODate,
  deletedBy: UUID,
  metadata: {
    emotes: Array,
    mentions: Array,
    links: Array
  }
}

// Indexes
db.chat_messages.createIndex({ streamId: 1, timestamp: -1 })
db.chat_messages.createIndex({ userId: 1 })
db.chat_messages.createIndex({ timestamp: -1 })
```

### Activity Logs Collection
```javascript
{
  _id: ObjectId,
  userId: UUID,
  action: String, // 'login', 'upload', 'stream_start', etc
  resourceType: String,
  resourceId: UUID,
  ipAddress: String,
  userAgent: String,
  metadata: Object,
  timestamp: ISODate
}

// Indexes
db.activity_logs.createIndex({ userId: 1, timestamp: -1 })
db.activity_logs.createIndex({ action: 1 })
db.activity_logs.createIndex({ timestamp: -1 })
```

### Analytics Events Collection
```javascript
{
  _id: ObjectId,
  eventType: String, // 'stream_view', 'track_play', 'tip', etc
  userId: UUID,
  creatorId: UUID,
  resourceId: UUID,
  value: Number,
  metadata: Object,
  timestamp: ISODate,
  sessionId: String
}

// Indexes
db.analytics_events.createIndex({ eventType: 1, timestamp: -1 })
db.analytics_events.createIndex({ creatorId: 1, timestamp: -1 })
db.analytics_events.createIndex({ timestamp: -1 })
```

## Redis Data Structures

### Session Storage
```
Key: session:{sessionId}
Type: Hash
TTL: 24 hours
Fields: userId, role, lastActivity, ipAddress
```

### Live Stream Viewers
```
Key: stream:{streamId}:viewers
Type: Set
Members: userId
TTL: Cleanup on stream end
```

### Rate Limiting
```
Key: ratelimit:{userId}:{endpoint}
Type: String
TTL: Rate limit window (15 minutes)
```

### Real-time Counters
```
Key: counter:stream:{streamId}:viewers
Type: String (number)
TTL: None
```

## Database Migrations

### Migration Structure
```
migrations/
├── 001_initial_schema.sql
├── 002_add_streaming_tables.sql
├── 003_add_payment_tables.sql
├── 004_add_indexes.sql
└── 005_add_analytics_tables.sql
```

### Running Migrations
```bash
# Run all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Create new migration
npm run migrate:create migration_name
```

## Database Seeding

### Seed Data
- Test users (DJs, Performers, Viewers)
- Sample tracks
- Sample streams
- Categories and genres
- Default settings

### Running Seeds
```bash
# Seed development database
npm run seed

# Seed with specific data
npm run seed:users
npm run seed:tracks
```

## Backup and Recovery

### Backup Strategy
- **PostgreSQL**: Daily full backups, hourly incremental
- **MongoDB**: Daily backups of collections
- **Redis**: Snapshot every 6 hours
- Retention: 30 days

### Backup Commands
```bash
# PostgreSQL backup
pg_dump -U postgres -d nrsgirls > backup.sql

# MongoDB backup
mongodump --db nrsgirls --out /backup/

# Restore PostgreSQL
psql -U postgres -d nrsgirls < backup.sql

# Restore MongoDB
mongorestore --db nrsgirls /backup/nrsgirls/
```

## Performance Optimization

### Indexing Strategy
- Primary keys on all tables
- Foreign keys indexed
- Frequently queried columns indexed
- Composite indexes for common queries
- Partial indexes for filtered queries

### Query Optimization
- Use EXPLAIN ANALYZE for slow queries
- Avoid N+1 queries
- Use pagination for large datasets
- Implement query result caching
- Use connection pooling

### Partitioning
- Partition large tables (streams, transactions) by date
- Partition chat messages by streamId
- Archive old data to cold storage

## Monitoring

### Metrics to Monitor
- Connection pool usage
- Query execution times
- Slow query log
- Database size and growth
- Index usage statistics
- Cache hit rates

### Tools
- PostgreSQL: pg_stat_statements
- MongoDB: mongostat, mongotop
- Redis: redis-cli --stat
- Monitoring: Datadog, New Relic, Grafana

## Security

### Data Encryption
- Passwords: bcrypt hashing
- Sensitive data: AES-256 encryption
- Connection: SSL/TLS required
- Backups: Encrypted at rest

### Access Control
- Least privilege principle
- Separate read/write users
- Application-level user isolation
- Regular security audits

### Data Privacy
- GDPR compliance
- Data anonymization for analytics
- Right to deletion (soft deletes)
- Data export functionality

## File Structure
```
database/
├── migrations/
├── seeds/
├── models/
│   ├── user.model.js
│   ├── djProfile.model.js
│   ├── performerProfile.model.js
│   ├── track.model.js
│   ├── stream.model.js
│   └── transaction.model.js
├── queries/
│   ├── users.queries.js
│   ├── streams.queries.js
│   └── analytics.queries.js
├── config/
│   ├── postgres.config.js
│   ├── mongodb.config.js
│   └── redis.config.js
├── scripts/
│   ├── backup.sh
│   ├── restore.sh
│   └── optimize.sh
└── README.md
```

## Environment Variables
```bash
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=nrsgirls
POSTGRES_USER=nrsgirls_user
POSTGRES_PASSWORD=secure_password
POSTGRES_SSL=true

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nrsgirls

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Connection Pooling
DB_POOL_MIN=2
DB_POOL_MAX=10
```
