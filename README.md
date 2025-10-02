# NRSgirls Platform

**Where DJs and Performers Thrive**

NRSgirls.com is a revolutionary live-streaming platform connecting DJs and performers with audiences in a safe, legal, and profitable ecosystem. This monorepo contains the complete platform including web applications, API services, infrastructure configuration, and comprehensive documentation.

© NRS Group of Fresno. All rights reserved.

---

## 🎯 Project Overview

NRSgirls is a dual-focused platform serving both:
- **DJs**: Professional mixing, music upload, live streaming, and monetization
- **Performers**: Live streaming with advanced privacy controls and security features

### Key Features
- 🎵 Professional DJ mixing dashboard with real-time audio controls
- 🎭 Performer portal with industry-leading privacy and security
- 🔒 Military-grade encryption and data protection
- 💰 Fair revenue sharing (creators keep 80%)
- 🌐 Multi-platform streaming support (YouTube, Twitch, Facebook)
- 📊 Real-time analytics and earnings tracking
- 🛡️ Comprehensive content moderation and safety features

---

## 📁 Project Structure

```
nrsgirls-platform/
├── README.md                    # This file - Complete project overview
├── docs/                        # Comprehensive documentation
│   ├── VISION.md               # 19-year story and platform vision
│   ├── TEAM.md                 # Team structure and roles
│   ├── TECHNICAL_SPEC.md       # Complete technical specifications
│   ├── LEGAL_MEMO.md           # Legal analysis and compliance
│   └── BUSINESS_PLAN.md        # Revenue model and growth strategy
│
├── frontend/                    # Frontend applications
│   ├── homepage/               # Landing page with DJ/Performer split
│   ├── dj-portal/              # DJ enrollment, upload, dashboard
│   ├── performer-portal/       # Performer profiles and privacy controls
│   └── shared-components/      # Reusable UI components
│
├── backend/                     # Backend services
│   ├── api/                    # RESTful API endpoints
│   ├── database/               # Database schemas and migrations
│   ├── security/               # Security services (scanning, moderation)
│   └── streaming/              # Streaming infrastructure
│
├── brand-assets/               # Brand identity and assets
│   ├── logos/                  # NRS branding in multiple formats
│   ├── color-schemes/          # Color palettes and swatches
│   └── style-guide.md          # Complete brand style guide
│
├── deployment/                 # Deployment configuration
│   ├── docker-compose.yml      # Docker orchestration
│   ├── vercel.json            # Vercel deployment config
│   └── infrastructure-setup.md # Infrastructure setup guide
│
└── scripts/                    # Automation scripts
    ├── setup.sh               # One-command development setup
    └── deploy.sh              # Deployment automation
```

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 20.10+
- Node.js 18 LTS
- Git

### One-Command Setup
```bash
# Clone the repository
git clone https://github.com/NRSgirls-com/nrsgirls.git
cd nrsgirls

# Run setup script (sets up entire environment)
./scripts/setup.sh
```

The setup script will:
- ✓ Check all prerequisites
- ✓ Create environment configuration
- ✓ Generate secure secrets
- ✓ Start all services with Docker
- ✓ Initialize databases
- ✓ Run migrations
- ✓ Optionally seed sample data

### Manual Setup
```bash
# 1. Create environment file
cp .env.example .env
# Edit .env with your configuration

# 2. Start services
docker-compose up -d

# 3. Run migrations
docker-compose exec api npm run migrate

# 4. Access the platform
# Frontend: http://localhost:3001
# API: http://localhost:3000
# API Docs: http://localhost:3000/api/docs
```

---

## 📚 Documentation

### Core Documentation
- **[Vision & Mission](docs/VISION.md)** - The 19-year story behind NRSgirls
- **[Team Structure](docs/TEAM.md)** - Roles and responsibilities
- **[Technical Specifications](docs/TECHNICAL_SPEC.md)** - Complete technical details
- **[Legal Framework](docs/LEGAL_MEMO.md)** - Legal analysis and compliance
- **[Business Plan](docs/BUSINESS_PLAN.md)** - Revenue model and scaling to 3%

### Component Documentation
- **[Frontend - Homepage](frontend/homepage/README.md)** - Landing page details
- **[Frontend - DJ Portal](frontend/dj-portal/README.md)** - DJ features and tools
- **[Frontend - Performer Portal](frontend/performer-portal/README.md)** - Performer features
- **[Frontend - Shared Components](frontend/shared-components/README.md)** - UI component library
- **[Backend - API](backend/api/README.md)** - API endpoints and services
- **[Backend - Database](backend/database/README.md)** - Database schemas
- **[Backend - Security](backend/security/README.md)** - Security infrastructure
- **[Backend - Streaming](backend/streaming/README.md)** - Streaming setup

