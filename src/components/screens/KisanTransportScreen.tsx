import React, { useState, useEffect } from 'react';
import { ScreenId, TransportTrip, TruckVehicleOption } from '../../types';
import {
  TRUCK_VEHICLE_OPTIONS,
  subscribeToAllTrips,
  createTransportRequest,
} from '../../services/transportFirestoreService';
import { GoogleMapsTruckTracker } from '../maps/GoogleMapsTruckTracker';
import { AGRO_COORDINATES } from '../../lib/mapsConfig';
import {
  getLiveDevicePosition,
  reverseGeocodeLiveCoords,
  calculateDistanceKm,
  calculateTruckTravelHours,
  UserCoordinates,
} from '../../services/geolocationService';
import { sendSmsConfirmation } from '../../services/smsService';
import { OtpVerificationModal, OtpModalDetails } from '../OtpVerificationModal';

interface KisanTransportScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const KisanTransportScreen: React.FC<KisanTransportScreenProps> = ({
  onNavigate,
}) => {
  // State for trip list and selected active trip
  const [trips, setTrips] = useState<TransportTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('TRIP-NSK-9941');

  // Live GPS Geolocation State
  const [liveCoords, setLiveCoords] = useState<UserCoordinates | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccessNote, setGpsSuccessNote] = useState<string | null>(null);

  // Booking Form State
  const [pickupLocation, setPickupLocation] = useState(
    'Survey No. 142/2, Sukene, Niphad Taluka, Nashik (Patil Farms)'
  );
  const [dropoffDestination, setDropoffDestination] = useState('vashi');
  const [cropType, setCropType] = useState('Nashik Red Onions (Garwa)');
  const [weightQtl, setWeightQtl] = useState(60);
  const [packaging, setPackaging] = useState('50kg Ventilated Red Leno Mesh Bags');
  const [selectedTruckId, setSelectedTruckId] = useState('eicher-14ft');
  const [weighbridgeNeeded, setWeighbridgeNeeded] = useState(true);

  // Detect Live GPS Location
  const handleDetectLiveLocation = async () => {
    setIsDetectingGps(true);
    setGpsError(null);
    setGpsSuccessNote(null);
    try {
      const position = await getLiveDevicePosition();
      setLiveCoords(position);
      const address = await reverseGeocodeLiveCoords(position.lat, position.lng);
      setPickupLocation(`${address} (Live GPS: ${position.lat.toFixed(4)}° N, ${position.lng.toFixed(4)}° E)`);
      setGpsSuccessNote(`Live GPS detected (Accuracy: ±${Math.round(position.accuracy || 10)}m)`);
    } catch (err: any) {
      setGpsError(err.message || 'Could not fetch device GPS. Please check browser location permissions.');
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Search Radar / Booking Flow
  const [isSearchingTruck, setIsSearchingTruck] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [activeOtpModal, setActiveOtpModal] = useState<OtpModalDetails | null>(null);

  // Subscribe to real-time trips from Google Cloud Firestore
  useEffect(() => {
    const unsubscribe = subscribeToAllTrips((allTrips) => {
      setTrips(allTrips);
      if (!selectedTripId && allTrips.length > 0) {
        setSelectedTripId(allTrips[0].id);
      }
    });

    return () => unsubscribe();
  }, []);

  const activeTrip =
    trips.find((t) => t.id === selectedTripId) ||
    trips[0] ||
    null;

  // Destination metadata
  const destinations: Record<
    string,
    { name: string; address: string; distance: number; hours: number; coords: { lat: number; lng: number } }
  > = {
    vashi: {
      name: 'Vashi APMC Mandi (Navi Mumbai)',
      address: 'Plot 44, APMC Fruit & Onion Market Yard, Sector 19, Vashi, Navi Mumbai',
      distance: 185,
      hours: 4.5,
      coords: AGRO_COORDINATES.vashiApmc,
    },
    pune: {
      name: 'Pune Market Yard (Gultekdi)',
      address: 'Gala 112, Gultekdi Market Yard Gate 3, Pune, Maharashtra',
      distance: 210,
      hours: 5.2,
      coords: AGRO_COORDINATES.puneMarketYard,
    },
    surat: {
      name: 'Surat APMC Mandi (Sahara Darwaja)',
      address: 'Ring Road, Sahara Darwaja APMC Complex, Surat, Gujarat',
      distance: 245,
      hours: 5.8,
      coords: AGRO_COORDINATES.suratMandi,
    },
    lasalgaon: {
      name: 'Lasalgaon APMC Local Yard',
      address: 'Main Yard, Lasalgaon, Niphad Taluka, Nashik',
      distance: 18,
      hours: 0.8,
      coords: AGRO_COORDINATES.lasalgaonMandi,
    },
  };

  const currentDest = destinations[dropoffDestination] || destinations.vashi;
  const selectedTruck =
    TRUCK_VEHICLE_OPTIONS.find((t) => t.id === selectedTruckId) ||
    TRUCK_VEHICLE_OPTIONS[2];

  // Upfront On-Demand Fare Calculation with Live GPS Coordinates
  const pickupCoordinates = liveCoords
    ? { lat: liveCoords.lat, lng: liveCoords.lng }
    : AGRO_COORDINATES.niphadFarm;

  const calculatedDistance = liveCoords
    ? calculateDistanceKm(liveCoords.lat, liveCoords.lng, currentDest.coords.lat, currentDest.coords.lng)
    : currentDest.distance;

  const calculatedHours = liveCoords
    ? calculateTruckTravelHours(calculatedDistance)
    : currentDest.hours;

  const estimatedFare = Math.round(
    selectedTruck.baseFare + calculatedDistance * selectedTruck.ratePerKm
  );
  const fuelAdvance = Math.round(estimatedFare * 0.35);

  const handleBookTruck = async () => {
    setIsSearchingTruck(true);

    // Simulate instant rural driver radar match
    setTimeout(async () => {
      const newTripData: Omit<TransportTrip, 'id' | 'createdAt' | 'updatedAt'> = {
        orderRef: `ORD-NSK-${Math.floor(1000 + Math.random() * 9000)}`,
        farmerName: 'Ramesh Patil',
        farmerPhone: '+91 98221 44910',
        farmerKisanUid: 'MH-NSK-4491',
        pickupAddress: pickupLocation,
        pickupLocationName: liveCoords ? 'Live Farm Gate (GPS Verified)' : 'Patil Farms Sukene Gate 2',
        pickupCoords: pickupCoordinates,
        dropoffMandiName: currentDest.name,
        dropoffAddress: currentDest.address,
        dropoffCoords: currentDest.coords,
        distanceKm: calculatedDistance,
        estimatedHours: calculatedHours,
        produceName: cropType,
        produceWeightQtl: weightQtl,
        produceBagsCount: Math.round(weightQtl * 2),
        packagingType: packaging,
        truckTypeId: selectedTruck.id,
        truckName: selectedTruck.name,
        truckRegNumber: 'MH-15-EG-' + Math.floor(1000 + Math.random() * 9000),
        estimatedFare,
        fuelAdvance,
        status: 'DRIVER_ASSIGNED',
        driverId: 'DRV-' + Math.floor(1000 + Math.random() * 9000),
        driverName: 'Suresh Kadam',
        driverPhone: '+91 98230 45612',
        driverRating: 4.9,
        driverTotalTrips: 342,
        driverTruckModel: selectedTruck.name,
        driverCurrentLocation: { lat: 20.065, lng: 74.08 },
        driverHeading: 45,
        farmOtp: Math.floor(1000 + Math.random() * 9000).toString(),
        deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
        weighbridgeRequired: weighbridgeNeeded,
        notes: liveCoords ? `Live GPS farm pickup (${liveCoords.lat.toFixed(4)}, ${liveCoords.lng.toFixed(4)}). Weighbridge slip required.` : 'Direct farm gate pickup. Driver fuel advance allocated.',
      };

      const created = await createTransportRequest(newTripData);

      // Dispatch SMS Confirmation to Farmer
      await sendSmsConfirmation({
        to: newTripData.farmerPhone,
        recipientName: `${newTripData.farmerName} (Kisan)`,
        type: 'TRUCK_BOOKED',
        templateData: {
          truckReg: newTripData.truckRegNumber,
          driverName: newTripData.driverName,
          driverPhone: newTripData.driverPhone,
          farmOtp: newTripData.farmOtp,
          pickup: newTripData.pickupLocationName,
          orderId: newTripData.orderRef,
        },
      });

      // Dispatch SMS Confirmation to Driver
      await sendSmsConfirmation({
        to: newTripData.driverPhone,
        recipientName: `${newTripData.driverName} (Sarathi Driver)`,
        type: 'TRUCK_BOOKED',
        templateData: {
          truckReg: newTripData.truckRegNumber,
          driverName: newTripData.driverName,
          driverPhone: newTripData.driverPhone,
          farmOtp: newTripData.farmOtp,
          pickup: newTripData.pickupLocationName,
          orderId: newTripData.orderRef,
        },
      });

      setIsSearchingTruck(false);
      setSelectedTripId(created.id);
      setBookingSuccessModal(true);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-6 space-y-8">
      {/* Top Banner: Kisan Transport On-Demand Experience */}
      <div className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-label-sm font-bold text-primary uppercase tracking-wider">
              FarmSync Sarathi • Kisan Truck Booking
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm font-bold text-xs">
              0% Transport Commission
            </span>
          </div>
          <h1 className="font-headline-sm text-2xl md:text-3xl font-bold text-on-surface">
            Book Farm Trucks On-Demand (किसान ट्रक सेवा)
          </h1>
          <p className="font-body-sm text-on-surface-variant text-sm max-w-2xl">
            Direct farm-gate pickup for your bulk harvests. Guaranteed transparent rates per quintal, verified weighbridge tracking, and live Google Maps truck monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('truck-driver-portal')}
            className="px-4 py-2.5 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed/80 text-on-secondary-fixed font-label-md font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            id="open-driver-portal-btn"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            Driver Partner Portal (सारथी डेस्क)
          </button>
          <button
            onClick={() => onNavigate('farmer-dashboard-orders')}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            My Farm Dashboard
          </button>
        </div>
      </div>

      {/* Main Grid: Left Booking Form (5 Cols) + Right Live Google Maps & Tracking (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Columns: Truck Booking Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                </span>
                <h2 className="font-title-lg font-bold text-on-surface">
                  Book A Farm Truck
                </h2>
              </div>
              <span className="text-xs font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                Instant Dispatch
              </span>
            </div>

            {/* Pickup & Destination Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      trip_origin
                    </span>
                    Pickup Farm Gate (Farm Location):
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLiveLocation}
                    disabled={isDetectingGps}
                    className="px-2.5 py-1 rounded-lg bg-primary-fixed text-primary hover:bg-primary-fixed-dim text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-60"
                    id="detect-live-gps-btn"
                  >
                    <span className={`material-symbols-outlined text-[14px] ${isDetectingGps ? 'animate-spin' : ''}`}>
                      {isDetectingGps ? 'sync' : 'my_location'}
                    </span>
                    <span>{isDetectingGps ? 'Acquiring GPS...' : '📍 Use Live Device GPS'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-3 pl-3 pr-8 rounded-xl bg-surface-container-low border border-surface-container text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  />
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-primary text-[18px]">
                    my_location
                  </span>
                </div>

                {gpsSuccessNote && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                    <span>{gpsSuccessNote} • Live distance calculated: <strong>{calculatedDistance} km</strong></span>
                  </div>
                )}

                {gpsError && (
                  <div className="flex items-center gap-1.5 text-[11px] text-error bg-error-container/20 px-2.5 py-1 rounded-lg border border-error/30">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span>{gpsError}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    location_on
                  </span>
                  Destination Mandi / Retailer Godown:
                </label>
                <select
                  value={dropoffDestination}
                  onChange={(e) => setDropoffDestination(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="vashi">Vashi APMC Yard, Navi Mumbai (185 km • ~4.5 hrs)</option>
                  <option value="pune">Pune Market Yard, Gultekdi (210 km • ~5.2 hrs)</option>
                  <option value="surat">Surat APMC Mandi, Gujarat (245 km • ~5.8 hrs)</option>
                  <option value="lasalgaon">Lasalgaon Local Onion Yard (18 km • ~45 mins)</option>
                </select>
              </div>
            </div>

            {/* Produce & Weight Selection */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="font-label-sm font-bold text-on-surface text-xs block">
                  Crop Produce:
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-on-surface focus:outline-none"
                >
                  <option value="Nashik Red Onions (Garwa)">Nashik Red Onions</option>
                  <option value="Sharbati MP Premium Wheat">Sharbati MP Wheat</option>
                  <option value="Himsona Table Tomatoes">Himsona Tomatoes</option>
                  <option value="Desi Toor Dal">Desi Toor Dal</option>
                  <option value="Sona Masoori Paddy">Sona Masoori Paddy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-label-sm font-bold text-on-surface text-xs block">
                  Weight (Quintals):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={weightQtl}
                    onChange={(e) => setWeightQtl(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold text-on-surface focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant font-bold">
                    Qtl
                  </span>
                </div>
              </div>
            </div>

            {/* Packaging & Dharam Kanta Weighbridge Checkbox */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    scale
                  </span>
                  <div>
                    <span className="font-label-sm font-bold text-on-surface block text-xs">
                      Mandatory Weighbridge (Dharam Kanta)
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Digital weight slip uploaded before highway transit
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weighbridgeNeeded}
                  onChange={(e) => setWeighbridgeNeeded(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>
            </div>

            {/* Vehicle Type Selection Cards */}
            <div className="space-y-2 pt-2">
              <span className="font-label-sm uppercase font-bold text-on-surface-variant text-[11px] tracking-wider block">
                Choose Truck Size (Select Vehicle):
              </span>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {TRUCK_VEHICLE_OPTIONS.map((truck) => {
                  const isSelected = selectedTruckId === truck.id;
                  const fare = Math.round(
                    truck.baseFare + currentDest.distance * truck.ratePerKm
                  );
                  const isCapacityFit = truck.quintalCapacity >= weightQtl;

                  return (
                    <div
                      key={truck.id}
                      onClick={() => setSelectedTruckId(truck.id)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-primary bg-primary-fixed/20 shadow-xs'
                          : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden text-2xl">
                          {truck.id.includes('ace')
                            ? '🛻'
                            : truck.id.includes('reefer')
                            ? '❄️'
                            : truck.id.includes('heavy')
                            ? '🚛'
                            : '🚚'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-label-md font-bold text-on-surface text-xs">
                              {truck.name}
                            </h3>
                            {isCapacityFit && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Ideal
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant">
                            Max {truck.quintalCapacity} Qtl ({truck.capacityTon}T) • ETA: ~{truck.etaMins}m
                          </p>
                          <span className="text-[10px] text-secondary font-medium block">
                            {truck.tagline}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-headline-sm text-base font-black text-primary block">
                          ₹{fare.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-on-surface-variant block">
                          ₹{Math.round(fare / weightQtl)}/Qtl
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fare Summary & Request Button */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Distance ({currentDest.distance} km):</span>
                <strong className="text-on-surface">{currentDest.name}</strong>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Tolls & FASTag:</span>
                <strong className="text-emerald-700 font-bold">Included (Free)</strong>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Driver Diesel Advance:</span>
                <strong className="text-on-surface">₹{fuelAdvance.toLocaleString('en-IN')}</strong>
              </div>
              <div className="pt-2 border-t border-surface-container flex justify-between items-baseline">
                <span className="font-title-sm font-bold text-on-surface">
                  Total Guaranteed Fare:
                </span>
                <span className="font-headline-sm text-2xl font-black text-primary">
                  ₹{estimatedFare.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleBookTruck}
              disabled={isSearchingTruck}
              className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 cursor-pointer transition-all disabled:opacity-75"
              id="confirm-book-truck-btn"
            >
              {isSearchingTruck ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  <span>Connecting to Nearby Trucks (राडार खोज)...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    local_shipping
                  </span>
                  <span>Book {selectedTruck.name} Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 7 Columns: Live Google Maps Tracking & Active Trip Status */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Trip Selector Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="font-label-sm font-bold text-on-surface-variant uppercase text-xs tracking-wider shrink-0">
              Active Trips:
            </span>
            <div className="flex items-center gap-2">
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTripId(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTrip?.id === t.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {t.id} • {t.produceWeightQtl} Qtl
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Google Map Component */}
          {activeTrip && (
            <GoogleMapsTruckTracker
              trip={activeTrip}
              onSimulateMove={(coords) => {
                // Update trip local state if desired
              }}
            />
          )}

          {/* Driver & Verification Card */}
          {activeTrip && (
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-2xl shadow-inner">
                    <span className="material-symbols-outlined text-[32px]">
                      airline_seat_recline_normal
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-title-lg font-bold text-on-surface">
                        {activeTrip.driverName || 'Suresh Kadam'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-0.5">
                        ★ {activeTrip.driverRating || 4.9} ({activeTrip.driverTotalTrips || 342} trips)
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Vehicle: <strong>{activeTrip.driverTruckModel || activeTrip.truckName}</strong> • Plate:{' '}
                      <strong className="text-primary font-mono">{activeTrip.truckRegNumber || 'MH-15-EG-8829'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeTrip.driverPhone || '9823045612'}`}
                    className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    Call Driver
                  </a>
                  <button
                    onClick={() =>
                      setActiveOtpModal({
                        type: 'FARM_GATE_LOADING',
                        otp: activeTrip.farmOtp,
                        driverName: activeTrip.driverName,
                        driverPhone: activeTrip.driverPhone,
                        truckReg: activeTrip.truckRegNumber,
                        produce: activeTrip.produceName,
                        orderId: activeTrip.orderRef,
                      })
                    }
                    className="px-4 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary-fixed/20 font-label-md font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">pin</span>
                    <span>View & Send OTP</span>
                  </button>
                </div>
              </div>

              {/* 2-OTP Security Badges (PIN Verification) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() =>
                    setActiveOtpModal({
                      type: 'FARM_GATE_LOADING',
                      otp: activeTrip.farmOtp,
                      driverName: activeTrip.driverName,
                      driverPhone: activeTrip.driverPhone,
                      truckReg: activeTrip.truckRegNumber,
                      produce: activeTrip.produceName,
                      orderId: activeTrip.orderRef,
                    })
                  }
                  className="p-3.5 rounded-2xl bg-primary-fixed/30 border-2 border-primary-fixed hover:border-primary transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-label-sm text-[11px] uppercase font-bold text-primary block">
                        1. Farm Gate Loading PIN
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-primary group-hover:translate-x-0.5 transition-transform">
                        sms
                      </span>
                    </div>
                    <span className="font-display-lg text-2xl font-mono font-black text-primary tracking-wider">
                      {activeTrip.farmOtp}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant block max-w-[120px]">
                      Share with driver before loading
                    </span>
                    <span className="text-[11px] text-primary font-bold underline">
                      Send SMS / Voice →
                    </span>
                  </div>
                </div>

                <div
                  onClick={() =>
                    setActiveOtpModal({
                      type: 'MANDI_DELIVERY',
                      otp: activeTrip.deliveryOtp,
                      driverName: activeTrip.driverName,
                      driverPhone: activeTrip.driverPhone,
                      retailerName: 'Mandi Retailer (Vashi)',
                      retailerPhone: '+91 98221 44910',
                      truckReg: activeTrip.truckRegNumber,
                      produce: activeTrip.produceName,
                      orderId: activeTrip.orderRef,
                    })
                  }
                  className="p-3.5 rounded-2xl bg-secondary-fixed/30 border-2 border-secondary-fixed hover:border-secondary transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-label-sm text-[11px] uppercase font-bold text-secondary block">
                        2. Mandi Delivery OTP
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-secondary group-hover:translate-x-0.5 transition-transform">
                        sms
                      </span>
                    </div>
                    <span className="font-display-lg text-2xl font-mono font-black text-secondary tracking-wider">
                      {activeTrip.deliveryOtp}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant block max-w-[120px]">
                      Released upon unloading in Vashi
                    </span>
                    <span className="text-[11px] text-secondary font-bold underline">
                      Send SMS / Voice →
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Progression Steps */}
              <div className="space-y-3 pt-2">
                <span className="font-label-sm uppercase font-bold text-on-surface-variant text-[11px] tracking-wider block">
                  Trip Milestones (Google Cloud Synced):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-primary-fixed/40 border border-primary-fixed">
                    <span className="font-bold text-primary block mb-0.5">
                      ✓ 1. Driver Assigned
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                      Arrived at Niphad farm gate
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-primary-fixed/40 border border-primary-fixed">
                    <span className="font-bold text-primary block mb-0.5">
                      ✓ 2. Weighed & Loaded
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                      Gross: 7,420 kg • Net: 3,000 kg
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary-fixed/50 border border-secondary-fixed animate-pulse">
                    <span className="font-bold text-secondary block mb-0.5">
                      🚚 3. En Route to Vashi
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                      Crossing Kasara Ghat (~1 hr 20m)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Success Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-md w-full border border-surface-container-high shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                Truck Driver Confirmed!
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Driver Suresh Kadam (Eicher Pro 2049) is en route to your Sukene farm gate.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pickup PIN:</span>
                <strong className="text-primary font-mono text-base font-black">4821</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Driver Phone:</span>
                <strong className="text-on-surface">+91 98230 45612</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Driver Vehicle:</span>
                <strong className="text-on-surface">MH-15-EG-8829</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Estimated Payout:</span>
                <strong className="text-secondary font-black">₹{estimatedFare}</strong>
              </div>
            </div>

            <button
              onClick={() => setBookingSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary/90 cursor-pointer"
            >
              Track Live on Google Maps →
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification & SMS Share Modal */}
      {activeOtpModal && (
        <OtpVerificationModal
          isOpen={!!activeOtpModal}
          onClose={() => setActiveOtpModal(null)}
          details={activeOtpModal}
        />
      )}
    </div>
  );
};
