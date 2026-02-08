/**
 * Google Maps Static API Integration
 * Used for generating high-quality satellite images for PDF reports
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Generate Google Maps Static API URL for satellite imagery
 * @param lat Latitude
 * @param lng Longitude
 * @param zoom Zoom level (1-21, default 18 for detailed view)
 * @param size Image size WxH (max 640x640 for free tier)
 * @returns Static map image URL
 */
export const getGoogleMapsSatelliteUrl = (
    lat: number,
    lng: number,
    zoom: number = 18,
    size: string = '640x640'
): string => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.includes('YOUR_')) {
        console.warn('[GoogleMaps] No API key configured. Using placeholder.');
        return `https://via.placeholder.com/640x480/2d5016/ffffff?text=Satellite+Image+at+${lat.toFixed(4)},${lng.toFixed(4)}`;
    }

    const params = new URLSearchParams({
        center: `${lat},${lng}`,
        zoom: zoom.toString(),
        size: size,
        maptype: 'satellite',
        key: GOOGLE_MAPS_API_KEY
    });

    return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};

/**
 * Fetch Google Maps satellite image as a blob for embedding in PDFs
 * @param lat Latitude
 * @param lng Longitude
 * @param zoom Zoom level (default 18)
 * @returns Image blob or null if failed
 */
export const fetchGoogleMapsSatelliteImage = async (
    lat: number,
    lng: number,
    zoom: number = 18
): Promise<Blob | null> => {
    try {
        const url = getGoogleMapsSatelliteUrl(lat, lng, zoom);
        console.log(`[GoogleMaps] Fetching satellite image for ${lat}, ${lng}...`);

        // Add timeout to prevent blocking PDF generation
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`[GoogleMaps] Failed to fetch image: ${response.status}`);
            return null;
        }

        const blob = await response.blob();
        console.log(`[GoogleMaps] Successfully fetched image (${blob.size} bytes)`);
        return blob;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn('[GoogleMaps] Image fetch timeout - skipping image');
        } else {
            console.error('[GoogleMaps] Error fetching satellite image:', error);
        }
        return null;
    }
};

/**
 * Convert Google Maps image blob to ArrayBuffer for pdf-lib
 * @param lat Latitude
 * @param lng Longitude
 * @param zoom Zoom level (default 18)
 * @returns ArrayBuffer or null
 */
export const getGoogleMapsImageArrayBuffer = async (
    lat: number,
    lng: number,
    zoom: number = 18
): Promise<ArrayBuffer | null> => {
    const blob = await fetchGoogleMapsSatelliteImage(lat, lng, zoom);
    if (!blob) return null;

    return await blob.arrayBuffer();
};
