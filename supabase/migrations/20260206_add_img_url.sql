-- Add img_url column to detections table if it doesn't exist
ALTER TABLE detections 
ADD COLUMN IF NOT EXISTS img_url TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN detections.img_url IS 'URL to the satellite evidence image for the violation';
