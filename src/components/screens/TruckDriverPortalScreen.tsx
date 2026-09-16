import React, { useState, useEffect } from 'react';
import { ScreenId, TransportTrip } from '../../types';
import {
  subscribeToAllTrips,
  acceptTripAsDriver,
  updateTripStatus,
} from '../../services/transportFirestoreService';
import { GoogleMapsTruckTracker } from '../maps/GoogleMapsTruckTracker';
import { sendSmsConfirmation } from '../../services/smsService';
import { OtpVerificationModal, OtpModalDetails } from '../OtpVerificationModal';

interface TruckDriverPortalScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const TruckDriverPortalScreen: React.FC<TruckDriverPortalScreenProps> = ({
  onNavigate,
}) => {
  const [trips, setTrips] = useState<TransportTrip[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'available-loads' | 'active-trip' | 'earnings'>('available-loads');

  // Driver details (mock logged-in driver)
  const currentDriver = {
    driverId: 'DRV-7812',
    driverName: 'Suresh Kadam',
    driverPhone: '+91 98230 45612',
    driverRating: 4.9,
    driverTotalTrips: 342,
    truckRegNumber: 'MH-15-EG-8829',
    truckModel: 'Eicher Pro 2049 (14ft High-Side Open)',
    capacityTon: 4.5,
    walletBalance: 14250,
  };

  // State for active trip progression
  const [farmerOtpInput, setFarmerOtpInput] = useState('');
  const [deliveryOtpInput, setDeliveryOtpInput] = useState('');
  const [weighGrossInput, setWeighGrossInput] = useState('7420');
  const [weighTareInput, setWeighTareInput] = useState('4420');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeOtpModal, setActiveOtpModal] = useState<OtpModalDetails | null>(null);

  // Subscribe to real-time trips from Google Cloud Firestore
  useEffect(() => {
    const unsubscribe = subscribeToAllTrips((allTrips) => {
      setTrips(allTrips);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter available loads (SEARCHING_DRIVER) and driver's active trip
  const availableLoads = trips.filter(
    (t) => t.status === 'SEARCHING_DRIVER'
  );
  const driverActiveTrip = trips.find(
    (t) =>
      t.driverId === currentDriver.driverId ||
      t.status === 'IN_TRANSIT' ||
      t.status === 'DRIVER_ASSIGNED' ||
      t.status === 'ARRIVED_FARM' ||
      t.status === 'LOADING_PRODUCE'
  );

  // Handle Driver Accepting a Load
  const handleAcceptLoad = async (trip: TransportTrip) => {
    await acceptTripAsDriver(trip.id, {
      driverId: currentDriver.driverId,
      driverName: currentDriver.driverName,
      driverPhone: currentDriver.driverPhone,
      driverRating: currentDriver.driverRating,
      truckRegNumber: currentDriver.truckRegNumber,
      truckModel: currentDriver.truckModel,
    });

    showToast(`Load accepted! Pickup route to ${trip.farmerName}'s farm is ready.`);
    setActiveTab('active-trip');
  };

  // Trip progression actions
  const handleArriveAtFarm = async () => {
    if (!driverActiveTrip) return;
    await updateTripStatus(driverActiveTrip.id, 'ARRIVED_FARM');
    showToast('Arrived at Farm Gate. Ask farmer for loading PIN.');
  };

  const handleVerifyLoadingOtp = async () => {
    if (!driverActiveTrip) return;
    if (farmerOtpInput.trim() === driverActiveTrip.farmOtp || farmerOtpInput.trim() === '4821') {
      await updateTripStatus(driverActiveTrip.id, 'LOADING_PRODUCE', {
        scaleGrossWeightKg: Number(weighGrossInput) || 7420,
        scaleTareWeightKg: Number(weighTareInput) || 4420,
        scaleNetWeightKg: (Number(weighGrossInput) || 7420) - (Number(weighTareInput) || 4420),
        weighbridgeCompleted: true,
      });

      // Dispatch SMS Confirmation to Kisan
      await sendSmsConfirmation({
        to: driverActiveTrip.farmerPhone || '+91 98221 44910',
        recipientName: `${driverActiveTrip.farmerName || 'Ramesh Patil'} (Kisan)`,
        type: 'LOADING_CONFIRMED',
        templateData: {
          truckReg: driverActiveTrip.truckRegNumber,
          driverName: driverActiveTrip.driverName,
          driverPhone: driverActiveTrip.driverPhone,
          produce: driverActiveTrip.produceName,
          orderId: driverActiveTrip.orderRef,
        },
      });

      showToast('PIN Verified & Produce Loaded! Diesel advance ₹3,000 credited & Kisan SMS sent.');
    } else {
      alert(`Incorrect Farmer PIN. Please ask the farmer (Hint: ${driverActiveTrip.farmOtp})`);
    }
  };

  const handleStartHighwayTransit = async () => {
    if (!driverActiveTrip) return;
    await updateTripStatus(driverActiveTrip.id, 'IN_TRANSIT');
    showToast('Transit started on NH160 Highway! Google Maps GPS telemetry active.');
  };

  const handleCompleteDelivery = async () => {
    if (!driverActiveTrip) return;
    if (deliveryOtpInput.trim() === driverActiveTrip.deliveryOtp || deliveryOtpInput.trim() === '7190') {
      await updateTripStatus(driverActiveTrip.id, 'DELIVERED');

      // Dispatch SMS Confirmation of Delivery and DBT settlement
      await sendSmsConfirmation({
        to: driverActiveTrip.farmerPhone || '+91 98221 44910',
        recipientName: `${driverActiveTrip.farmerName || 'Ramesh Patil'} (Kisan)`,
        type: 'DELIVERED',
        templateData: {
          truckReg: driverActiveTrip.truckRegNumber,
          driverName: driverActiveTrip.driverName,
          driverPhone: driverActiveTrip.driverPhone,
          fare: driverActiveTrip.estimatedFare?.toString() || '10400',
          orderId: driverActiveTrip.orderRef,
        },
      });

      showToast(`Trip Completed! ₹${driverActiveTrip.estimatedFare} settlement released to UPI wallet & confirmation SMS sent.`);
      setDeliveryOtpInput('');
      setFarmerOtpInput('');
    } else {
      alert(`Incorrect Delivery OTP. Please get the OTP from Mandi Retailer (Hint: ${driverActiveTrip.deliveryOtp})`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-6 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span className="font-label-md font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Driver Header & Duty Toggle */}
      <div className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-2xl shadow-inner">
            <span className="material-symbols-outlined text-[36px]">local_shipping</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-headline-sm text-2xl font-bold text-on-surface">
                {currentDriver.driverName} (सारथी डेस्क)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                ★ {currentDriver.driverRating} ({currentDriver.driverTotalTrips} trips)
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Vehicle: <strong>{currentDriver.truckModel}</strong> • Plate:{' '}
              <strong className="text-primary font-mono">{currentDriver.truckRegNumber}</strong> • Permit: All-India Agri
            </p>
          </div>
        </div>

        {/* Online / Offline Toggle & Wallet Balance */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container text-right">
            <span className="font-label-sm text-[11px] text-on-surface-variant block uppercase font-bold">
              Driver Wallet (FASTag & DBT)
            </span>
            <span className="font-headline-sm text-xl font-black text-primary">
              ₹{currentDriver.walletBalance.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-3 rounded-2xl font-label-md font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
            }`}
            id="driver-duty-status-toggle"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>{isOnline ? 'Duty Status: ONLINE' : 'Duty Status: OFFLINE'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-surface-container pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('available-loads')}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'available-loads'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Available Farm Loads ({availableLoads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active-trip')}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'active-trip'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            <span>Active Trip Cockpit</span>
            {driverActiveTrip && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'earnings'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span>Diesel Pass & Payouts</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('kisan-truck-transport')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Switch to Farmer Booking View</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* TAB 1: Available Farm Bulk Loads (Driver Load Board) */}
      {activeTab === 'available-loads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                Nearby Farmer Bulk Dispatches Ready for Pickup
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Direct farmer loads with guaranteed escrow payout. Fast-track FASTag fuel advance included.
              </p>
            </div>
            <span className="text-xs bg-primary-fixed text-primary px-3 py-1 rounded-full font-bold">
              Google Cloud Real-Time Feed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableLoads.map((load) => (
              <div
                key={load.id}
                className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar: Fare & Weight */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-surface-container">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {load.id}
                      </span>
                      <h3 className="font-headline-sm text-xl font-black text-primary">
                        ₹{load.estimatedFare.toLocaleString('en-IN')}
                      </h3>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        Advance Diesel: ₹{load.fuelAdvance.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-primary-fixed text-primary font-bold text-xs block">
                        {load.produceWeightQtl} Quintals
                      </span>
                      <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                        ~{load.produceBagsCount} Bags
                      </span>
                    </div>
                  </div>

                  {/* Route & Distance */}
                  <div className="py-3 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs">
                      <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                        trip_origin
                      </span>
                      <div>
                        <strong className="text-on-surface block">{load.pickupLocationName}</strong>
                        <span className="text-on-surface-variant text-[11px] line-clamp-1">
                          Farmer: {load.farmerName} • {load.pickupAddress}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs">
                      <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                        location_on
                      </span>
                      <div>
                        <strong className="text-on-surface block">{load.dropoffMandiName}</strong>
                        <span className="text-on-surface-variant text-[11px]">
                          Transit: {load.distanceKm} km (~{load.estimatedHours} hrs via Highway)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cargo Badge & Dharam Kanta Indicator */}
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Crop:</span>
                      <strong className="text-on-surface">{load.produceName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Weighbridge:</span>
                      <strong className="text-primary">
                        {load.weighbridgeRequired ? 'Mandatory Slip' : 'Direct Loading'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleAcceptLoad(load)}
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-1 shadow-sm hover:bg-primary/90 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>Accept Ride</span>
                  </button>
                  <button
                    onClick={() =>
                      alert(`Calling farmer ${load.farmerName} on ${load.farmerPhone}...`)
                    }
                    className="w-full py-2.5 rounded-xl border border-surface-container-high font-label-md text-on-surface hover:bg-surface-container cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Call Kisan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Active Trip Cockpit (Navigation & Status Progression) */}
      {activeTab === 'active-trip' && (
        <div className="space-y-6">
          {!driverActiveTrip ? (
            <div className="p-12 text-center rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-4">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">
                local_shipping
              </span>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                No Active Trip Right Now
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                Accept one of the available farmer bulk loads from the feed to start navigation and loading.
              </p>
              <button
                onClick={() => setActiveTab('available-loads')}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold"
              >
                Browse Farm Loads
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Cols: Google Maps GPS Navigation View */}
              <div className="lg:col-span-7 space-y-4">
                <GoogleMapsTruckTracker
                  trip={driverActiveTrip}
                  isDriverView={true}
                />

                {/* Live Highway Navigation Banner */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">turn_sharp_right</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-on-surface block">
                        Next: Kasara Ghat Summit Weighbridge Checkpoint
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        In 4.2 km • Keep left lane for heavy commercial trucks
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-surface-container px-3 py-1 rounded-lg">
                    NH160
                  </span>
                </div>
              </div>

              {/* Right 5 Cols: Driver Trip Progression Controls */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-md space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        Active Order: {driverActiveTrip.id}
                      </span>
                      <h3 className="font-title-lg font-bold text-on-surface">
                        Trip Control Cockpit
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {driverActiveTrip.status}
                    </span>
                  </div>

                  {/* Trip Details Summary */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Farmer:</span>
                      <strong className="text-on-surface">
                        {driverActiveTrip.farmerName} ({driverActiveTrip.farmerPhone})
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Produce:</span>
                      <strong className="text-on-surface">
                        {driverActiveTrip.produceWeightQtl} Qtl {driverActiveTrip.produceName}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Delivery Mandi:</span>
                      <strong className="text-secondary">
                        {driverActiveTrip.dropoffMandiName}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-surface-container">
                      <span className="text-on-surface-variant font-bold">Net Payout:</span>
                      <strong className="text-primary font-headline-sm text-base font-black">
                        ₹{driverActiveTrip.estimatedFare.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* STEP 1: Farm Gate Arrival */}
                  <div className="p-4 rounded-2xl border border-surface-container space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span className="font-label-sm font-bold text-on-surface text-xs">
                          Arrive At Farm Gate
                        </span>
                      </div>
                      {driverActiveTrip.status !== 'DRIVER_ASSIGNED' && (
                        <span className="text-emerald-700 font-bold text-xs">✓ Done</span>
                      )}
                    </div>

                    {driverActiveTrip.status === 'DRIVER_ASSIGNED' && (
                      <button
                        onClick={handleArriveAtFarm}
                        className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold cursor-pointer hover:bg-primary/90"
                      >
                        Slide: I Have Arrived at Farm Gate
                      </button>
                    )}
                  </div>

                  {/* STEP 2: Farm Gate Loading PIN & Weighbridge Verification */}
                  <div className="p-4 rounded-2xl border border-surface-container space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span className="font-label-sm font-bold text-on-surface text-xs">
                          Enter Farmer Loading PIN & Scale Weight
                        </span>
                      </div>
                      {driverActiveTrip.weighbridgeCompleted && (
                        <span className="text-emerald-700 font-bold text-xs">✓ Verified</span>
                      )}
                    </div>

                    {driverActiveTrip.status === 'ARRIVED_FARM' && (
                      <div className="space-y-3 pt-1">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-on-surface block">
                              Farmer 4-Digit Security PIN (Ask Kisan):
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveOtpModal({
                                  type: 'FARM_GATE_LOADING',
                                  otp: driverActiveTrip.farmOtp || '4821',
                                  driverName: driverActiveTrip.driverName,
                                  driverPhone: driverActiveTrip.driverPhone,
                                  truckReg: driverActiveTrip.truckRegNumber,
                                  produce: driverActiveTrip.produceName,
                                  orderId: driverActiveTrip.orderRef,
                                })
                              }
                              className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">sms</span>
                              <span>SMS / Voice PIN</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter 4-digit PIN (e.g. 4821)"
                            value={farmerOtpInput}
                            onChange={(e) => setFarmerOtpInput(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container font-mono text-center font-bold text-lg tracking-widest"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-on-surface-variant block">
                              Gross Wt (kg):
                            </label>
                            <input
                              type="number"
                              value={weighGrossInput}
                              onChange={(e) => setWeighGrossInput(e.target.value)}
                              className="w-full p-2 rounded-lg bg-surface-container-low border border-surface-container font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant block">
                              Tare Wt (kg):
                            </label>
                            <input
                              type="number"
                              value={weighTareInput}
                              onChange={(e) => setWeighTareInput(e.target.value)}
                              className="w-full p-2 rounded-lg bg-surface-container-low border border-surface-container font-bold"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleVerifyLoadingOtp}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-md font-bold cursor-pointer"
                        >
                          Confirm Loading & Receive Diesel Advance
                        </button>
                      </div>
                    )}
                  </div>

                  {/* STEP 3: Start Highway Transit */}
                  {driverActiveTrip.status === 'LOADING_PRODUCE' && (
                    <div className="p-4 rounded-2xl border border-secondary bg-secondary-fixed/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm font-bold text-secondary text-xs">
                          3. Ready for Highway Transit
                        </span>
                        <span className="material-symbols-outlined text-secondary">
                          local_shipping
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        All bags stacked and tarped. Start transit to broadcast GPS telemetry.
                      </p>
                      <button
                        onClick={handleStartHighwayTransit}
                        className="w-full py-3 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold cursor-pointer"
                      >
                        Start Transit to Vashi APMC Mandi
                      </button>
                    </div>
                  )}

                  {/* STEP 4: Delivery Completion with Mandi Retailer OTP */}
                  {(driverActiveTrip.status === 'IN_TRANSIT' ||
                    driverActiveTrip.status === 'ARRIVED_MANDI') && (
                    <div className="p-4 rounded-2xl border border-primary bg-primary-fixed/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm font-bold text-primary text-xs">
                          4. Complete Delivery at Mandi Godown
                        </span>
                        <span className="material-symbols-outlined text-primary">
                          store
                        </span>
                      </div>

                      <p className="text-xs text-on-surface-variant">
                        Unload bags at Shree Balaji Grocers (Vashi Sector 19). Collect 4-digit Delivery OTP from retailer:
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-on-surface">Retailer Delivery OTP:</span>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveOtpModal({
                                type: 'MANDI_DELIVERY',
                                otp: driverActiveTrip.deliveryOtp || '7190',
                                driverName: driverActiveTrip.driverName,
                                driverPhone: driverActiveTrip.driverPhone,
                                retailerName: 'Shree Balaji Grocers',
                                retailerPhone: '+91 98221 44910',
                                truckReg: driverActiveTrip.truckRegNumber,
                                produce: driverActiveTrip.produceName,
                                orderId: driverActiveTrip.orderRef,
                              })
                            }
                            className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">sms</span>
                            <span>SMS / Voice OTP</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter Retailer OTP (e.g. 7190)"
                          value={deliveryOtpInput}
                          onChange={(e) => setDeliveryOtpInput(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-surface-container-lowest border border-primary font-mono text-center font-bold text-lg tracking-widest"
                        />
                        <button
                          onClick={handleCompleteDelivery}
                          className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold cursor-pointer shadow-lg hover:bg-primary/90"
                        >
                          Verify OTP & Settle ₹{driverActiveTrip.estimatedFare} to Wallet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Driver Earnings & Fuel Advance */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
              <span className="text-xs font-bold text-on-surface-variant uppercase">
                Today's Freight Earnings
              </span>
              <div className="font-headline-sm text-3xl font-black text-primary mt-1">
                ₹8,400
              </div>
              <span className="text-xs text-emerald-700 font-semibold mt-1 block">
                ✓ 100% Settled via Direct Bank Escrow
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
              <span className="text-xs font-bold text-on-surface-variant uppercase">
                FASTag & Diesel Pass Balance
              </span>
              <div className="font-headline-sm text-3xl font-black text-secondary mt-1">
                ₹5,850
              </div>
              <span className="text-xs text-on-surface-variant mt-1 block">
                Valid at all HPCL & IndianOil Highway Pumps
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
              <span className="text-xs font-bold text-on-surface-variant uppercase">
                Completed Agri Hauls
              </span>
              <div className="font-headline-sm text-3xl font-black text-on-surface mt-1">
                342 Trips
              </div>
              <span className="text-xs text-amber-700 font-semibold mt-1 block">
                ★ 4.9 Star Rating (Top Rated Driver)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Driver OTP Verification & SMS Modal */}
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
