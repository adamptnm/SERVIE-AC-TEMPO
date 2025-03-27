-- Create services table if it doesn't exist
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
DROP POLICY IF EXISTS "Public read access" ON services;
CREATE POLICY "Public read access"
  ON services FOR SELECT
  USING (true);

-- Create policy for admin access
DROP POLICY IF EXISTS "Admin full access" ON services;
CREATE POLICY "Admin full access"
  ON services FOR ALL
  USING (auth.role() = 'authenticated');

-- Enable realtime
alter publication supabase_realtime add table services;

-- Insert sample data if table is empty
INSERT INTO services (name, description, price, category)
SELECT 'Cuci AC 0.5 - 2 PK', 'Pembersihan standar untuk AC ukuran kecil hingga menengah', 70000, 'cleaning'
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

INSERT INTO services (name, description, price, category)
SELECT 'Cuci AC Inverter 0.5 - 1 PK', 'Pembersihan khusus untuk AC inverter ukuran kecil', 85000, 'cleaning'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Cuci AC Inverter 0.5 - 1 PK');

INSERT INTO services (name, description, price, category)
SELECT 'Tambah Freon R22 0.5 - 1 PK', 'Penambahan freon tipe R22 untuk AC ukuran kecil', 175000, 'freon'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Tambah Freon R22 0.5 - 1 PK');

INSERT INTO services (name, description, price, category)
SELECT 'Bongkar 0.5 - 1 PK', 'Pembongkaran AC ukuran kecil', 150000, 'installation'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Bongkar 0.5 - 1 PK');

INSERT INTO services (name, description, price, category)
SELECT 'Pengecekan AC', 'Diagnosa permasalahan pada AC', 75000, 'repair'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Pengecekan AC');

INSERT INTO services (name, description, price, category)
SELECT 'Biaya Apartemen', 'Biaya tambahan untuk servis di apartemen', 20000, 'additional'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Biaya Apartemen');
