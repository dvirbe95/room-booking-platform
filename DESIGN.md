# Room Booking Platform - System Design

## 1. High-Level Architecture
The system follows a microservices-inspired architecture designed for horizontal scalability and high availability.

### Components:
- **Frontend (UI Service)**: A React/TypeScript SPA. In production, this is served from a CDN (Cloudfront) with S3 as the origin for low-latency delivery.
- **Backend (API Service)**: A Node.js/TypeScript service using Express. It handles core business logic, authentication, and orchestrates database operations.
- **Database (PostgreSQL)**: The source of truth. We use PostgreSQL for its robust ACID compliance, which is critical for handling bookings and preventing double-booking.
- **Cache (Redis)**:
    - **Session/Rate Limiting**: Stores JWT blacklists or rate-limiting counters.
    - **Search Cache**: Caches popular search results to reduce DB load.
- **Load Balancer**: Nginx or AWS ALB to distribute traffic across multiple backend instances.
- **Multi-region Deployment**:
    - **Global Traffic Manager**: Routes users to the nearest regional deployment (US-East, EU-West, etc.).
    - **Database Replication**: Cross-region read replicas for search. Primary database for writes (bookings) handles global consistency, or use a distributed DB like CockroachDB for global write-heavy workloads.

---

## 2. API Design
All endpoints follow RESTful principles and return JSON.

### Endpoints:
- `POST /api/v1/auth/register`:
    - Body: `{ email, password, name }`
    - Response: `{ id, email, token }`
- `POST /api/v1/auth/login`:
    - Body: `{ email, password }`
    - Response: `{ token }`
- `GET /api/v1/rooms`:
    - Query: `?location=X&checkIn=Y&checkOut=Z&capacity=N`
    - Response: `[{ id, name, price, availableCount }]`
- `POST /api/v1/bookings`:
    - Headers: `Authorization: Bearer <JWT>`
    - Body: `{ roomId, checkIn, checkOut }`
    - Response: `{ bookingId, status: 'confirmed' }`

### Rate Limiting:
- **Strategy**: Token Bucket algorithm implemented in Redis middleware.
- **Thresholds**: 
    - Auth: 5 requests/min per IP.
    - Search: 100 requests/min per IP.
    - Booking: 10 requests/min per User.

---

## 3. Database Schema

### `users`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, DEFAULT uuid_generate_v4() |
| email | VARCHAR | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### `rooms`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR | NOT NULL |
| description | TEXT | |
| price_per_night | DECIMAL | NOT NULL |
| location | VARCHAR | INDEXED |
| total_inventory | INTEGER | Total units of this room type |

### `bookings`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK -> users.id |
| room_id | UUID | FK -> rooms.id |
| check_in | DATE | NOT NULL |
| check_out | DATE | NOT NULL |
| status | ENUM | 'confirmed', 'cancelled' |
| created_at | TIMESTAMP | DEFAULT NOW() |

### `room_availability` (Pre-calculated for performance)
| Column | Type | Constraints |
|---|---|---|
| room_id | UUID | FK -> rooms.id |
| date | DATE | NOT NULL |
| available_count | INTEGER | Units left for this specific day |
- **Index**: Unique constraint on `(room_id, date)`.

---

## 4. Concurrency Handling
To ensure a room isn't double-booked during high-concurrency (e.g., flash sales):

1. **Atomic Inventory Update**:
   ```sql
   UPDATE room_availability 
   SET available_count = available_count - 1 
   WHERE room_id = $1 
     AND date BETWEEN $2 AND $3 
     AND available_count > 0;
   ```
   If the affected row count equals the number of days in the range, the booking is successful.
2. **Database Transactions**: Wrap the booking creation and inventory update in a single transaction with `SERIALIZABLE` or `READ COMMITTED` isolation level using `FOR UPDATE` locks.
3. **Optimistic Locking**: Use a `version` column in the availability table if conflicts are expected to be rare.

---

## 5. Scalability Strategies
- **Caching**: Redis caches the `GET /rooms` results for a short duration (e.g., 60 seconds).
- **Read/Write Splitting**: Route search queries to read replicas and booking requests to the primary DB.
- **Horizontal Scaling**: Use Kubernetes to autoscale backend pods based on incoming request metrics.

---

## 6. Implementation Flow (From Scratch)

1. **Environment Setup**: Initialize Node.js project with TypeScript, Express, and PG client.
2. **Database Migration**: Create the tables and initial seed data for rooms.
3. **Authentication Layer**: Implement JWT-based auth with bcrypt for password hashing.
4. **Search Logic**: 
   - Calculate availability by checking `room_availability` table or by subtracting active bookings from `total_inventory`.
5. **Booking Logic**:
   - Start DB Transaction.
   - Lock availability rows for the requested dates.
   - Check if `available_count > 0`.
   - If yes: Create booking record, decrement availability, commit.
   - If no: Rollback and return error.
6. **Error Handling**: Implement global error middleware for consistent API responses.
