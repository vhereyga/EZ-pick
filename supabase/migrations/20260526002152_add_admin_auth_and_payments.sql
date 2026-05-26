/*
  # Add Admin Auth, Payments, and Update Products to Indonesian

  1. New Tables
    - `admin_users` - Admin user profiles
      - id, user_id (refs auth.users), role, created_at
    - `payments` - Payment records for orders
      - id, order_id, method, amount, status, created_at

  2. Modified Tables
    - Update products with Indonesian names/descriptions and Rupiah prices
    - Add admin policies for full product management

  3. Security
    - RLS on admin_users and payments
    - Admin can CRUD all products
*/

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;

CREATE POLICY "Admins can read admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can insert own admin record" ON admin_users;

CREATE POLICY "Admins can insert own admin record"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  method text NOT NULL DEFAULT 'cash',
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_proof_url text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own payments" ON payments;

CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own payments" ON payments;

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admin policies for products
DROP POLICY IF EXISTS "Admins can insert products" ON products;

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update products" ON products;

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admin policies for orders
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;

CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Update products with Indonesian content and Rupiah prices
UPDATE products SET
  name = 'Nasi Goreng Spesial',
  description = 'Nasi goreng dengan telur, ayam, udang, sayuran segar, dan kerupuk. Dihidangkan dengan acar dan sambal.',
  price = 25000,
  badge = 'Terlaris'
WHERE name = 'Nasi Lemak Special';

UPDATE products SET
  name = 'Es Teh Manis',
  description = 'Teh manis dingin yang menyegarkan, dibuat dari teh pilihan dan gula aren.',
  price = 8000,
  badge = 'Populer'
WHERE name = 'Teh Tarik Gelas';

UPDATE products SET
  name = 'Mie Goreng Seafood',
  description = 'Mie goreng dengan udang, cumi, telur, sawi, dan taoge. Rasanya gurih dan lezat.',
  price = 28000
WHERE name = 'Char Kway Teow';

UPDATE products SET
  name = 'Jus Alpukat',
  description = 'Jus alpukat kental dengan susu kental manis dan cokelat. Creamy dan menyegarkan.',
  price = 15000,
  badge = 'Baru'
WHERE name = 'Mango Lassi';

UPDATE products SET
  name = 'Sate Ayam (10 tusuk)',
  description = 'Sate ayam bakar dengan bumbu kacang, lontong, dan acar. Daging empuk dan bumbu gurih.',
  price = 35000,
  badge = 'Terlaris'
WHERE name = 'Chicken Satay (10 pcs)';

UPDATE products SET
  name = 'Es Kopi Susu',
  description = 'Kopi robusta pilihan dicampur susu segar dan gula aren. Nikmati dingin dengan es.',
  price = 18000,
  badge = 'Trending'
WHERE name = 'Iced Matcha Latte';

UPDATE products SET
  name = 'Roti Bakar Cokelat',
  description = 'Roti bakar isi cokelat dan keju, dengan margarin dan susu kental manis.',
  price = 12000
WHERE name = 'Roti Canai + Dhal';

UPDATE products SET
  name = 'Kue Lapis Legit',
  description = 'Kue lapis legit premium dengan lapisan cokelat dan keju. Tekstur lembut dan wangi.',
  price = 65000,
  badge = 'Premium'
WHERE name = 'Durian Crepe Cake';

UPDATE products SET
  name = 'Ayam Geprek Sambal Matah',
  description = 'Ayam goreng krispi dengan sambal matah segar. Dihidangkan dengan nasi dan lalapan.',
  price = 32000,
  badge = 'Rekomendasi Koki'
WHERE name = 'Laksa Lemak';

UPDATE products SET
  name = 'Es Cendol Durian',
  description = 'Es cendol dengan santan, gula merah, dan durian segar. Segar dan lezat.',
  price = 22000,
  badge = 'Musiman'
WHERE name = 'Cendol Durian';

UPDATE products SET
  name = 'Brown Sugar Boba Milk',
  description = 'Susu segar dengan boba pearl brown sugar homemade. Manis dan kenyal.',
  price = 18000,
  badge = 'Populer'
WHERE name = 'Boba Brown Sugar Milk Tea';

UPDATE products SET
  name = 'Pisang Goreng Keju',
  description = 'Pisang goreng crispy dengan topping keju dan susu kental manis.',
  price = 12000
WHERE name = 'Pandan Layer Cake';

-- Add more Indonesian products
INSERT INTO products (name, description, price, category, image_url, badge, rating, review_count) VALUES
  ('Bakso Malang', 'Bakso daging sapi kenyal dengan tahu, siomay, dan mie. Kuah kaldu sapi gurih.', 22000, 'food', 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600', 'Populer', 4.8, 1876),
  ('Es Jeruk Peras', 'Jeruk peras segar dengan es batu. Menyegarkan dan kaya vitamin C.', 10000, 'drink', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.5, 892),
  ('Martabak Manis', 'Martabak manis dengan topping cokelat, keju, kacang, dan susu.', 28000, 'dessert', 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600', 'Favorit', 4.9, 2156)
ON CONFLICT DO NOTHING;
