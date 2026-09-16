import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TransportTrip, TruckVehicleOption } from '../types';

export const TRUCK_VEHICLE_OPTIONS: TruckVehicleOption[] = [
  {
    id: 'tata-ace',
    name: 'Tata Ace (Chota Hathi)',
    tagline: 'Ideal for local mandi runs, 20-30 bags',
    hindiName: 'छोटा हाथी (1.5 टन)',
    capacityTon: 1.5,
    quintalCapacity: 15,
    baseFare: 1200,
    ratePerKm: 22,
    etaMins: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqG6h3_eH3z3iY9-tT5H1mP22n3m5rV7C12f3k9k3v6Y3h2N0=w400',
    popularFor: 'Fresh leafy greens, tomatoes, small lots',
    isAvailable: true,
  },
  {
    id: 'pickup-bolero',
    name: 'Bolero Maxi Truck Plus',
    tagline: 'Rugged rural dirt track champion',
    hindiName: 'बोलेरो पिकअप (2.5 टन)',
    capacityTon: 2.5,
    quintalCapacity: 25,
    baseFare: 1800,
    ratePerKm: 28,
    etaMins: 18,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqG6h3_eH3z3iY9-tT5H1mP22n3m5rV7C12f3k9k3v6Y3h2N1=w400',
    popularFor: 'Farm gate mud road pickup, 50 bags',
    isAvailable: true,
  },
  {
    id: 'eicher-14ft',
    name: 'Eicher Pro 2049 (14ft Open)',
    tagline: 'Top choice for 60-80 Qtl onion & potato loads',
    hindiName: 'आयशर 14 फीट (4.5 टन)',
    capacityTon: 4.5,
    quintalCapacity: 45,
    baseFare: 3200,
    ratePerKm: 38,
    etaMins: 25,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqG6h3_eH3z3iY9-tT5H1mP22n3m5rV7C12f3k9k3v6Y3h2N2=w400',
    popularFor: 'Ventilated mesh bags, intercity transit',
    isAvailable: true,
  },
  {
    id: 'eicher-19ft',
    name: 'Eicher Pro 2095 (19ft Full Load)',
    tagline: 'Bulk dispatch for retailer partnerships',
    hindiName: 'आयशर 19 फीट (8.5 टन)',
    capacityTon: 8.5,
    quintalCapacity: 85,
    baseFare: 4800,
    ratePerKm: 52,
    etaMins: 35,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqG6h3_eH3z3iY9-tT5H1mP22n3m5rV7C12f3k9k3v6Y3h2N3=w400',
    popularFor: 'Heavy grain sacks, large onion harvests',
    isAvailable: true,
  },
  {
    id: 'heavy-10wheeler',
    name: 'Tata Signa 2823 (10-Wheeler Heavy)',
    tagline: 'Interstate bulk haulage (15-20 Ton)',
    hindiName: '10-चक्का भारी ट्रक (18 टन)',
    capacityTon: 18,
    quintalCapacity: 180,
    baseFare: 9500,
    ratePerKm: 78,
    etaMins: 60,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqG6h3_eH3z3iY9-tT5H1mP22n3m5rV7C12f3k9k3v6Y3h2N4=w400',
    popularFor: 'Delhi Azadpur / South India highway runs',
    isAvailable: true,
  },
  {
    id: 'cold-chain-reefer',
    name: 'Mahindra Furio Cold-Chain Reefer',
    tagline: 'Temperature controlled 4°C for perishables',
    hindiName: 'कोल्ड-चेन रेफ्रिजरेटेड ट्रक',
    capacityTon: 5.0,
    quintalCapacity: 50,
    baseFare: 5500,
    ratePerKm: 62,
    etaMins: 40,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqG6h3_eH3z3iY9-tT5H1mP22n3m5rV7C12f3k9k3v6Y3h2N5=w400',
    popularFor: 'Strawberries, grapes, capsicum, cut flowers',
    isAvailable: true,
  },
];

