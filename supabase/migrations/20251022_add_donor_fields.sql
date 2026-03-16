-- Migration: Add additional fields to donors table
-- This migration adds fields needed for the Blood-O donation tracking system

-- Add total_donations column to track donation count
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS total_donations INTEGER DEFAULT 0;

-- Add profile_photo_url column for profile pictures
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Add weight column for donor health tracking
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS weight NUMERIC;

-- Add is_available column (or rename if available_to_donate exists)
-- Note: You may need to manually rename available_to_donate to is_available if it exists
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;

-- Set default value for existing records
UPDATE donors 
SET total_donations = COALESCE(total_donations, 0)
WHERE total_donations IS NULL;

-- Add helpful comments for documentation
COMMENT ON COLUMN donors.total_donations IS 'Total number of successful blood donations made by this donor';
COMMENT ON COLUMN donors.profile_photo_url IS 'URL to the donor profile photo stored in Supabase Storage';
COMMENT ON COLUMN donors.weight IS 'Donor weight in kilograms';
COMMENT ON COLUMN donors.is_available IS 'Whether the donor is currently available to donate blood';
