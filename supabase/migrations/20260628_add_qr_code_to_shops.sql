-- Add qr_code column to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS qr_code TEXT UNIQUE;

-- Backfill existing shops that don't have a qr_code yet
UPDATE shops
SET qr_code = 'venduup://shop/' || id::TEXT
WHERE qr_code IS NULL;