const INITIAL_TRIPS: TransportTrip[] = [
  {
    id: 'TRIP-NSK-9941',
    orderRef: 'ORD-MH-9941',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98221 44910',
    farmerKisanUid: 'MH-NSK-4491',
    pickupAddress: 'Survey No. 142/2, Sukene, Niphad Taluka, Nashik',
    pickupLocationName: 'Patil Onion Storage Shed, Sukene',
    pickupCoords: { lat: 20.0889, lng: 74.1105 },
    dropoffMandiName: 'Shree Balaji Grocers (Vashi Sector 19 APMC)',
    dropoffAddress: 'Plot 44, APMC Fruit & Onion Market Yard, Sector 19, Vashi, Navi Mumbai',
    dropoffCoords: { lat: 19.076, lng: 73.0084 },
    distanceKm: 185,
    estimatedHours: 4.5,
    produceName: 'Nashik Red Onions (Garwa Export Grade)',
    produceWeightQtl: 60,
    produceBagsCount: 120,
    packagingType: '50kg Ventilated Red Leno Mesh Bags',
    truckTypeId: 'eicher-14ft',
    truckName: 'Eicher Pro 2049 (14ft Open)',
    truckRegNumber: 'MH-15-EG-8829',
    estimatedFare: 8400,
    fuelAdvance: 3000,
    status: 'IN_TRANSIT',
    driverId: 'DRV-7812',
    driverName: 'Suresh Kadam',
    driverPhone: '+91 98230 45612',
    driverRating: 4.9,
    driverTotalTrips: 342,
    driverTruckModel: 'Eicher Pro 2049 (14ft High Side)',
    driverCurrentLocation: { lat: 19.6841, lng: 73.4812 },
    driverHeading: 215,
    farmOtp: '4821',
    deliveryOtp: '7190',
    weighbridgeRequired: true,
    weighbridgeCompleted: true,
    scaleGrossWeightKg: 7420,
    scaleTareWeightKg: 4420,
    scaleNetWeightKg: 3000,
    createdAt: Date.now() - 1000 * 60 * 150,
    updatedAt: Date.now() - 1000 * 60 * 15,
    notes: 'Load stacked in dry shed. Weighbridge done at Niphad Dharam Kanta. Handle with care.',
  },
  {
    id: 'TRIP-NSK-4210',
    orderRef: 'ORD-PUN-3312',
    farmerName: 'Dnyaneshwar Bhadke',
    farmerPhone: '+91 97652 11984',
    farmerKisanUid: 'MH-NSK-5102',
    pickupAddress: 'Gat No. 89, Pimpalgaon Baswant, Nashik',
    pickupLocationName: 'Pimpalgaon Grape & Tomato Packhouse',
    pickupCoords: { lat: 20.1742, lng: 73.9854 },
    dropoffMandiName: 'Pune Market Yard Gate No. 3 (Kothrud Wholesale Traders)',
    dropoffAddress: 'Gala 112, Gultekdi Market Yard, Pune, Maharashtra',
    dropoffCoords: { lat: 18.4907, lng: 73.8647 },
    distanceKm: 210,
    estimatedHours: 5.2,
    produceName: 'Himsona Table Tomatoes (Grade A Crates)',
    produceWeightQtl: 40,
    produceBagsCount: 160,
    packagingType: '25kg Food-Grade Plastic Crates',
    truckTypeId: 'pickup-bolero',
    truckName: 'Bolero Maxi Truck Plus',
    estimatedFare: 6200,
    fuelAdvance: 2200,
    status: 'SEARCHING_DRIVER',
    farmOtp: '3391',
    deliveryOtp: '8842',
    weighbridgeRequired: false,
    createdAt: Date.now() - 1000 * 60 * 25,
    updatedAt: Date.now() - 1000 * 60 * 5,
    notes: 'Requires tarp covering. Driver gets immediate digital fuel pass on pickup.',
  },
  {
    id: 'TRIP-LSL-1804',
    orderRef: 'ORD-SUR-7761',
    farmerName: 'Sunita Tai Shinde',
    farmerPhone: '+91 94231 88722',
    farmerKisanUid: 'MH-NSK-3211',
    pickupAddress: 'Kisan Seva Kendra Road, Lasalgaon APMC Outskirts',
    pickupLocationName: 'Lasalgaon Warehouse Bay 4',
    pickupCoords: { lat: 20.1469, lng: 74.2285 },
    dropoffMandiName: 'Surat APMC Sahara Darwaja Mandi',
    dropoffAddress: 'Ring Road, Sahara Darwaja APMC Complex, Surat, Gujarat',
    dropoffCoords: { lat: 21.1702, lng: 72.8311 },
    distanceKm: 245,
    estimatedHours: 5.8,
    produceName: 'Sharbati MP Premium Wheat',
    produceWeightQtl: 80,
    produceBagsCount: 160,
    packagingType: '50kg Heavy Jute Gunny Sacks',
    truckTypeId: 'eicher-19ft',
    truckName: 'Eicher Pro 2095 (19ft Full Load)',
    estimatedFare: 11800,
    fuelAdvance: 4000,
    status: 'SEARCHING_DRIVER',
    farmOtp: '5920',
    deliveryOtp: '6618',
    weighbridgeRequired: true,
    createdAt: Date.now() - 1000 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 12,
    notes: 'Direct transit, toll FASTag reimbursement included in gross fare.',
  },
];

const LOCAL_STORAGE_KEY = 'farmsync_transport_trips_v1';

// Helper to get local cache
function getLocalTrips(): TransportTrip[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Local storage read error:', err);
  }
  return INITIAL_TRIPS;
}

