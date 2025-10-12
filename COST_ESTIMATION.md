# BookYourTrip - Cost Estimation & Resource Planning

## Executive Summary

This document provides a comprehensive cost estimation for deploying and operating the BookYourTrip system at various scales, from development/testing to production with 100 DAU and 250+ bookings per day.

---

## Table of Contents

1. [Infrastructure Overview](#infrastructure-overview)
2. [Development/Testing Environment](#developmenttesting-environment)
3. [Production Environment (Free Tier)](#production-environment-free-tier)
4. [Production Environment (Paid - 100 DAU)](#production-environment-paid---100-dau)
5. [Scaling Plan](#scaling-plan)
6. [Cost Optimization Strategies](#cost-optimization-strategies)

---

## Infrastructure Overview

### Components

| Component | Purpose | Scalability |
|-----------|---------|-------------|
| Auth Service | User authentication & authorization | Stateless, horizontally scalable |
| Booking Service | Trip management & booking | Stateless, horizontally scalable |
| AI Service | Dynamic pricing | Stateless, horizontally scalable |
| PostgreSQL (x3) | Data persistence | Vertically scalable, can add replicas |
| Redis | Caching & seat holds | Single instance + replica for HA |
| NATS | Event bus | Clustered for HA |

---

## Development/Testing Environment

### Local Development (Docker Compose)

**Cost**: **$0/month** ✅

**Requirements**:
- Developer laptop/workstation
- Docker Desktop (free for personal use)
- 8GB RAM minimum, 16GB recommended
- 20GB disk space

**Services Running Locally**:
- 3 Node.js services
- 3 PostgreSQL databases
- 1 Redis instance
- 1 NATS instance

**Estimated Resource Usage**:
- CPU: ~2-4 cores
- RAM: ~4-6GB
- Disk: ~5GB

---

## Production Environment (Free Tier)

### Recommended Platform: **Render.com** (Free Tier)

#### Service Configuration

| Service | Tier | Specs | Cost |
|---------|------|-------|------|
| Auth Service | Free | 512MB RAM, 0.1 CPU | $0 |
| Booking Service | Free | 512MB RAM, 0.1 CPU | $0 |
| AI Service | Free | 512MB RAM, 0.1 CPU | $0 |
| PostgreSQL (Auth DB) | Free | 256MB RAM, 1GB storage | $0 |
| PostgreSQL (Booking DB) | Free | 256MB RAM, 1GB storage | $0 |
| PostgreSQL (AI DB) | Free | 256MB RAM, 1GB storage | $0 |
| Redis | External (Redis Labs Free) | 30MB, 30 connections | $0 |
| NATS | Not needed in free tier | N/A | $0 |

**Total Cost**: **$0/month** ✅

#### Limitations

- Services sleep after 15 minutes of inactivity
- ~750 hours/month uptime per service
- No custom domains (use *.onrender.com)
- Limited to 100GB bandwidth/month
- No SLA guarantees
- Cold start time: 30-60 seconds

#### Alternative Free Platforms

| Platform | Pros | Cons |
|----------|------|------|
| **Railway** | Generous free tier ($5 credit/month) | Credit-based, expires |
| **Fly.io** | 3 VMs free, good performance | Complex config, resource limits |
| **Cyclic.sh** | Simple deployment, serverless | Limited database options |
| **Vercel** | Great for frontend, serverless functions | Not ideal for long-running services |

**Recommended for Assignment**: **Render.com** - Easy setup, good documentation, reliable free tier.

---

## Production Environment (Paid - 100 DAU)

### Target Metrics

- **Daily Active Users (DAU)**: 100
- **Bookings per Day**: 250+
- **Peak concurrent users**: ~25
- **API Requests per Day**: ~5,000
- **Database Size**: ~500MB (first year)

### Recommended Platform: **Render.com** (Starter Tier)

#### Service Configuration

| Service | Tier | Specs | Cost/Month |
|---------|------|-------|------------|
| **Auth Service** | Starter | 512MB RAM, 0.5 CPU | $7 |
| **Booking Service** | Starter | 1GB RAM, 0.5 CPU | $7 |
| **AI Service** | Starter | 512MB RAM, 0.5 CPU | $7 |
| **PostgreSQL** | Starter (Shared) | 1GB RAM, 10GB storage | $7 |
| **Redis** | Starter (Managed) | 256MB, 1000 connections | $10 |

**Subtotal**: $38/month

#### Additional Services

| Service | Purpose | Cost/Month |
|---------|---------|------------|
| **Uptime Monitoring** | Health checks, alerts | $5 |
| **Log Management** | Better Call Saul (free tier) | $0 |
| **CDN** | Cloudflare (free tier) | $0 |
| **Domain** | .com domain | $1 |
| **SSL** | Let's Encrypt (free) | $0 |

**Total Estimated Cost**: **$44/month** 💰

### Alternative Cloud Providers

#### AWS (Amazon Web Services)

| Service | Specs | Cost/Month |
|---------|-------|------------|
| EC2 (t3.micro) x3 | 1GB RAM, 2 vCPU (burstable) | $30 |
| RDS PostgreSQL (t3.micro) | 1GB RAM, 20GB storage | $15 |
| ElastiCache Redis (t3.micro) | 512MB | $15 |
| Load Balancer | Application Load Balancer | $18 |
| Data Transfer | ~50GB/month | $5 |

**Total**: ~$83/month

**Free Tier Eligible** (first 12 months): ~$30/month after free tier credits

#### Google Cloud Platform (GCP)

| Service | Specs | Cost/Month |
|---------|-------|------------|
| Cloud Run (3 services) | Auto-scaling, 512MB-1GB RAM | $20 |
| Cloud SQL (PostgreSQL) | Shared-core, 10GB storage | $10 |
| Memorystore (Redis) | Basic, 1GB | $36 |
| Load Balancing | Global LB | $18 |

**Total**: ~$84/month

**Free Tier**: $300 credit for 90 days

#### Microsoft Azure

| Service | Specs | Cost/Month |
|---------|-------|------------|
| App Service (B1) x3 | 1.75GB RAM, 1 vCPU | $42 |
| Azure Database for PostgreSQL | Basic, 1 vCore | $27 |
| Azure Cache for Redis | Basic, 250MB | $16 |

**Total**: ~$85/month

**Free Tier**: $200 credit for 30 days + some always-free services

#### DigitalOcean

| Service | Specs | Cost/Month |
|---------|-------|------------|
| Droplets x3 | 1GB RAM, 1 vCPU | $18 |
| Managed PostgreSQL | 1GB RAM, 10GB storage | $15 |
| Managed Redis | 1GB RAM | $15 |
| Load Balancer | Standard | $12 |

**Total**: ~$60/month

**Simpler pricing**, no hidden costs.

---

## Cost Comparison Summary (100 DAU)

| Provider | Monthly Cost | Complexity | Free Tier | Recommended For |
|----------|--------------|------------|-----------|-----------------|
| **Render.com** | $44 | ⭐ Easy | Yes (limited) | **Assignment/MVP** ✅ |
| **Railway** | $50 | ⭐⭐ Easy | $5 credit/month | Quick prototypes |
| **DigitalOcean** | $60 | ⭐⭐ Moderate | $200 for 60 days | Predictable costs |
| **AWS** | $83* | ⭐⭐⭐⭐ Complex | 12 months free tier | Enterprise/Scale |
| **GCP** | $84 | ⭐⭐⭐⭐ Complex | $300 for 90 days | ML/Analytics heavy |
| **Azure** | $85 | ⭐⭐⭐⭐ Complex | $200 for 30 days | Microsoft ecosystem |

*After 12-month free tier

---

## Scaling Plan

### Phase 1: Launch (0-50 DAU)

**Platform**: Render.com Free Tier  
**Cost**: $0/month  
**Bottlenecks**: Cold starts, limited uptime

### Phase 2: Growth (50-100 DAU)

**Platform**: Render.com Starter  
**Cost**: $44/month  
**Configuration**:
- Single instance per service
- Shared database
- Basic monitoring

### Phase 3: Optimization (100-500 DAU)

**Cost**: ~$120/month  
**Changes**:
- Scale Booking Service to 2 instances (+$7)
- Upgrade database to Standard ($20 → $50)
- Upgrade Redis to Standard ($10 → $30)
- Add CDN and caching (+$10)

### Phase 4: Scale (500-2000 DAU)

**Cost**: ~$300/month  
**Changes**:
- Migrate to AWS/GCP
- Auto-scaling enabled
- Database read replicas
- Multi-region deployment
- Advanced monitoring and alerting

### Phase 5: Enterprise (2000+ DAU)

**Cost**: $1000+/month  
**Changes**:
- Kubernetes orchestration
- Multi-region active-active
- Dedicated database instances
- 24/7 support
- Advanced security features

---

## Scaling Triggers

| Metric | Current | Scale Up Trigger | Action |
|--------|---------|------------------|--------|
| Response Time | <200ms | >500ms p95 | Add service instances |
| CPU Usage | <50% | >70% sustained | Vertical scaling |
| Database Connections | <100 | >80% of limit | Connection pooling or upgrade |
| Cache Hit Rate | >90% | <80% | Increase cache size |
| Error Rate | <0.1% | >1% | Investigate and add capacity |

---

## Cost Optimization Strategies

### 1. Caching Strategy

- **Redis for Hot Data**: Cache frequently accessed trips and routes
- **Estimated Savings**: Reduce database load by 60%, avoid database upgrades
- **Cost**: Already included in base tier

### 2. Database Optimization

- **Connection Pooling**: Reduce connection overhead
- **Indexes**: Speed up queries (already implemented via Prisma)
- **Data Archiving**: Move old bookings to cold storage after 1 year
- **Estimated Savings**: $20/month on database tier

### 3. Serverless for Low-Traffic Services

- **AI Service**: Can be serverless (only called during bookings)
- **Platform**: AWS Lambda or Google Cloud Functions
- **Estimated Savings**: $5-10/month

### 4. Resource Right-Sizing

- **Monitor actual usage** via metrics
- **Downgrade oversized** services
- **Estimated Savings**: 15-20% of total cost

### 5. Reserved Instances (AWS/Azure)

- **Commit to 1-3 years** for 40-60% discount
- **Only after stable traffic** patterns established

### 6. Content Delivery Network (CDN)

- **Use Cloudflare Free Tier** for static assets
- **Reduce bandwidth costs** by 70%
- **Cost**: $0

---

## Budget Recommendations

### For CS455 Assignment

**Budget**: **$0-5/month** ✅

**Recommendation**: Use **Render.com Free Tier**
- Meets all functional requirements
- Easy to set up and demonstrate
- No credit card required
- Sufficient for grading and demos

### For Real MVP Launch

**Budget**: **$50-100/month**

**Recommendation**: Use **Render.com Starter + DigitalOcean** for databases
- Better performance and uptime
- Custom domain support
- Real production readiness
- Can handle initial users

### For Production (100+ DAU)

**Budget**: **$100-300/month**

**Recommendation**: **AWS or GCP** with proper monitoring
- Enterprise-grade reliability
- Advanced features (auto-scaling, multi-region)
- Strong ecosystem and support
- Better long-term scaling path

---

## Hidden Costs to Consider

| Cost Category | Estimated/Month | Notes |
|---------------|-----------------|-------|
| **Monitoring & Logging** | $10-50 | DataDog, New Relic, etc. |
| **Error Tracking** | $0-25 | Sentry free tier up to 5K events |
| **CI/CD** | $0 | GitHub Actions (free for public repos) |
| **SSL Certificates** | $0 | Let's Encrypt (free) |
| **Email Service** | $0-10 | SendGrid free tier: 100 emails/day |
| **SMS Notifications** | $0-20 | Twilio (if implemented) |
| **Developer Tools** | $0 | VS Code, Git, Docker (free) |
| **Testing Tools** | $0 | Jest, Supertest (free) |
| **Domain Name** | $12/year | .com domain ($1/month) |

---

## ROI Analysis (Future Consideration)

### Revenue Model (Example)

- **Commission per booking**: 5%
- **Average booking value**: $40
- **Revenue per booking**: $2
- **250 bookings/day**: $500/day = **$15,000/month** 💰

### Break-Even Analysis

At $44/month infrastructure cost:
- **Break-even**: 22 bookings/month
- **Target**: 250 bookings/day = 7,500 bookings/month
- **Profit Margin**: 99.7% (infrastructure cost negligible)

**Actual costs** will include:
- Customer support
- Marketing
- Payment processing fees (~2.9% + $0.30)
- Legal and compliance
- Development and maintenance

---

## Monitoring and Cost Alerts

### Recommended Tools

1. **Cloud Provider Dashboard** (Built-in, free)
2. **Cost Anomaly Detection** (AWS Cost Explorer, GCP Cost Management)
3. **Budget Alerts** (Set at 50%, 80%, 100% of monthly budget)
4. **Resource Tagging** (Track costs by service/environment)

### Key Metrics to Track

- Cost per user
- Cost per booking
- Cost per service
- Bandwidth usage
- Database growth rate
- Cache efficiency

---

## Conclusion

### For CS455 Assignment

**Recommended Setup**: Render.com Free Tier  
**Total Cost**: **$0/month** ✅  
**Justification**: 
- Meets all assignment requirements
- Easy to demonstrate
- No financial barrier
- Production-like environment

### For Future Production

**Recommended Setup**: Render.com Starter (Phase 2) → AWS/GCP (Phase 4)  
**Initial Cost**: **$44/month**  
**Scaling Path**: Clear upgrade path as user base grows  
**ROI**: Infrastructure cost negligible compared to potential revenue

---

## References

- [Render.com Pricing](https://render.com/pricing)
- [AWS Pricing Calculator](https://calculator.aws/)
- [GCP Pricing Calculator](https://cloud.google.com/products/calculator)
- [DigitalOcean Pricing](https://www.digitalocean.com/pricing)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)

---

**Document Version**: 1.0  
**Last Updated**: October 12, 2025  
**Prepared By**: BookYourTrip Team

