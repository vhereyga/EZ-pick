/*
  # EZpick F&B E-Commerce Schema (Indonesian)

  1. New Tables
    - `products` - Catalog produk F&B
      - id, name, description, price, category, image_url, badge, rating, review_count, in_stock
    - `orders` - Pesanan pelanggan
      - id, user_id, total, status, delivery_location, created_at
    - `order_items` - Item pesanan
      - id, order_id, product_id, quantity, price_at_purchase
    - `admin_users` - User admin
      - id, user_id, role, created_at
    - `payments` - Pembayaran
      - id, order_id, method, amount, status, created_at

  2. Security
    - RLS enabled on all tables
    - Products: public read, admin can manage
    - Orders: users can read/insert own data, admin can manage all
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'food',
  image_url text NOT NULL DEFAULT '',
  badge text DEFAULT NULL,
  rating numeric(3,1) NOT NULL DEFAULT 4.5,
  review_count integer NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read products" ON products;

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  delivery_location text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own orders" ON orders;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON orders;

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_at_purchase numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own order items" ON order_items;

CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

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

-- Admin policies for order_items
DROP POLICY IF EXISTS "Admins can read all order items" ON order_items;

CREATE POLICY "Admins can read all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update all order items" ON order_items;

CREATE POLICY "Admins can update all order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Seed products (Indonesian content, Rupiah prices)
INSERT INTO products (name, description, price, category, image_url, badge, rating, review_count) VALUES
  ('Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, udang, sayuran segar, dan kerupuk. Dihidangkan dengan acar dan sambal.', 25000, 'food', 'https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg?auto=compress&cs=tinysrgb&w=600', 'Terlaris', 4.9, 2341),
  ('Es Teh Manis', 'Teh manis dingin yang menyegarkan, dibuat dari teh pilihan dan gula aren.', 8000, 'drink', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600', 'Populer', 4.8, 1823),
  ('Mie Goreng Seafood', 'Mie goreng dengan udang, cumi, telur, sawi, dan taoge. Rasanya gurih dan lezat.', 28000, 'food', 'https://images.pexels.com/photos/4666754/pexels-photo-4666754.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.7, 987),
  ('Jus Alpukat', 'Jus alpukat kental dengan susu kental manis dan cokelat. Creamy dan menyegarkan.', 15000, 'drink', 'https://images.pexels.com/photos/5946960/pexels-photo-5946960.jpeg?auto=compress&cs=tinysrgb&w=600', 'Baru', 4.6, 412),
  ('Sate Ayam (10 tusuk)', 'Sate ayam bakar dengan bumbu kacang, lontong, dan acar. Daging empuk dan bumbu gurih.', 35000, 'food', 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=600', 'Terlaris', 4.9, 3102),
  ('Es Kopi Susu', 'Kopi robusta pilihan dicampur susu segar dan gula aren. Nikmati dingin dengan es.', 18000, 'drink', 'https://images.pexels.com/photos/8677461/pexels-photo-8677461.jpeg?auto=compress&cs=tinysrgb&w=600', 'Trending', 4.7, 765),
  ('Roti Bakar Cokelat', 'Roti bakar isi cokelat dan keju, dengan margarin dan susu kental manis.', 12000, 'food', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.8, 2210),
  ('Kue Lapis Legit', 'Kue lapis legit premium dengan lapisan cokelat dan keju. Tekstur lembut dan wangi.', 65000, 'dessert', 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600', 'Premium', 4.9, 891),
  ('Ayam Geprek Sambal Matah', 'Ayam goreng krispi dengan sambal matah segar. Dihidangkan dengan nasi dan lalapan.', 32000, 'food', 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600', 'Rekomendasi Koki', 4.8, 1456),
  ('Es Cendol Durian', 'Es cendol dengan santan, gula merah, dan durian segar. Segar dan lezat.', 22000, 'dessert', 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=600', 'Musiman', 4.7, 634),
  ('Brown Sugar Boba Milk', 'Susu segar dengan boba pearl brown sugar homemade. Manis dan kenyal.', 18000, 'drink', 'https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=600', 'Populer', 4.8, 2987),
  ('Pisang Goreng Keju', 'Pisang goreng crispy dengan topping keju dan susu kental manis.', 12000, 'dessert', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.6, 320),
  ('Bakso Malang', 'Bakso daging sapi kenyal dengan tahu, siomay, dan mie. Kuah kaldu sapi gurih.', 22000, 'food', 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600', 'Populer', 4.8, 1876),
  ('Es Jeruk Peras', 'Jeruk peras segar dengan es batu. Menyegarkan dan kaya vitamin C.', 10000, 'drink', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.5, 892),
  ('Martabak Manis', 'Martabak manis dengan topping cokelat, keju, kacang, dan susu.', 28000, 'dessert', 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600', 'Favorit', 4.9, 2156)
ON CONFLICT DO NOTHING;
