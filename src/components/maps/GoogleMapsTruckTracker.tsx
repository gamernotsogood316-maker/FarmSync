import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY, ROUTE_NIPHAD_TO_VASHI } from '../../lib/mapsConfig';
import { TransportTrip } from '../../types';
import { getLiveDevicePosition, UserCoordinates } from '../../services/geolocationService';

interface GoogleMapsTruckTrackerProps {
  trip: TransportTrip;
  isDriverView?: boolean;
  onSimulateMove?: (newCoords: { lat: number; lng: number }) => void;
}

export const GoogleMapsTruckTracker: React.FC<GoogleMapsTruckTrackerProps> = ({
  trip,
  isDriverView = false,
  onSimulateMove,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const truckMarkerRef = useRef<google.maps.Marker | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(4); // Current index along ROUTE_NIPHAD_TO_VASHI
  const [currentSpeed, setCurrentSpeed] = useState(54); // km/h
  const [userLivePos, setUserLivePos] = useState<UserCoordinates | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [liveLocationToast, setLiveLocationToast] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        setOptions({
          key: GOOGLE_MAPS_API_KEY,
          v: 'weekly',
        });

        await importLibrary('maps');
        try {
          await importLibrary('geometry');
        } catch {
          // geometry optional
        }

        if (!isMounted || !mapContainerRef.current) return;

        const centerLat = trip.driverCurrentLocation?.lat || trip.pickupCoords.lat;
        const centerLng = trip.driverCurrentLocation?.lng || trip.pickupCoords.lng;

        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 10,
          mapTypeId: mapType,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.land_parcel',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        mapInstanceRef.current = map;

        // Draw Route Polyline
        const routeCoordinates = ROUTE_NIPHAD_TO_VASHI.map((pt) => ({
          lat: pt.lat,
          lng: pt.lng,
        }));

        const polyline = new google.maps.Polyline({
          path: routeCoordinates,
          geodesic: true,
          strokeColor: '#00450d',
          strokeOpacity: 0.85,
          strokeWeight: 5,
        });
        polyline.setMap(map);
        polylineRef.current = polyline;

        // Farm Pickup Marker (Green Flag/Pin)
        new google.maps.Marker({
          position: trip.pickupCoords,
          map,
          title: `Pickup: ${trip.pickupLocationName}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#00450d',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5,
          },
          label: {
            text: '🌱',
            fontSize: '14px',
          },
        });

        // Dropoff Mandi Marker (Amber/Blue Pin)
        new google.maps.Marker({
          position: trip.dropoffCoords,
          map,
          title: `Dropoff: ${trip.dropoffMandiName}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#fc6018',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5,
          },
          label: {
            text: '🏬',
            fontSize: '14px',
          },
        });

        // Truck Marker (Moving)
        const truckPos = trip.driverCurrentLocation || ROUTE_NIPHAD_TO_VASHI[simStep];
        const truckMarker = new google.maps.Marker({
          position: truckPos,
          map,
          title: `Truck: ${trip.truckRegNumber || 'Eicher Pro'} (${trip.driverName || 'Driver'})`,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#1b5e20',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            rotation: trip.driverHeading || 215,
          },
          label: {
            text: '🚛',
            fontSize: '18px',
          },
        });
        truckMarkerRef.current = truckMarker;

        // Fit bounds to show entire route
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(trip.pickupCoords);
        bounds.extend(trip.dropoffCoords);
        if (trip.driverCurrentLocation) {
          bounds.extend(trip.driverCurrentLocation);
        }
        map.fitBounds(bounds, 50);

        setMapsLoaded(true);
      } catch (err: any) {
        console.warn('Google Maps Load Warning:', err);
        setMapsError(err?.message || 'Google Maps failed to initialize. Displaying live satellite simulator.');
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update map type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // Toggle Traffic Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    } else {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    }
  }, [showTraffic]);

  // Update Truck Position when trip.driverCurrentLocation changes
  useEffect(() => {
    if (truckMarkerRef.current && trip.driverCurrentLocation) {
      truckMarkerRef.current.setPosition(trip.driverCurrentLocation);
      if (trip.driverHeading !== undefined) {
        const icon = truckMarkerRef.current.getIcon() as google.maps.Symbol;
        if (icon) {
          truckMarkerRef.current.setIcon({ ...icon, rotation: trip.driverHeading });
        }
      }
    }
  }, [trip.driverCurrentLocation, trip.driverHeading]);

  // Simulation loop along the highway
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimStep((prev) => {
        const next = (prev + 1) % ROUTE_NIPHAD_TO_VASHI.length;
        const pt = ROUTE_NIPHAD_TO_VASHI[next];

        // Randomize speed 48-62 km/h
        setCurrentSpeed(Math.floor(48 + Math.random() * 14));

        if (truckMarkerRef.current) {
          truckMarkerRef.current.setPosition(pt);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(pt);
          }
        }

        if (onSimulateMove) {
          onSimulateMove(pt);
        }

        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating, onSimulateMove]);

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      const pos = trip.driverCurrentLocation || ROUTE_NIPHAD_TO_VASHI[simStep];
      mapInstanceRef.current.panTo(pos);
      mapInstanceRef.current.setZoom(12);
    }
  };

  const handleLocateUserLive = async () => {
    setIsLocatingUser(true);
    setLiveLocationToast(null);
    try {
      const pos = await getLiveDevicePosition();
      setUserLivePos(pos);
      setLiveLocationToast(`📍 Your Live GPS: ${pos.lat.toFixed(4)}° N, ${pos.lng.toFixed(4)}° E (±${Math.round(pos.accuracy || 10)}m)`);

      if (mapInstanceRef.current && window.google?.maps) {
        const userLatLng = { lat: pos.lat, lng: pos.lng };
        mapInstanceRef.current.panTo(userLatLng);
        mapInstanceRef.current.setZoom(13);

        if (!userMarkerRef.current) {
          userMarkerRef.current = new google.maps.Marker({
            position: userLatLng,
            map: mapInstanceRef.current,
            title: 'Your Current Device Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: '#2563eb',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          });
        } else {
          userMarkerRef.current.setPosition(userLatLng);
        }
      }
    } catch (err: any) {
      setLiveLocationToast(`⚠️ ${err.message || 'Could not acquire live location.'}`);
    } finally {
      setIsLocatingUser(false);
    }
  };

  const currentWaypoint = ROUTE_NIPHAD_TO_VASHI[simStep] || ROUTE_NIPHAD_TO_VASHI[4];

  return (
    <div className="rounded-3xl overflow-hidden border border-surface-container-high bg-surface-container-lowest shadow-lg relative flex flex-col">
      {/* Map Header Status Bar */}
      <div className="bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 border-b border-surface-container flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                {trip.status === 'IN_TRANSIT'
                  ? 'Live GPS Transit Tracking (NH160 Kasara Corridor)'
                  : trip.status === 'EN_ROUTE_TO_FARM'
                  ? 'Truck En Route to Farm Gate'
                  : 'Live Farm-to-Mandi Highway Route'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm font-bold text-[11px]">
                Google Maps Live
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Location: <strong>{currentWaypoint.title}</strong> • Speed: <strong>{currentSpeed} km/h</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleLocateUserLive}
            disabled={isLocatingUser}
            className="px-3 py-1.5 rounded-xl bg-primary-fixed text-primary hover:bg-primary-fixed-dim text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            title="Locate My Real Device GPS Location on Google Maps"
            id="map-locate-live-gps-btn"
          >
            <span className={`material-symbols-outlined text-[16px] ${isLocatingUser ? 'animate-spin' : ''}`}>
              {isLocatingUser ? 'sync' : 'gps_fixed'}
            </span>
            <span>{isLocatingUser ? 'Locating...' : 'My Live GPS'}</span>
          </button>

          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showTraffic
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
            title="Toggle Live Traffic on Highways"
          >
            <span className="material-symbols-outlined text-[16px]">traffic</span>
            <span>Traffic</span>
          </button>

          <button
            onClick={() =>
              setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'))
            }
            className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Switch Map Type"
          >
            <span className="material-symbols-outlined text-[16px]">
              {mapType === 'roadmap' ? 'satellite' : 'map'}
            </span>
            <span>{mapType === 'roadmap' ? 'Satellite' : 'Roadmap'}</span>
          </button>

          <button
            onClick={recenterMap}
            className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Recenter on Truck"
          >
            <span className="material-symbols-outlined text-[16px]">my_location</span>
            <span>Recenter</span>
          </button>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isSimulating
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed/80'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSimulating ? 'pause' : 'play_arrow'}
            </span>
            <span>{isSimulating ? 'Pause Motion' : 'Simulate Drive'}</span>
          </button>
        </div>
      </div>

      {liveLocationToast && (
        <div className="bg-primary text-on-primary px-4 py-1.5 text-xs font-semibold flex items-center justify-between z-10 animate-in fade-in">
          <span>{liveLocationToast}</span>
          <button
            onClick={() => setLiveLocationToast(null)}
            className="text-white/80 hover:text-white text-xs underline cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Map Container */}
      <div className="relative w-full h-[400px] md:h-[460px] bg-surface-container-low">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Fallback / Offline Overlay if Maps API encounters network restrictions */}
        {mapsError && (
          <div className="absolute inset-0 bg-slate-900/90 text-white p-6 flex flex-col justify-between backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">satellite_alt</span>
                <span className="font-bold text-sm">GPS Telemetry Simulator View (NH160)</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">20.08° N, 74.11° E</span>
            </div>

            {/* Simulated interactive route visualizer */}
            <div className="relative my-auto bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold">🌱 Farm: {trip.pickupLocationName}</span>
                <span className="text-amber-400 font-bold">🏬 Mandi: {trip.dropoffMandiName}</span>
              </div>

              {/* Progress bar representing 185 km */}
              <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-700"
                  style={{ width: `${((simStep + 1) / ROUTE_NIPHAD_TO_VASHI.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Checkpoint: {currentWaypoint.title}</span>
                <span className="font-bold text-white">Truck: {trip.truckRegNumber || 'MH-15-EG-8829'}</span>
                <span>Speed: {currentSpeed} km/h</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Google Maps Demo Key configured. Satellite telemetry active.</span>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold"
              >
                {isSimulating ? 'Stop Movement' : 'Move Along Route'}
              </button>
            </div>
          </div>
        )}

        {/* Floating Telemetry Glass Badge on Map */}
        <div className="absolute top-4 left-4 z-20 bg-surface-container-lowest/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/50 max-w-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-label-sm font-bold text-primary uppercase tracking-wider text-[11px]">
              Active Truck Telemetry
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Vehicle:</span>
              <strong className="text-on-surface">{trip.truckName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Reg No:</span>
              <strong className="text-primary font-mono font-bold">
                {trip.truckRegNumber || 'MH-15-EG-8829'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Driver:</span>
              <strong className="text-on-surface">
                {trip.driverName || 'Suresh Kadam'} (★ {trip.driverRating || 4.9})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Current Highway:</span>
              <strong className="text-secondary truncate max-w-[130px]">
                {currentWaypoint.title}
              </strong>
            </div>
          </div>
        </div>

        {/* Floating Bottom Card: Distance, Time, and ETA */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-xl shrink-0">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-title-md font-bold text-on-surface">
                  {trip.produceWeightQtl} Qtl {trip.produceName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold text-[10px]">
                  {trip.packagingType}
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Farm Gate: <strong>{trip.pickupLocationName}</strong> → Mandi:{' '}
                <strong>{trip.dropoffMandiName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="font-label-sm text-[11px] text-on-surface-variant block uppercase font-bold">
                Remaining Distance
              </span>
              <span className="font-headline-sm text-lg font-black text-primary">
                {Math.max(12, Math.round(trip.distanceKm * (1 - simStep / ROUTE_NIPHAD_TO_VASHI.length)))} km
              </span>
            </div>

            <div className="pl-4 border-l border-surface-container">
              <span className="font-label-sm text-[11px] text-on-surface-variant block uppercase font-bold">
                Estimated Arrival (ETA)
              </span>
              <span className="font-headline-sm text-lg font-black text-secondary">
                {Math.max(25, Math.round(trip.estimatedHours * 60 * (1 - simStep / ROUTE_NIPHAD_TO_VASHI.length)))} Mins
              </span>
            </div>

            {trip.driverPhone && (
              <a
                href={`tel:${trip.driverPhone}`}
                className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span className="hidden md:inline">Call Driver</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Highway Checkpoint Stepper Bar */}
      <div className="p-4 bg-surface-container-low border-t border-surface-container grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {ROUTE_NIPHAD_TO_VASHI.slice(0, 5).map((point, idx) => {
          const isPassed = simStep >= idx;
          const isCurrent = simStep === idx;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-primary-fixed border-primary text-primary font-bold shadow-xs'
                  : isPassed
                  ? 'bg-surface-container-lowest border-surface-container text-on-surface'
                  : 'bg-surface-container-lowest/50 border-surface-container/50 text-on-surface-variant opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-primary text-white animate-pulse'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {isPassed ? '✓' : idx + 1}
                </span>
                <span className="font-semibold truncate">{point.title}</span>
              </div>
              <span className="text-[10px] text-on-surface-variant block truncate">
                {idx === 0 ? 'Niphad' : idx === 1 ? 'Toll Plaza' : idx === 2 ? 'Nashik City' : idx === 3 ? 'Ghat Entry' : 'Kasara'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
