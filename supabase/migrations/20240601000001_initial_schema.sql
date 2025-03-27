-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  residence_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create ac_units table
CREATE TABLE IF NOT EXISTS ac_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  ac_type TEXT NOT NULL,
  ac_size TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  installation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  service_date DATE NOT NULL,
  service_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
  total_amount INTEGER NOT NULL,
  tax_amount INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create booking_services junction table
CREATE TABLE IF NOT EXISTS booking_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialization TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ac_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public access policies
DROP POLICY IF EXISTS "Public services are viewable by everyone" ON services;
CREATE POLICY "Public services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public testimonials are viewable by everyone" ON testimonials;
CREATE POLICY "Public testimonials are viewable by everyone"
  ON testimonials FOR SELECT
  USING (is_approved = true);

-- Admin policies
DROP POLICY IF EXISTS "Admins have full access to all tables" ON users;
CREATE POLICY "Admins have full access to all tables"
  ON users FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to all tables" ON customers;
CREATE POLICY "Admins have full access to all tables"
  ON customers FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to all tables" ON ac_units;
CREATE POLICY "Admins have full access to all tables"
  ON ac_units FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to all tables" ON services;
CREATE POLICY "Admins have full access to all tables"
  ON services FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to all tables" ON bookings;
CREATE POLICY "Admins have full access to all tables"
  ON bookings FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to all tables" ON booking_services;
CREATE POLICY "Admins have full access to all tables"
  ON booking_services FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to all tables" ON technicians;
CREATE POLICY "Admins have full access to all tables"
  ON technicians FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to all tables" ON testimonials;
CREATE POLICY "Admins have full access to all tables"
  ON testimonials FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE id = auth.uid()));

