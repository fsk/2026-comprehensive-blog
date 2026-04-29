CREATE TABLE availability_slots (
    id UUID PRIMARY KEY,
    version BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true NOT NULL,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT false NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
    CONSTRAINT chk_slot_time_range CHECK (end_at > start_at),
    CONSTRAINT uq_slot_time UNIQUE (start_at, end_at)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    version BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true NOT NULL,
    availability_slot_id UUID NOT NULL UNIQUE REFERENCES availability_slots(id) ON DELETE RESTRICT,
    client_name VARCHAR(120) NOT NULL,
    client_email VARCHAR(180) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_reference VARCHAR(255),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'TRY'
);

CREATE INDEX idx_availability_slots_start_at ON availability_slots(start_at);
CREATE INDEX idx_availability_slots_active_booked ON availability_slots(is_active, is_booked);
CREATE INDEX idx_bookings_status ON bookings(status);
