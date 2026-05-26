/*
  # Add Order Tracking Features

  1. Modified Tables
    - `orders` - Add delivery_location column for shipping address
      - delivery_location (text) - Customer's delivery address

  2. Security
    - RLS already enabled
    - Existing policies still valid
*/

-- Add delivery_location column to orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_location'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_location text DEFAULT '';
  END IF;
END $$;
