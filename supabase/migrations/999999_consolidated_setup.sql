-- Consolidated Setup for TerraSight
-- Run this script in the Supabase SQL Editor to set up the entire database.

-- 1. Enable PostGIS Extension (Essential for Spatial Queries)
create extension if not exists postgis;

-- 2. Create the Protected Zones Table
create table if not exists public.protected_zones (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    law text not null,
    article text,
    section text not null,
    severity text check (severity in ('CRITICAL', 'HIGH', 'INFO')),
    zone_type text default 'Restricted',
    geometry geometry(Polygon, 4326) not null, -- Stores the shape in WGS84 (Lat/Lon)
    created_at timestamptz default now()
);

-- Create a Spatial Index (The R-Tree) for lightning-fast queries
create index if not exists protected_zones_geo_idx on public.protected_zones using gist (geometry);

-- 3. Create Detections Table
CREATE TABLE IF NOT EXISTS detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  coords JSONB NOT NULL,
  violation_type TEXT,
  law_section TEXT,
  severity TEXT,
  status TEXT DEFAULT 'PENDING',
  blockchain_hash TEXT
);

-- Enable RLS
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access (since this is a demo/mock)
DO $$ BEGIN
  CREATE POLICY "Allow all access" ON detections FOR ALL USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enable Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE detections;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Add Image URL Column
ALTER TABLE detections 
ADD COLUMN IF NOT EXISTS img_url TEXT;

COMMENT ON COLUMN detections.img_url IS 'URL to the satellite evidence image for the violation';

-- 5. Optimize Detections (Enums & Geometry)
DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM ('INFO', 'WARNING', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE detection_status AS ENUM ('PENDING', 'VERIFIED', 'IGNORED', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add PostGIS Geometry Column to detections
ALTER TABLE detections 
ADD COLUMN IF NOT EXISTS location GEOMETRY(POINT, 4326);

-- Migrate existing JSON coords to Geometry (safe update)
UPDATE detections 
SET location = ST_SetSRID(ST_MakePoint((coords->>'lng')::float, (coords->>'lat')::float), 4326)
WHERE location IS NULL AND coords IS NOT NULL;

-- Add Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_detections_location ON detections USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_detections_status ON detections (status);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON detections (created_at DESC);
