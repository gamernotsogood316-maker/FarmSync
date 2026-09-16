export const GOOGLE_MAPS_API_KEY = 'AIzaSyBs7SpvRmEGm1BwpO8lMOnTsbsQam7yAuk';

// Key coordinates across agricultural hubs
export const AGRO_COORDINATES = {
  niphadFarm: { lat: 20.0889, lng: 74.1105, name: 'Patil Farms, Sukene, Niphad (Nashik)' },
  lasalgaonMandi: { lat: 20.1469, lng: 74.2285, name: 'Lasalgaon APMC Onion Market' },
  vashiApmc: { lat: 19.076, lng: 73.0084, name: 'Vashi APMC Market Yard, Navi Mumbai' },
  puneMarketYard: { lat: 18.4907, lng: 73.8647, name: 'Shree Chhatrapati Shivaji Market Yard, Pune' },
  suratMandi: { lat: 21.1702, lng: 72.8311, name: 'Surat APMC Mandi, Gujarat' },
  azadpurDelhi: { lat: 28.7161, lng: 77.1734, name: 'Azadpur Mandi, Delhi' },
};

// Route waypoints from Niphad (Nashik) to Vashi APMC (Navi Mumbai) along NH160 / Mumbai-Agra Highway
export const ROUTE_NIPHAD_TO_VASHI = [
  { lat: 20.0889, lng: 74.1105, title: 'Farm Gate (Sukene, Niphad)' },
  { lat: 20.0384, lng: 74.0201, title: 'Nashik-Lasalgaon Highway Toll' },
  { lat: 19.9975, lng: 73.7898, title: 'Nashik City Bypass (Dwarka Circle)' },
  { lat: 19.7892, lng: 73.5412, title: 'Igatpuri Ghat Entry' },
  { lat: 19.6841, lng: 73.4812, title: 'Kasara Ghat Summit Checkpoint' },
  { lat: 19.5241, lng: 73.3421, title: 'Asangaon Agro Toll' },
  { lat: 19.3821, lng: 73.1842, title: 'Kalyan-Bhiwandi Bypass' },
  { lat: 19.2183, lng: 73.0867, title: 'Thane Majiwada Flyover' },
  { lat: 19.1023, lng: 73.0245, title: 'Turbhe Naka' },
  { lat: 19.076, lng: 73.0084, title: 'Vashi APMC Grain & Onion Yard' },
];