### Brand & Deployment
- **[Brand Style Guide](brand-assets/style-guide.md)** - Complete brand guidelines
- **[Infrastructure Setup](deployment/infrastructure-setup.md)** - Cloud deployment guide

---

## 🛠️ Development

### Available Commands
```bash
# Development
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose logs -f        # View logs

# Database
npm run migrate              # Run migrations
npm run seed                 # Seed database
npm run migrate:rollback     # Rollback last migration

# Testing
npm test                     # Run all tests
npm run test:coverage        # Run with coverage
npm run test:e2e            # Run E2E tests

# Deployment
./scripts/deploy.sh -e staging -v 1.0.0    # Deploy to staging
./scripts/deploy.sh -e production -v 1.0.0 # Deploy to production
```

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write/update tests
4. Run tests: `npm test`
5. Commit changes: `git commit -m "Description"`
6. Push to branch: `git push origin feature/your-feature`
7. Create Pull Request

---

## 🏗️ Architecture

### Technology Stack
**Frontend**
- React + Next.js
- Tailwind CSS
- WebRTC for streaming
- Redux for state management

**Backend**
- Node.js + Express
- PostgreSQL (primary database)
- MongoDB (media metadata)
- Redis (caching)

**Infrastructure**
- Docker + Docker Compose
- AWS (ECS, RDS, S3, CloudFront)
- Cloudflare (CDN, DDoS protection)
- nginx (reverse proxy)

**Security**
- ClamAV (virus scanning)
- bcrypt (password hashing)
- JWT (authentication)
- TLS/SSL encryption

---

## 🔒 Security

Security is our top priority. We implement:
- End-to-end encryption for sensitive data
- Automated virus scanning on all uploads
- Content moderation (AI + human review)
- DDoS protection and rate limiting
- Two-factor authentication
- Regular security audits
- GDPR and CCPA compliance

See [Security Documentation](backend/security/README.md) for details.

---

## 🌟 Key Features

### For DJs
- Professional audio mixing dashboard
- MP3 upload with virus scanning
- Live streaming with multiple platforms
- Real-time analytics and earnings
- Automated payouts
- Copyright detection

### For Performers
- Advanced privacy controls
- Geographic blocking
- User blocking and reporting
- Anonymous streaming mode
- Secure messaging
- Emergency stop functionality

### For All Users
- HD streaming with adaptive bitrate
- Real-time chat
- Subscription and tipping
- Mobile and desktop support
- 24/7 customer support

---

## 📊 Project Status

**Current Phase**: Development  
**Target Launch**: Q2 2024  
**Market Goal**: 3% market share within 5 years

### Roadmap
- ✓ Platform design and architecture
- ✓ Core infrastructure setup
- ✓ Documentation complete
- 🔄 Frontend development (in progress)
- 🔄 Backend API development (in progress)
- ⏳ Security implementation
- ⏳ Beta testing
- ⏳ Public launch

---

## 👥 Team

- **Founder & CEO**: Strategic vision and platform direction
- **DJ Dollar**: DJ experience lead and community manager
- **Madam**: Performer experience lead and safety officer

See [Team Documentation](docs/TEAM.md) for complete details.

---

## 🤝 Contributing

This is a private repository. For contribution guidelines, please contact:
- **Email**: dev@nrsgirls.com
- **Slack**: #development

---

## 📄 License

© 2024 NRS Group of Fresno. All rights reserved.

This is proprietary software. Unauthorized copying, modification, distribution, or use is strictly prohibited. See LICENSE file for details.

---

## 📞 Contact & Support

- **Website**: https://nrsgirls.com
- **Email**: support@nrsgirls.com
- **Documentation**: docs.nrsgirls.com
- **Status Page**: status.nrsgirls.com

### For Specific Inquiries
- **Business**: business@nrsgirls.com
- **Legal**: legal@nrsgirls.com
- **Security**: security@nrsgirls.com
- **Brand/Media**: brand@nrsgirls.com

---

## 🙏 Acknowledgments

Built with passion and 19 years of industry experience. Special thanks to all contributors, advisors, and early supporters who believe in our vision.

**Where DJs and Performers Thrive** 🎵🎭
