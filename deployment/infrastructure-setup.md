# Infrastructure Setup Guide - NRSgirls Platform

## Overview
This document provides comprehensive instructions for setting up the NRSgirls platform infrastructure across different environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Cloud Infrastructure](#cloud-infrastructure)
4. [Database Setup](#database-setup)
5. [CDN Configuration](#cdn-configuration)
6. [Streaming Infrastructure](#streaming-infrastructure)
7. [Security Setup](#security-setup)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Scaling Strategy](#scaling-strategy)

## Prerequisites

### Required Software
- Docker Desktop 20.10+
- Node.js 18 LTS
- Python 3.10+ (if using Python backend)
- Git
- AWS CLI (for AWS deployments)
- kubectl (for Kubernetes deployments)
- Terraform 1.5+ (for infrastructure as code)

### Required Accounts
- AWS Account (or GCP/Azure alternative)
- Stripe Account (payment processing)
- Cloudflare Account (CDN and security)
- SendGrid Account (email service)
- Sentry Account (error tracking)

## Local Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/NRSgirls-com/nrsgirls.git
cd nrsgirls
```

### Step 2: Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your local configuration
nano .env
```

### Step 3: Start Services with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Step 4: Initialize Database
```bash
# Run migrations
docker-compose exec api npm run migrate

# Seed database (optional)
docker-compose exec api npm run seed
```

### Step 5: Access Services
- Frontend: http://localhost:3001
- API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

## Cloud Infrastructure

### AWS Infrastructure

#### Architecture Overview
```
[Internet] 
    ↓
[CloudFront CDN]
    ↓
[Route 53 DNS]
    ↓
[Application Load Balancer]
    ↓         ↓
[ECS Fargate Cluster]
    ↓
[RDS PostgreSQL] [DocumentDB] [ElastiCache Redis]
[S3 Bucket]
```

#### Step 1: VPC Setup
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Create Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-xxxxx --internet-gateway-id igw-xxxxx
```

#### Step 2: RDS PostgreSQL
```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name nrsgirls-db-subnet \
  --db-subnet-group-description "NRSgirls DB Subnet Group" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier nrsgirls-postgres \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.3 \
  --master-username nrsgirls \
  --master-user-password <password> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --db-subnet-group-name nrsgirls-db-subnet \
  --vpc-security-group-ids sg-xxxxx \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --multi-az
```

#### Step 3: ElastiCache Redis
```bash
# Create cache subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name nrsgirls-cache-subnet \
  --cache-subnet-group-description "NRSgirls Cache Subnet Group" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-id nrsgirls-redis \
  --replication-group-description "NRSgirls Redis Cluster" \
  --engine redis \
  --cache-node-type cache.t3.medium \
  --num-cache-clusters 2 \
  --cache-subnet-group-name nrsgirls-cache-subnet \
  --security-group-ids sg-xxxxx \
  --automatic-failover-enabled
```

#### Step 4: S3 Buckets
```bash
# Create media storage bucket
aws s3 mb s3://nrsgirls-media

# Configure bucket for static hosting
aws s3 website s3://nrsgirls-media --index-document index.html

# Set bucket policy
aws s3api put-bucket-policy \
  --bucket nrsgirls-media \
  --policy file://s3-bucket-policy.json

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket nrsgirls-media \
  --versioning-configuration Status=Enabled

# Configure lifecycle rules
aws s3api put-bucket-lifecycle-configuration \
  --bucket nrsgirls-media \
  --lifecycle-configuration file://lifecycle.json
```

#### Step 5: ECS Fargate Cluster
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name nrsgirls-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster nrsgirls-cluster \
  --service-name nrsgirls-api \
  --task-definition nrsgirls-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}"
```

#### Step 6: Application Load Balancer
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name nrsgirls-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing

# Create target group
aws elbv2 create-target-group \
  --name nrsgirls-api-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --health-check-path /health \
  --target-type ip

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### Terraform Configuration

#### main.tf
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "nrsgirls-terraform-state"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr = "10.0.0.0/16"
  environment = var.environment
}

# RDS
module "rds" {
  source = "./modules/rds"
  
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  instance_class = var.db_instance_class
}

# ECS
module "ecs" {
  source = "./modules/ecs"
  
  cluster_name = "nrsgirls-${var.environment}"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}

# S3
module "s3" {
  source = "./modules/s3"
  
  bucket_name = "nrsgirls-media-${var.environment}"
}
```

#### variables.tf
```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}
```

## Database Setup

### PostgreSQL Configuration

#### Production Settings
```sql
-- postgresql.conf
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10485kB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
max_parallel_maintenance_workers = 2
```

#### Replication Setup
```sql
-- On primary
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET max_wal_senders = 10;
ALTER SYSTEM SET wal_keep_size = '1GB';

-- Create replication user
CREATE ROLE replicator WITH REPLICATION PASSWORD 'password' LOGIN;

-- pg_hba.conf
host replication replicator 0.0.0.0/0 md5
```

### MongoDB Configuration

#### Replica Set Setup
```bash
# Initialize replica set
mongosh --eval "rs.initiate({
  _id: 'nrsgirls-rs',
  members: [
    { _id: 0, host: 'mongo1.nrsgirls.com:27017' },
    { _id: 1, host: 'mongo2.nrsgirls.com:27017' },
    { _id: 2, host: 'mongo3.nrsgirls.com:27017' }
  ]
})"

# Check replica set status
mongosh --eval "rs.status()"
```

## CDN Configuration

### Cloudflare Setup

#### DNS Configuration
```
# A Records
@ -> 1.2.3.4 (Proxied)
www -> 1.2.3.4 (Proxied)
api -> 5.6.7.8 (Proxied)
stream -> 9.10.11.12 (DNS only)

# CNAME Records
cdn -> nrsgirls.com (Proxied)
media -> s3-bucket.s3.amazonaws.com (Proxied)
```

#### Page Rules
```
1. URL: *nrsgirls.com/api/*
   Settings:
   - Cache Level: Bypass
   - Security Level: Medium
   
2. URL: *nrsgirls.com/static/*
   Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   
3. URL: *nrsgirls.com/*
   Settings:
   - SSL: Full (strict)
   - Always Use HTTPS: On
   - Auto Minify: JS, CSS, HTML
```

### AWS CloudFront

#### Distribution Configuration
```json
{
  "Comment": "NRSgirls CDN",
  "Origins": [
    {
      "Id": "S3-nrsgirls-media",
      "DomainName": "nrsgirls-media.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": "origin-access-identity/cloudfront/XXXXX"
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-nrsgirls-media",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": ["GET", "HEAD"],
    "CachedMethods": ["GET", "HEAD"],
    "Compress": true,
    "DefaultTTL": 86400,
    "MinTTL": 0,
    "MaxTTL": 31536000
  },
  "PriceClass": "PriceClass_All",
  "Enabled": true
}
```

## Streaming Infrastructure

### Media Server Setup

#### Wowza Streaming Engine
```bash
# Install Wowza
wget https://www.wowza.com/downloads/WowzaStreamingEngine-x.x.x.deb.bin
chmod +x WowzaStreamingEngine-x.x.x.deb.bin
sudo ./WowzaStreamingEngine-x.x.x.deb.bin

# Configure application
sudo nano /usr/local/WowzaStreamingEngine/conf/live/Application.xml
```

#### nginx-rtmp Setup
```nginx
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        
        application live {
            live on;
            record off;
            
            # HLS
            hls on;
            hls_path /tmp/hls;
            hls_fragment 2s;
            hls_playlist_length 6s;
            
            # Authentication
            on_publish http://api.nrsgirls.com/api/v1/stream/auth;
            
            # Recording
            recorder all {
                record all;
                record_path /recordings;
                record_unique on;
            }
        }
    }
}
```

## Security Setup

### SSL/TLS Certificates

#### Let's Encrypt with Certbot
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d nrsgirls.com -d www.nrsgirls.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Firewall Configuration

#### AWS Security Groups
```bash
# Web traffic
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# RTMP streaming
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 1935 \
  --cidr 0.0.0.0/0

# Database (internal only)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-yyyyy
```

## Monitoring and Logging

### CloudWatch Setup
```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/nrsgirls-api

# Create metric alarm
aws cloudwatch put-metric-alarm \
  --alarm-name nrsgirls-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### Datadog Integration
```yaml
# datadog.yaml
api_key: ${DATADOG_API_KEY}
logs_enabled: true
apm_enabled: true

logs:
  - type: file
    path: /var/log/nrsgirls/*.log
    service: nrsgirls-api
    source: nodejs
```

## Backup and Recovery

### Automated Backups

#### PostgreSQL
```bash
#!/bin/bash
# backup-postgres.sh

DATE=$(date +%Y-%m-%d-%H-%M)
BACKUP_DIR=/backups/postgres
S3_BUCKET=s3://nrsgirls-backups

# Create backup
pg_dump -U nrsgirls -h localhost nrsgirls | gzip > $BACKUP_DIR/nrsgirls-$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/nrsgirls-$DATE.sql.gz $S3_BUCKET/postgres/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

#### S3 Cross-Region Replication
```json
{
  "Role": "arn:aws:iam::ACCOUNT-ID:role/s3-replication-role",
  "Rules": [
    {
      "Status": "Enabled",
      "Priority": 1,
      "Filter": {},
      "Destination": {
        "Bucket": "arn:aws:s3:::nrsgirls-media-backup",
        "ReplicationTime": {
          "Status": "Enabled",
          "Time": {
            "Minutes": 15
          }
        }
      }
    }
  ]
}
```

## Scaling Strategy

### Horizontal Scaling

#### Auto Scaling Configuration
```bash
# Create Auto Scaling Target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/nrsgirls-cluster/nrsgirls-api \
  --min-capacity 2 \
  --max-capacity 10

# Create Scaling Policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/nrsgirls-cluster/nrsgirls-api \
  --policy-name cpu-target-tracking-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

### Database Scaling

#### Read Replicas
```bash
# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier nrsgirls-postgres-replica-1 \
  --source-db-instance-identifier nrsgirls-postgres \
  --db-instance-class db.t3.medium \
  --availability-zone us-east-1b
```

## Troubleshooting

### Common Issues

#### High Database Connections
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND state_change < current_timestamp - INTERVAL '5 minutes';
```

#### Memory Issues
```bash
# Check memory usage
free -h
docker stats

# Clear system cache
sync && echo 3 > /proc/sys/vm/drop_caches
```

## Support

For infrastructure support:
- **DevOps Team**: devops@nrsgirls.com
- **Slack**: #infrastructure
- **Documentation**: docs.nrsgirls.com/infrastructure

---

**© NRS Group of Fresno. All rights reserved.**
