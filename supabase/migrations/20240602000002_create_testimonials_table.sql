-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
DROP POLICY IF EXISTS "Public read access" ON testimonials;
CREATE POLICY "Public read access"
  ON testimonials FOR SELECT
  USING (is_approved = true);

-- Create policy for admin access
DROP POLICY IF EXISTS "Admin full access" ON testimonials;
CREATE POLICY "Admin full access"
  ON testimonials FOR ALL
  USING (auth.role() = 'authenticated');

-- Enable realtime
alter publication supabase_realtime add table testimonials;

-- Insert sample data if table is empty
INSERT INTO testimonials (name, role, rating, comment, is_approved)
SELECT 'Budi Santoso', 'Pemilik Rumah', 5, 'Teknisi sangat profesional dan cepat. AC saya kembali dingin seperti baru. Sangat merekomendasikan jasa AC Home Jaya Teknik!', true
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);

INSERT INTO testimonials (name, role, rating, comment, is_approved)
SELECT 'Siti Rahayu', 'Pemilik Apartemen', 5, 'Pelayanan cepat dan harga terjangkau. Teknisi datang tepat waktu dan menjelaskan masalah AC dengan detail. Puas dengan hasilnya!', true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Siti Rahayu');

INSERT INTO testimonials (name, role, rating, comment, is_approved)
SELECT 'Ahmad Hidayat', 'Pemilik Toko', 4, 'Sudah 3 kali menggunakan jasa AC Home dan selalu puas dengan hasilnya. Teknisi ramah dan berpengalaman.', true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Ahmad Hidayat');

INSERT INTO testimonials (name, role, rating, comment, is_approved)
SELECT 'Dewi Lestari', 'Ibu Rumah Tangga', 5, 'Sangat puas dengan layanan cuci AC. Sekarang AC jadi lebih dingin dan hemat listrik. Terima kasih AC Home!', true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Dewi Lestari');

INSERT INTO testimonials (name, role, rating, comment, is_approved)
SELECT 'Rudi Hartono', 'Pengusaha', 5, 'Respon cepat dan hasil memuaskan. AC yang tadinya tidak dingin sekarang sudah normal kembali. Harga juga sesuai dengan kualitas.', true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Rudi Hartono');
