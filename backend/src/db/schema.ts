export const initDb = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    total_inventory INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS room_availability (
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_count INTEGER NOT NULL,
    PRIMARY KEY (room_id, date)
);

CREATE INDEX IF NOT EXISTS idx_rooms_location ON rooms(location);
CREATE INDEX IF NOT EXISTS idx_room_availability_date ON room_availability(date);
`;

export const seedData = `
INSERT INTO rooms (name, description, price_per_night, location, total_inventory)
VALUES 
('Deluxe Ocean View', 'A beautiful room with ocean view', 250.00, 'Maldives', 5),
('Mountain Cabin', 'Cozy cabin in the mountains', 150.00, 'Swiss Alps', 3),
('City Studio', 'Modern studio in the heart of NYC', 300.00, 'New York', 10)
ON CONFLICT DO NOTHING;

-- This is a simplification. Usually availability is pre-populated for a year.
INSERT INTO room_availability (room_id, date, available_count)
SELECT id, current_date + i, total_inventory
FROM rooms, generate_series(0, 30) i
ON CONFLICT DO NOTHING;
`;