// Helper to save local cache
function saveLocalTrips(trips: TransportTrip[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.warn('Local storage write error:', err);
  }
}

/**
 * Seed initial trips to Google Cloud Firestore if empty
 */
export async function seedInitialTripsIfEmpty(): Promise<void> {
  try {
    const tripsCol = collection(db, 'transport_trips');
    const snapshot = await getDocs(tripsCol);
    if (snapshot.empty) {
      for (const trip of INITIAL_TRIPS) {
        const docRef = doc(db, 'transport_trips', trip.id);
        await setDoc(docRef, trip);
      }
    }
  } catch (err) {
    console.warn('Firestore seeding notice (using local mirror):', err);
  }
}

/**
 * Real-time listener for all transport trips (Used by Truck Driver Portal and Admin)
 */
export function subscribeToAllTrips(
  callback: (trips: TransportTrip[]) => void
): () => void {
  // Fire initial cache right away
  callback(getLocalTrips());

  try {
    const tripsCol = collection(db, 'transport_trips');
    const unsubscribe = onSnapshot(
      tripsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TransportTrip[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as TransportTrip);
          });
          // Sort by newest
          list.sort((a, b) => b.createdAt - a.createdAt);
          saveLocalTrips(list);
          callback(list);
        } else {
          // If Firestore is empty, seed it
          seedInitialTripsIfEmpty();
          callback(getLocalTrips());
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot notice:', error.message);
        callback(getLocalTrips());
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Error subscribing to trips:', err);
    return () => {};
  }
}

/**
 * Real-time listener for a single trip (Used by Farmer Truck Tracking screen)
 */
export function subscribeToTrip(
  tripId: string,
  callback: (trip: TransportTrip | null) => void
): () => void {
  const localList = getLocalTrips();
  const cached = localList.find((t) => t.id === tripId) || localList[0] || null;
  callback(cached);

  try {
    const tripDocRef = doc(db, 'transport_trips', tripId);
    const unsubscribe = onSnapshot(
      tripDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as TransportTrip;
          // Update in local cache
          const updated = localList.map((t) => (t.id === tripId ? data : t));
          saveLocalTrips(updated);
          callback(data);
        }
      },
      (error) => {
        console.warn('Firestore single trip snapshot error:', error.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Error subscribing to trip:', err);
    return () => {};
  }
}

/**
 * Farmer creates a new on-demand Truck Request
 */
export async function createTransportRequest(
  newTrip: Omit<TransportTrip, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TransportTrip> {
  const id = `TRIP-${Date.now().toString().slice(-6)}`;
  const trip: TransportTrip = {
    ...newTrip,
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Update local cache immediately
  const current = getLocalTrips();
  const updated = [trip, ...current];
  saveLocalTrips(updated);

  // Sync to Google Cloud Firestore
  try {
    const docRef = doc(db, 'transport_trips', id);
    await setDoc(docRef, trip);
  } catch (err) {
    console.warn('Could not write trip to remote Firestore, stored locally:', err);
  }

  return trip;
}

/**
 * Truck Driver accepts a ride/load
 */
export async function acceptTripAsDriver(
  tripId: string,
  driverDetails: {
    driverId: string;
    driverName: string;
    driverPhone: string;
    driverRating: number;
    truckRegNumber: string;
    truckModel: string;
    startLocation?: { lat: number; lng: number };
  }
): Promise<void> {
  const updates: Partial<TransportTrip> = {
    status: 'DRIVER_ASSIGNED',
    driverId: driverDetails.driverId,
    driverName: driverDetails.driverName,
    driverPhone: driverDetails.driverPhone,
    driverRating: driverDetails.driverRating,
    truckRegNumber: driverDetails.truckRegNumber,
    driverTruckModel: driverDetails.truckModel,
    driverCurrentLocation: driverDetails.startLocation || { lat: 20.065, lng: 74.08 },
    driverHeading: 45,
    updatedAt: Date.now(),
  };

  // Update local
  const current = getLocalTrips();
  const updated = current.map((t) => (t.id === tripId ? { ...t, ...updates } : t));
  saveLocalTrips(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, 'transport_trips', tripId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Firestore driver accept update fallback to local:', err);
  }
}

/**
 * Update trip status (En route, arrived, loading, in transit, delivered)
 */
export async function updateTripStatus(
  tripId: string,
  newStatus: TransportTrip['status'],
  additionalFields?: Partial<TransportTrip>
): Promise<void> {
  const updates: Partial<TransportTrip> = {
    status: newStatus,
    updatedAt: Date.now(),
    ...(additionalFields || {}),
  };

  // Update local
  const current = getLocalTrips();
  const updated = current.map((t) => (t.id === tripId ? { ...t, ...updates } : t));
  saveLocalTrips(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, 'transport_trips', tripId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Firestore trip status update fallback:', err);
  }
}
