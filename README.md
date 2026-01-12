# Room Booking Platform - Technical Architecture & Strategy

This document outlines the high-level design, realistic constraints, and scalability strategies for the Room Booking Platform.

---

## 1. High-Level Architecture
The system is built using a **Modular Monolith** approach (Domain-Driven Design), designed for a seamless transition to **Microservices**.

### Components:
- **Load Balancer (Nginx/ALB)**: Acts as the entry point, distributing incoming traffic across multiple backend instances to ensure high availability and prevent any single point of failure.
- **API Gateway**: Orchestrates requests, handles global authentication, and can perform response transformation or request routing.
- **Web Application Firewall (WAF)**: Positioned in front of the Load Balancer to protect against common web exploits (SQL Injection, XSS) and filter malicious traffic.
- **Backend Service**: Node.js with TypeScript and Express.
- **Database (PostgreSQL)**: The primary source of truth, ensuring strong ACID compliance.
- **Caching & Logging (Redis)**: High-speed storage for logs and session/rate-limit data.

---

## 2. Realistic Constraints & Solutions

### A. Concurrency & Double-Booking
To prevent two users from booking the same room at the same time:
- **Implementation**: We use **Pessimistic Locking** (`SELECT ... FOR UPDATE`) within a Prisma database transaction.
- **Strategy**: This ensures that once a user starts a booking for a specific room/date, the row is locked at the DB level until the transaction completes.

### B. Rate Limiting
- **Implementation**: We use `express-rate-limit` with different tiers:
    - **Global API Limiter**: 100 requests/min.
    - **Auth Limiter**: 10 attempts/15 min to mitigate Brute Force attacks.

### C. Shared Validations (Zod)
- **Efficiency**: We use **Zod** for schema definitions. These schemas are shared between the Backend and Frontend (via a shared package or symlink).
- **Consistency**: This ensures that the UI provides immediate feedback based on the exact same rules that the server enforces, reducing unnecessary API calls and maintaining a single source of truth for data integrity.

---

## 3. Database Schema & API Endpoints

### Core Entities:
- **User**: Authentication and Role-Based Access Control (RBAC).
- **Room**: Catalog of properties and their total inventory.
- **Booking**: Junction table representing a confirmed reservation.
- **RoomAvailability**: Pre-calculated daily inventory for high-performance searching.

### Key Endpoints:
- `POST /api/v1/auth/register` & `login`: Identity management.
- `GET /api/v1/rooms`: Search with date-range availability checks.
- `POST /api/v1/bookings`: Secure booking execution with transaction logic.
- `GET /api-docs`: Interactive **Swagger** documentation for full API exploration.

---

## 4. Deployment & DevOps

### Containerization (Docker)
- **Portability**: The entire environment (App, DB, Redis) is containerized using **Docker**. 
- **Docker Compose**: Orchestrates local development, ensuring "it works on my machine" translates perfectly to production.
- **Multi-stage Builds**: Our Dockerfiles use multi-stage builds to keep production images lean (only JS files, no dev dependencies).

### CI/CD Pipeline
1. **Source Control**: Every change is pushed to a feature branch.
2. **CI (Continuous Integration)**: 
    - Automated Linting (ESLint).
    - Unit & Integration Tests.
    - Docker Image build verification.
3. **CD (Continuous Deployment)**:
    - Successful builds on `main` are automatically deployed to a staging/production cluster (K8s or ECS).
    - **Database Migrations**: Handled automatically by Prisma during the deployment phase to ensure the schema is always in sync.

---

## 5. Global Scalability Strategy (Theoretical)

### Multi-Region Strategy
- **Geo-DNS**: Users are routed to the nearest regional cluster to minimize latency.
- **Database Replication**: Use **Read Replicas** in each region for fast search operations, while keeping a **Primary Writer** (or using a globally distributed DB like CockroachDB) for consistent booking execution.

### Fault Tolerance
- **Circuit Breakers**: Prevents cascading failures when external services (e.g., Payment Gateway) are down.
- **Centralized Monitoring**: Integrating **Prometheus** for metrics and **ELK Stack** for deep log analysis.
