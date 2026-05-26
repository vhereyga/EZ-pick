/*
  # EZpick F&B E-Commerce Schema

  1. New Tables
    - `products` - F&B products catalog
      - id, name, description, price, category, image_url, badge, rating, review_count, in_stock
    - `orders` - Customer orders
      - id, user_id, total, status, created_at
    - `order_items` - Line items for each order
      - id, order_id, product_id, quantity, price_at_purchase

  2. Security
    - RLS enabled on all tables
    - Products: public read
    - Orders/order_items: authenticated users can read/insert own data
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

-- Seed products
INSERT INTO products (name, description, price, category, image_url, badge, rating, review_count) VALUES
  ('Nasi Lemak Special', 'Fragrant coconut rice with sambal, anchovies, peanuts, boiled egg & cucumber. A Malaysian classic.', 12.90, 'food', 'https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg?auto=compress&cs=tinysrgb&w=600', 'Best Seller', 4.9, 2341),
  ('Teh Tarik Gelas', 'Creamy pulled milk tea brewed with premium black tea leaves. Smooth & frothy finish.', 4.50, 'drink', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600', 'Popular', 4.8, 1823),
  ('Char Kway Teow', 'Wok-fried flat rice noodles with prawns, egg, bean sprouts, chives & dark soy sauce.', 14.90, 'food', 'https://images.pexels.com/photos/4666754/pexels-photo-4666754.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.7, 987),
  ('Mango Lassi', 'Thick, chilled yogurt drink blended with fresh Alphonso mangoes & a hint of cardamom.', 7.90, 'drink', 'https://images.pexels.com/photos/5946960/pexels-photo-5946960.jpeg?auto=compress&cs=tinysrgb&w=600', 'New', 4.6, 412),
  ('Chicken Satay (10 pcs)', 'Grilled skewered chicken marinated in lemongrass & turmeric, served with peanut sauce & ketupat.', 18.90, 'food', 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=600', 'Best Seller', 4.9, 3102),
  ('Iced Matcha Latte', 'Premium ceremonial-grade matcha whisked with oat milk over ice. Earthy, creamy & refreshing.', 9.90, 'drink', 'https://images.pexels.com/photos/8677461/pexels-photo-8677461.jpeg?auto=compress&cs=tinysrgb&w=600', 'Trending', 4.7, 765),
  ('Roti Canai + Dhal', 'Flaky, buttery flatbread served with rich lentil curry and fragrant fish curry.', 5.90, 'food', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.8, 2210),
  ('Durian Crepe Cake', '8-layer mille-crepe cake filled with pure Musang King durian cream. Indulgently rich.', 32.90, 'dessert', 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600', 'Premium', 4.9, 891),
  ('Laksa Lemak', 'Creamy coconut milk laksa with prawns, fish cake, tofu puffs & fresh cockles.', 16.90, 'food', 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600', 'Chef Pick', 4.8, 1456),
  ('Cendol Durian', 'Classic shaved ice dessert with pandan jelly, red beans, coconut milk, gula melaka & durian.', 11.90, 'dessert', 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=600', 'Seasonal', 4.7, 634),
  ('Boba Brown Sugar Milk Tea', 'House-made tiger boba pearls in caramel brown sugar syrup with fresh whole milk.', 8.90, 'drink', 'https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=600', 'Popular', 4.8, 2987),
  ('Pandan Layer Cake', 'Soft, moist pandan kaya layer cake made with fresh pandan extract & coconut kaya.', 24.90, 'dessert', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, 4.6, 320)
ON CONFLICT DO NOTHING;
