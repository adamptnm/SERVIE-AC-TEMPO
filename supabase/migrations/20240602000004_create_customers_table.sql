-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  residence_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ac_units table if it doesn't exist
CREATE TABLE IF NOT EXISTS ac_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  ac_type TEXT NOT NULL,
  ac_size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  technician_id UUID,
  service_date DATE NOT NULL,
  service_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  tax_amount INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_services table if it doesn't exist
CREATE TABLE IF NOT EXISTS booking_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ac_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DROP POLICY IF EXISTS "Public read access" ON customers;
CREATE POLICY "Public read access"
  ON customers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON ac_units;
CREATE POLICY "Public read access"
  ON ac_units FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON bookings;
CREATE POLICY "Public read access"
  ON bookings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON booking_services;
CREATE POLICY "Public read access"
  ON booking_services FOR SELECT
  USING (true);

-- Create policies for admin access
DROP POLICY IF EXISTS "Admin full access" ON customers;
CREATE POLICY "Admin full access"
  ON customers FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access" ON ac_units;
CREATE POLICY "Admin full access"
  ON ac_units FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access" ON bookings;
CREATE POLICY "Admin full access"
  ON bookings FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access" ON booking_services;
CREATE POLICY "Admin full access"
  ON booking_services FOR ALL
  USING (auth.role() = 'authenticated');

-- Enable realtime
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table ac_units;
alter publication supabase_realtime add table bookings;
alter publication supabase_realtime add table booking_services;

-- Insert sample data if tables are empty
INSERT INTO customers (name, phone, email, address, residence_type)
SELECT 'Budi Santoso', '0812-3456-7890', 'budi@example.com', 'Jl. Sudirman No. 123, Jakarta Pusat', 'house'
WHERE NOT EXISTS (SELECT 1 FROM customers LIMIT 1);

DO $$
DECLARE
  customer_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ac_units LIMIT 1) THEN
    SELECT id INTO customer_id FROM customers LIMIT 1;
    
    IF customer_id IS NOT NULL THEN
      INSERT INTO ac_units (customer_id, ac_type, ac_size)
      VALUES (customer_id, 'Daikin', '1.5 PK');
      
      INSERT INTO bookings (customer_id, service_date, service_time, status, total_amount, tax_amount, notes)
      VALUES (customer_id, '2023-10-15', '10:00', 'completed', 750000, 75000, 'AC tidak dingin');
    END IF;
  END IF;
END
$$;
