export type ScreenId =
  | 'welcome-role-select'
  | 'sell-crops-kisan'
  | 'buy-crops-mandi-retail'
  | 'farmer-dashboard-orders'
  | 'kisan-truck-transport'
  | 'truck-driver-portal';

export interface LanguageOption {
  code: string;
  native: string;
  english: string;
  audioVoice: string;
}

export interface TruckVehicleOption {
  id: string;
  name: string;
  tagline: string;
  hindiName: string;
  capacityTon: number;
  quintalCapacity: number;
  baseFare: number;
  ratePerKm: number;
  etaMins: number;
  image: string;
  popularFor: string;
  isAvailable: boolean;
}

export type TripStatus =
  | 'SEARCHING_DRIVER'
  | 'DRIVER_ASSIGNED'
  | 'EN_ROUTE_TO_FARM'
  | 'ARRIVED_FARM'
  | 'LOADING_PRODUCE'
  | 'IN_TRANSIT'
  | 'ARRIVED_MANDI'
  | 'DELIVERED';

export interface TransportTrip {
  id: string;
  orderRef?: string;
  farmerName: string;
  farmerPhone: string;
  farmerKisanUid: string;
  pickupAddress: string;
  pickupLocationName: string;
  pickupCoords: { lat: number; lng: number };
  dropoffMandiName: string;
  dropoffAddress: string;
  dropoffCoords: { lat: number; lng: number };
  distanceKm: number;
  estimatedHours: number;
  produceName: string;
  produceWeightQtl: number;
  produceBagsCount: number;
  packagingType: string;
  truckTypeId: string;
  truckName: string;
  truckRegNumber?: string;
  estimatedFare: number;
  fuelAdvance: number;
  status: TripStatus;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  driverTotalTrips?: number;
  driverTruckModel?: string;
  driverCurrentLocation?: { lat: number; lng: number };
  driverHeading?: number;
  farmOtp: string;
  deliveryOtp: string;
  weighbridgeRequired: boolean;
  weighbridgeCompleted?: boolean;
  scaleGrossWeightKg?: number;
  scaleTareWeightKg?: number;
  scaleNetWeightKg?: number;
  createdAt: number;
  updatedAt: number;
  notes?: string;
}

export interface CropLot {
  id: string;
  batchCode: string;
  title: string;
  variety: string;
  farmerName: string;
  farmerLocation: string;
  distanceKm: number;
  rating: number;
  dealsCount: number;
  pricePerUnit: number;
  unit: string;
  apmcAvgPrice: number;
  mspPrice: number;
  safeMin: number;
  safeMax: number;
  ceilingPrice: number;
  availableStock: string;
  minOrderQty: string;
  packaging: string;
  transitReady: string;
  category: 'vegetables' | 'grains' | 'pulses' | 'fruits' | 'spices';
  photos: {
    label: string;
    url: string;
    sublabel?: string;
  }[];
  isHighDemand?: boolean;
  harvestDateText: string;
  verifiedBadges: string[];
}

export interface OrderCart {
  cropName: string;
  farmerName: string;
  farmerDistance: string;
  quantity: string;
  quintalsNumber: number;
  cropSubtotal: number;
  transporterFee: number;
  techFee: number;
}

export type PaymentStatus = 'PENDING' | 'QR_GENERATED' | 'PAID' | 'VERIFIED';

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  batchCode: string;
  cropName: string;
  variety: string;
  quantityQtl: number;
  bagsCount: number;
  buyerName: string;
  buyerBusiness: string;
  buyerLocation: string;
  buyerPhone: string;
  farmerName: string;
  farmerVpa: string;
  farmerPhone: string;
  ratePerQtl: number;
  subtotal: number;
  freightFee: number;
  totalAmount: number;
  paymentMethod: 'UPI_DIRECT' | 'ESCROW' | 'WEIGHBRIDGE_SETTLEMENT';
  paymentStatus: PaymentStatus;
  commissionSaved: number;
  upiUtr?: string;
  paidAt?: number;
  createdAt: number;
  deliveryStatus: 'TRUCK_DISPATCHED' | 'AT_WEIGHBRIDGE' | 'DELIVERED';
}

export interface UpiPaymentDetails {
  vpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  refId: string;
  orderNumber?: string;
  cropDetails?: string;
}

export interface BackendOrderRecord {
  id: string;
  orderNumber: string;
  cropId?: string;
  cropName: string;
  variety: string;
  quantityQtl: number;
  pricePerQtl: number;
  totalAmount: number;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerName: string;
  buyerPhone: string;
  buyerStoreLocation: string;
  paymentMode: 'ESCROW' | 'DIRECT_UPI';
  paymentStatus: 'PAID' | 'ESCROW_LOCKED';
  farmOtp: string;
  deliveryOtp: string;
  truckRegNumber: string;
  driverName: string;
  driverPhone: string;
  status: 'ORDER_PLACED' | 'TRUCK_ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';
  createdAt: string;
  dispatchedSmsIds?: string[];
}

export interface SahayakLearnerProfile {
  farmerId: string;
  farmerName: string;
  phone: string;
  primaryCrop: string;
  farmLocation: string;
  preferredLanguage: string;
  preferredDialect: string;
  preferredMandis: string[];
  preferredTruck: string;
  speechCadence: 'concise_conversational' | 'detailed_advisory';
  conversationCount: number;
  positiveRatings: number;
  negativeRatings: number;
  learnedNotes: string[];
  recentTopics: string[];
  lastLearnedAt: string;
  confidenceScore: number;
}