-- Insert sample data for services
INSERT INTO services (name, description, price, category) VALUES
('Cuci AC 0.5 - 2 PK', 'Pembersihan standar untuk AC ukuran kecil hingga menengah', 70000, 'cleaning'),
('Cuci AC Inverter 0.5 - 1 PK', 'Pembersihan khusus untuk AC inverter ukuran kecil', 85000, 'cleaning'),
('Cuci AC 1.5 - 2 PK', 'Pembersihan standar untuk AC ukuran menengah hingga besar', 95000, 'cleaning'),
('Cuci AC Inverter 0.5 - 2 PK', 'Pembersihan khusus untuk AC inverter berbagai ukuran', 85000, 'cleaning'),
('Cuci Besar (Perombakan)', 'Pembersihan menyeluruh dengan pembongkaran komponen', 350000, 'cleaning'),
('Tambah Freon R22 0.5 - 1 PK', 'Penambahan freon tipe R22 untuk AC ukuran kecil', 175000, 'freon'),
('Tambah Freon R22 1.5 - 2 PK', 'Penambahan freon tipe R22 untuk AC ukuran besar', 250000, 'freon'),
('Tambah Freon R32/R410 0.5 - 1 PK', 'Penambahan freon tipe R32/R410 untuk AC ukuran kecil', 185000, 'freon'),
('Tambah Freon R32/R410 1.5 - 2 PK', 'Penambahan freon tipe R32/R410 untuk AC ukuran besar', 250000, 'freon'),
('Isi Freon R22 0.5 - 1 PK', 'Pengisian penuh freon tipe R22 untuk AC ukuran kecil', 285000, 'freon'),
('Isi Freon R22 1.5 - 2 PK', 'Pengisian penuh freon tipe R22 untuk AC ukuran besar', 350000, 'freon'),
('Isi Freon R32/R410 0.5 - 1 PK', 'Pengisian penuh freon tipe R32/R410 untuk AC ukuran kecil', 285000, 'freon'),
('Isi Freon R32/R410 1.5 - 2 PK', 'Pengisian penuh freon tipe R32/R410 untuk AC ukuran besar', 400000, 'freon'),
('Bongkar 0.5 - 1 PK', 'Pembongkaran AC ukuran kecil', 150000, 'installation'),
('Pasang 0.5 - 1 PK (3-5mtr pipa)', 'Pemasangan AC ukuran kecil dengan pipa 3-5 meter', 250000, 'installation'),
('Pasang 1.5 - 2 PK (3-5mtr pipa)', 'Pemasangan AC ukuran besar dengan pipa 3-5 meter', 450000, 'installation'),
('Bongkar Pasang 0.5 - 1 PK (3-5mtr pipa)', 'Bongkar dan pasang ulang AC ukuran kecil', 350000, 'installation'),
('Bongkar Pasang 1.5 - 2 PK (3-5mtr pipa)', 'Bongkar dan pasang ulang AC ukuran besar', 550000, 'installation'),
('Tarik pipa lebih dari 5mtr, naik plafon, dan bologin flapon', 'Biaya per meter untuk penarikan pipa tambahan', 25000, 'installation'),
('Pengecekan AC', 'Diagnosa permasalahan pada AC', 75000, 'repair'),
('Bobok Tembok /m/lobang', 'Pembuatan lubang pada tembok untuk instalasi', 50000, 'repair'),
('Las Sambungan Pipa Freon /titik', 'Pengelasan sambungan pipa freon per titik', 75000, 'repair'),
('Las Perbaikan Kebocoran Pipa Freon + Isi Freon', 'Perbaikan kebocoran dan pengisian ulang freon', 600000, 'repair'),
('Pergantian Kapasitor 0.5-1 PK (Part dan Jasa)', 'Penggantian kapasitor untuk AC ukuran kecil', 255000, 'repair'),
('Pergantian Kapasitor 1.5-2 PK (Part dan Jasa)', 'Penggantian kapasitor untuk AC ukuran besar', 330000, 'repair'),
('Rusak 1 PK', 'Biaya perbaikan kerusakan AC 1 PK', 75000, 'repair'),
('Rusak 2 PK', 'Biaya perbaikan kerusakan AC 2 PK', 95000, 'repair'),
('Biaya Apartemen', 'Biaya tambahan untuk servis di apartemen', 20000, 'additional'),
('Vacuum & Flushing AC', 'Pembersihan sistem dengan vakum dan flushing', 350000, 'additional'),
('Pembilasan Evaporator', 'Pembersihan khusus untuk evaporator', 200000, 'additional'),
('Vakum', 'Proses vakum pada sistem AC', 100000, 'additional'),
('Daptip pipa', 'Pemasangan daptip pada pipa', 15000, 'additional'),
('Tip daptip', 'Biaya tambahan untuk tip daptip', 15000, 'additional');

-- Insert sample testimonials
INSERT INTO testimonials (name, role, rating, comment, is_approved) VALUES
('Budi Santoso', 'Pemilik Rumah', 5, 'Teknisi sangat profesional dan cepat. AC saya kembali dingin seperti baru. Sangat merekomendasikan jasa AC Home Jaya Teknik!', true),
('Siti Rahayu', 'Pemilik Apartemen', 5, 'Pelayanan cepat dan harga terjangkau. Teknisi datang tepat waktu dan menjelaskan masalah AC dengan detail. Puas dengan hasilnya!', true),
('Ahmad Hidayat', 'Pemilik Toko', 4, 'Sudah 3 kali menggunakan jasa AC Home dan selalu puas dengan hasilnya. Teknisi ramah dan berpengalaman.', true),
('Dewi Lestari', 'Ibu Rumah Tangga', 5, 'Sangat puas dengan layanan cuci AC. Sekarang AC jadi lebih dingin dan hemat listrik. Terima kasih AC Home!', true),
('Rudi Hartono', 'Pengusaha', 5, 'Respon cepat dan hasil memuaskan. AC yang tadinya tidak dingin sekarang sudah normal kembali. Harga juga sesuai dengan kualitas.', true);

-- Enable realtime
alter publication supabase_realtime add table services;
alter publication supabase_realtime add table bookings;
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table testimonials;
