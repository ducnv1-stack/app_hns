-- Add tables for service-type specific details

-- Flight details
CREATE TABLE IF NOT EXISTS service_details_flight (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    airline VARCHAR(100),
    flight_number VARCHAR(50),
    departure_airport VARCHAR(100),
    arrival_airport VARCHAR(100),
    departure_time TIME,
    arrival_time TIME,
    aircraft_type VARCHAR(100),
    baggage_allowance VARCHAR(100),
    seat_class VARCHAR(50), -- Economy, Business, First Class
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id)
);

-- Hotel details
CREATE TABLE IF NOT EXISTS service_details_hotel (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    hotel_name VARCHAR(255),
    hotel_address TEXT,
    star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
    room_type VARCHAR(100),
    bed_type VARCHAR(100),
    room_size DECIMAL(10,2), -- in square meters
    max_occupancy INTEGER,
    amenities JSONB, -- ["wifi", "pool", "gym", "breakfast", etc.]
    check_in_time TIME,
    check_out_time TIME,
    cancellation_policy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id)
);

-- Combo details (combines tour + hotel + flight)
CREATE TABLE IF NOT EXISTS service_details_combo (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    includes_tour BOOLEAN DEFAULT false,
    includes_hotel BOOLEAN DEFAULT false,
    includes_flight BOOLEAN DEFAULT false,
    tour_service_id INTEGER REFERENCES services(id),
    hotel_service_id INTEGER REFERENCES services(id),
    flight_service_id INTEGER REFERENCES services(id),
    combo_description TEXT,
    special_offers TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_flight_service ON service_details_flight(service_id);
CREATE INDEX IF NOT EXISTS idx_hotel_service ON service_details_hotel(service_id);
CREATE INDEX IF NOT EXISTS idx_combo_service ON service_details_combo(service_id);

-- Add comments
COMMENT ON TABLE service_details_flight IS 'Flight-specific details for flight services';
COMMENT ON TABLE service_details_hotel IS 'Hotel-specific details for hotel services';
COMMENT ON TABLE service_details_combo IS 'Combo-specific details linking multiple services';
