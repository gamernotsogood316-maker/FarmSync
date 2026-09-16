// Live Geolocation and Distance Engine for FarmSync

export interface UserCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number | null;
  speed?: number | null;
  timestamp?: number;
}

export interface MandiDestination {
  id: string;
  name: string;
  state: string;
  coords: { lat: number; lng: number };
  address: string;
  distanceKm: number;
  estimatedHours: number;
}

export const MAJOR_APMC_MANDIS = [
  {
    id: 'lasalgaon',
    name: 'Lasalgaon APMC Onion Market',
    state: 'Maharashtra',
    coords: { lat: 20.1472, lng: 74.2256 },
    address: 'Main Yard, Lasalgaon, Niphad Taluka, Nashik, Maharashtra',
  },
  {
    id: 'vashi',
    name: 'Vashi APMC Central Market',
    state: 'Maharashtra',
    coords: { lat: 19.076, lng: 73.008 },
    address: 'APMC Market Complex, Sector 19, Vashi, Navi Mumbai, Maharashtra',
  },
  {
    id: 'pune',
    name: 'Pune Market Yard (Gultekdi)',
    state: 'Maharashtra',
    coords: { lat: 18.4878, lng: 73.8643 },
    address: 'APMC Gultekdi Market Yard, Pune, Maharashtra',
  },
  {
    id: 'surat',
    name: 'Surat APMC Mandi',
    state: 'Gujarat',
    coords: { lat: 21.1702, lng: 72.8311 },
    address: 'APMC Sahara Darwaja, Ring Road, Surat, Gujarat',
  },
  {
    id: 'yeshwanthpur',
    name: 'Yeshwanthpur APMC Sub-Yard (Bengaluru)',
    state: 'Karnataka',
    coords: { lat: 13.0238, lng: 77.5529 },
    address: 'APMC Yard, Yeshwanthpur, Bengaluru, Karnataka 560022',
  },
  {
    id: 'kolar',
    name: 'Kolar APMC Tomato Yard',
    state: 'Karnataka',
    coords: { lat: 13.1367, lng: 78.1348 },
    address: 'APMC Mega Market, Bangarapet Road, Kolar, Karnataka',
  },
  {
    id: 'azadpur',
    name: 'Azadpur Mandi (Asia Largest Fruit & Veg)',
    state: 'Delhi NCR',
    coords: { lat: 28.7154, lng: 77.1784 },
    address: 'New Subzi Mandi, Azadpur, Delhi 110033',
  },
  {
    id: 'khanna',
    name: 'Khanna Grain Market (Asia Largest Grain Yard)',
    state: 'Punjab',
    coords: { lat: 30.7046, lng: 76.222 },
    address: 'Grand Trunk Road, Khanna, Ludhiana District, Punjab',
  },
];

// Haversine Distance in Kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Estimate Truck Driving Hours (~42 km/h average rural highway speed + 15 min buffer)
export function calculateTruckTravelHours(distanceKm: number): number {
  const hours = distanceKm / 42 + 0.25;
  return Math.round(hours * 10) / 10;
}

// Request Live Device GPS Position
export function getLiveDevicePosition(): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser or device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let errorMsg = 'Failed to acquire live GPS location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission was denied. Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is currently unavailable from your device.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please try again with GPS enabled.';
            break;
        }
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 5000,
      }
    );
  });
}

// Reverse Geocode using reverse lookup with fallback
export async function reverseGeocodeLiveCoords(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(', ');
        // Return concise 3-part address
        return parts.slice(0, 3).join(', ');
      }
    }
  } catch {
    // Fallback to formatted coordinate representation
  }
  return `Live GPS Farm (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
}

// Get Nearest Mandis sorted by Distance from Coordinates
export function getMandisRankedByDistance(coords: { lat: number; lng: number }): MandiDestination[] {
  return MAJOR_APMC_MANDIS.map((mandi) => {
    const dist = calculateDistanceKm(coords.lat, coords.lng, mandi.coords.lat, mandi.coords.lng);
    const hrs = calculateTruckTravelHours(dist);
    return {
      ...mandi,
      distanceKm: dist,
      estimatedHours: hrs,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}
