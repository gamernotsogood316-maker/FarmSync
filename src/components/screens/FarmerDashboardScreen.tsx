import React, { useState } from 'react';
import { ScreenId, DashboardOrder, UpiPaymentDetails } from '../../types';
import { UpiPaymentQrModal } from '../UpiPaymentQrModal';
import { sendSmsConfirmation } from '../../services/smsService';
import { OtpVerificationModal, OtpModalDetails } from '../OtpVerificationModal';

interface FarmerDashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const FarmerDashboardScreen: React.FC<FarmerDashboardScreenProps> = ({
  onNavigate,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [bidAccepted, setBidAccepted] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counterPrice, setCounterPrice] = useState(2450);
  const [callAlert, setCallAlert] = useState(false);
  const [activeOtpModal, setActiveOtpModal] = useState<OtpModalDetails | null>(null);
  const [smsNotice, setSmsNotice] = useState<string | null>(null);

  // Revenue & UPI state
  const [totalDirectRevenue, setTotalDirectRevenue] = useState(548200);
  const [farmerVpa, setFarmerVpa] = useState('ramesh.patil@sbi');
  const [isEditingVpa, setIsEditingVpa] = useState(false);
  const [vpaInput, setVpaInput] = useState('ramesh.patil@sbi');
  const [upiPaymentAlert, setUpiPaymentAlert] = useState<{
    message: string;
    amount: number;
    utr: string;
  } | null>(null);

  // Orders State with 0% Commission Direct Payments
  const [orders, setOrders] = useState<DashboardOrder[]>([
    {
      id: 'ORD-MH-9941',
      orderNumber: 'ORD-MH-9941',
      batchCode: 'FS-NSK-8821',
      cropName: 'Nashik Red Onions (Garwa)',
      variety: 'Garwa Grade A Export • 58.4mm',
      quantityQtl: 60,
      bagsCount: 120,
      buyerName: 'Shree Balaji Grocers (Anand Verma)',
      buyerBusiness: 'Supermarket Chain • Vashi Sector 19',
      buyerLocation: 'Navi Mumbai',
      buyerPhone: '+91 98201 44812',
      farmerName: 'Ramesh Patil',
      farmerVpa: 'ramesh.patil@sbi',
      farmerPhone: '+91 98230 19284',
      ratePerQtl: 2420,
      subtotal: 145200,
      freightFee: 4200,
      totalAmount: 145200,
      paymentMethod: 'UPI_DIRECT',
      paymentStatus: 'PENDING',
      commissionSaved: 12342,
      createdAt: Date.now() - 3600000 * 3,
      deliveryStatus: 'TRUCK_DISPATCHED',
    },
    {
      id: 'ORD-MH-7230',
      orderNumber: 'ORD-MH-7230',
      batchCode: 'FS-WHT-4210',
      cropName: 'Sharbati MP Premium Wheat',
      variety: 'Golden Bold Grain • 10.8% Moisture',
      quantityQtl: 30,
      bagsCount: 60,
      buyerName: 'Mahavir Grain Traders (Kailash Seth)',
      buyerBusiness: 'Wholesale & Retail Mart',
      buyerLocation: 'Market Yard, Pune',
      buyerPhone: '+91 98902 33190',
      farmerName: 'Ramesh Patil',
      farmerVpa: 'ramesh.patil@sbi',
      farmerPhone: '+91 98230 19284',
      ratePerQtl: 2880,
      subtotal: 86400,
      freightFee: 2600,
      totalAmount: 86400,
      paymentMethod: 'UPI_DIRECT',
      paymentStatus: 'PAID',
      commissionSaved: 7344,
      upiUtr: '429810842190',
      paidAt: Date.now() - 3600000 * 24,
      deliveryStatus: 'DELIVERED',
    },
    {
      id: 'ORD-MH-6119',
      orderNumber: 'ORD-MH-6119',
      batchCode: 'FS-TOM-7721',
      cropName: 'Fresh Himsona Tomatoes',
      variety: 'Firm Table Hybrid • Crates',
      quantityQtl: 20,
      bagsCount: 150,
      buyerName: 'FreshDirect Mumbai Retail Chain',
      buyerBusiness: 'City Supermarkets & Stores',
      buyerLocation: 'Dadar, Mumbai',
      buyerPhone: '+91 98199 82711',
      farmerName: 'Ramesh Patil',
      farmerVpa: 'ramesh.patil@sbi',
      farmerPhone: '+91 98230 19284',
      ratePerQtl: 1625,
      subtotal: 32500,
      freightFee: 1800,
      totalAmount: 32500,
      paymentMethod: 'UPI_DIRECT',
      paymentStatus: 'PAID',
      commissionSaved: 2762,
      upiUtr: '418902741982',
      paidAt: Date.now() - 3600000 * 50,
      deliveryStatus: 'DELIVERED',
    },
  ]);

  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');

  // UPI QR Modal State
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [selectedUpiDetails, setSelectedUpiDetails] = useState<UpiPaymentDetails>({
    vpa: 'ramesh.patil@sbi',
    payeeName: 'Ramesh Patil (Kisan)',
    amount: 145200,
    transactionNote: 'FarmSync Order #ORD-MH-9941 (60 Qtl Onions)',
    refId: 'ORD-MH-9941',
    orderNumber: 'ORD-MH-9941',
    cropDetails: '60 Qtl Nashik Red Onions',
  });
  const [upiModalRole, setUpiModalRole] = useState<'farmer' | 'retailer'>('farmer');

  const openUpiForOrder = (orderId: string, role: 'farmer' | 'retailer' = 'farmer') => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedUpiDetails({
        vpa: order.farmerVpa || farmerVpa,
        payeeName: `${order.farmerName} (Kisan)`,
        amount: order.totalAmount,
        transactionNote: `FarmSync ${order.orderNumber} - ${order.quantityQtl} Qtl ${order.cropName}`,
        refId: order.orderNumber,
        orderNumber: order.orderNumber,
        cropDetails: `${order.quantityQtl} Qtl ${order.cropName}`,
      });
      setUpiModalRole(role);
      setIsUpiModalOpen(true);
    }
  };

  const openCustomUpiModal = (role: 'farmer' | 'retailer' = 'farmer') => {
    setSelectedUpiDetails({
      vpa: farmerVpa,
      payeeName: 'Ramesh Patil (Kisan)',
      amount: 50000,
      transactionNote: 'FarmSync Direct Farm-Gate Produce Payment',
      refId: `FS-UPI-${Date.now().toString().slice(-6)}`,
      orderNumber: 'CUSTOM-DIRECT',
      cropDetails: 'Direct Farm Consignment',
    });
    setUpiModalRole(role);
    setIsUpiModalOpen(true);
  };

  const handlePaymentSuccess = (utr: string, paidAmount: number) => {
    const matchingOrder = orders.find(
      (o) => o.orderNumber === selectedUpiDetails.refId || o.id === selectedUpiDetails.refId
    );
    if (matchingOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === matchingOrder.id
            ? {
                ...o,
                paymentStatus: 'PAID',
                upiUtr: utr,
                paidAt: Date.now(),
              }
            : o
        )
      );
      if (matchingOrder.id === 'ORD-MH-9941') {
        setBidAccepted(true);
      }
    }
    setTotalDirectRevenue((prev) => prev + paidAmount);
    setUpiPaymentAlert({
      message: `₹${paidAmount.toLocaleString('en-IN')} received directly with 0% commission!`,
      amount: paidAmount,
      utr,
    });

    // Send SMS Confirmation of payment receipt
    sendSmsConfirmation({
      to: matchingOrder?.buyerPhone || '+91 98201 44812',
      recipientName: matchingOrder?.buyerName || 'Mandi Buyer',
      type: 'PAYMENT_RECEIVED',
      templateData: {
        amount: paidAmount.toString(),
        orderId: matchingOrder?.orderNumber || 'ORD-MH-9941',
      },
    });

    sendSmsConfirmation({
      to: '+91 98221 44910',
      recipientName: 'Ramesh Patil (Kisan)',
      type: 'PAYMENT_RECEIVED',
      templateData: {
        amount: paidAmount.toString(),
        orderId: matchingOrder?.orderNumber || 'ORD-MH-9941',
      },
    });
  };

  const handleSendOrderSms = async (order: DashboardOrder) => {
    await sendSmsConfirmation({
      to: order.buyerPhone,
      recipientName: order.buyerName,
      type: 'TRUCK_BOOKED',
      templateData: {
        truckReg: 'MH-15-EG-4412',
        driverName: 'Suresh Kadam',
        driverPhone: '+91 98230 45612',
        farmOtp: '4821',
        pickup: 'Sukene Farm Gate 2',
        orderId: order.orderNumber,
      },
    });
    setSmsNotice(`SMS Confirmation for ${order.orderNumber} sent to ${order.buyerName} (${order.buyerPhone})`);
    setTimeout(() => setSmsNotice(null), 4000);
  };

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'PENDING') return order.paymentStatus === 'PENDING';
    if (orderFilter === 'PAID') return order.paymentStatus === 'PAID';
    return true;
  });

  const totalCommissionSaved = orders.reduce((acc, curr) => acc + curr.commissionSaved, 0);
  const totalDirectUpiProcessed = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const wheatImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZsstaUNT2io52UMF0CCdQlqU69Y1edaiCNOjOOzX30ibzvsYmzhZt-m5hDc8Q-fUqwPO_7kXQWVBN3QyqZWHSkqH0W33Ld1O9l1gwLUT1oBMPfMVTwu9QiWrtM7rr0yKWW-0u-jxQUE6MsUfEjatMqz9fZqDBx5U72jH5GzxqoMgo2iDbqplcITF4Vh-Le41bmZyIciOwGIXBVbvb2PcyBrLbY-qRNylyBPpHUHmxXvZTgPdLDFI';

  const onionImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDKECUOeiVWVms4iTS1qbE7cJHOpAzqzvGuNJepzkfgndDcA9RuflKUx1NWgr5SpHgXM11M_h1UDyfj-fa1WVdMyS3x83GbCN-1a7v79tEBpAqJW3GyffxuoWwtpyyTR0zDUy9Hghs_mLoH3ARKZviWAUksqLbPE53mymTjDMf5p9bIoKcZRvQm3GH-6PghVS-UT-t4cSvLviWLko-zscTfLeFgliq_6C8YAe82xzsSpX-nSyRelL4';

  const gpsMapImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDCgZM0A83uWMXn_VnTFyAZ9LRoDBgG73gw6g6BwgtEz7Qs4GxLNMdPwVPn2AHy2-KStMuvQWuV6v4cGJQ8iTOkIrMc-lizS20nKiYt-C4MP1GmGWZoD_vjn18eV_YlvU1g4KiS3Nri5olKTEsPOmtZZe7xOaWS0fyhIOCI5LOpL6S9O8tlGrl548Vuky50Z-ZknD-LCwP75o-VdQjKSjYt6FD47FHkXpWxSPdRPd76_oBW084caiY';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-6 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-primary text-on-primary p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold">
                Kisan UID: MH-NSK-4491
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-label-sm">
                Aadhaar DBT Verified ✓
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-label-sm">
                <span className="material-symbols-outlined text-[14px]">qr_code</span>
                <span className="font-mono">UPI: {farmerVpa}</span>
                <button
                  onClick={() => openCustomUpiModal('farmer')}
                  className="ml-1 underline font-bold hover:text-[#acf4a4] cursor-pointer"
                  title="Generate QR Standee"
                >
                  Show QR
                </button>
              </div>
            </div>

            <h1 className="font-display-lg text-3xl md:text-4xl font-black text-white">
              Namaskar, Ramesh Patil!
            </h1>
            <p className="font-body-md text-white/90 max-w-xl">
              Aapki fasal, aapka dam. Direct trade with 0% commission UPI payments deposited straight into your Bank of Maharashtra account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-1 flex items-center">
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedLanguage === 'hi'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedLanguage === 'en'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => openCustomUpiModal('farmer')}
              className="px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-label-md font-bold flex items-center gap-2 transition-all cursor-pointer"
              id="header-my-upi-qr-btn"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
              My UPI QR
            </button>

            <button
              onClick={() => onNavigate('sell-crops-kisan')}
              className="px-5 py-3 rounded-xl bg-secondary text-on-secondary font-label-md font-bold flex items-center gap-2 shadow-md hover:bg-secondary/90 transition-all cursor-pointer"
              id="dashboard-list-new-crop-btn"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              List New Crop (Fasal Jodein)
            </button>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#acf4a4_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Real-time UPI Payment Received Notification Banner */}
      {upiPaymentAlert && (
        <div className="p-4 rounded-2xl bg-primary-fixed border border-primary/40 flex items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">{upiPaymentAlert.message}</p>
              <p className="text-xs text-on-surface-variant font-mono">
                NPCI UPI UTR: {upiPaymentAlert.utr} • 100% Retained (₹0 Dalali / Middleman fee)
              </p>
            </div>
          </div>
          <button
            onClick={() => setUpiPaymentAlert(null)}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Direct Revenue */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
              Total Direct Revenue
            </span>
            <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div>
            <span className="font-display-lg text-3xl font-black text-primary">
              ₹{totalDirectRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-[#0c5216] bg-primary-fixed px-2 py-0.5 rounded-full ml-2">
              +18.1% vs Mandi
            </span>
          </div>
          <div className="h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 160 30" preserveAspectRatio="none">
              <path
                d="M0,25 Q30,15 60,20 T110,8 T160,2"
                fill="none"
                stroke="#1b5e20"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <p className="font-body-sm text-[11px] text-on-surface-variant">
            100% DBT & Direct UPI Received in Bank of Maharashtra
          </p>
        </div>

        {/* Metric 2: Active Crops Listed */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
              Active Crops Listed
            </span>
            <span className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </span>
          </div>
          <div>
            <span className="font-display-lg text-3xl font-black text-on-surface">
              290 Qtl
            </span>
            <span className="text-xs font-bold text-on-surface-variant ml-2">
              3 Batches
            </span>
          </div>
          <div className="space-y-1 text-xs text-on-surface font-medium pt-2">
            <div className="flex justify-between">
              <span>Garwa Red Onion:</span>
              <strong className="text-primary">150 Qtl</strong>
            </div>
            <div className="flex justify-between">
              <span>Sharbati Wheat:</span>
              <strong className="text-primary">140 Qtl</strong>
            </div>
          </div>
          <p className="font-body-sm text-[11px] text-on-surface-variant">
            All batches verified with 5-photo proof
          </p>
        </div>

        {/* Metric 3: Pending Pickups */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
              Pending Farm Pickups
            </span>
            <span className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            </span>
          </div>
          <div>
            <span className="font-display-lg text-3xl font-black text-tertiary">
              2 Orders
            </span>
            <span className="text-xs font-bold text-[#fc6018] bg-secondary-fixed px-2 py-0.5 rounded-full ml-2">
              Today 4:30 PM
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface font-semibold pt-1">
            Eicher Pro 2049 allocated for Gate No. 2
          </p>
          <p className="font-body-sm text-[11px] text-on-surface-variant">
            Escrow verified and reserved by buyer
          </p>
        </div>

        {/* Metric 4: Retailer Rating */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
              Retailer Trust Score
            </span>
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">star</span>
            </span>
          </div>
          <div>
            <span className="font-display-lg text-3xl font-black text-on-surface">
              4.9 / 5.0
            </span>
            <span className="text-xs font-bold text-amber-600 ml-2">
              Grade A Certified
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface font-semibold pt-1">
            48 successful direct retailer deliveries
          </p>
          <p className="font-body-sm text-[11px] text-on-surface-variant">
            0% moisture dispute or weight rejection
          </p>
        </div>
      </div>

      {/* Price Intelligence Banner (+18.1% Margin Comparison) */}
      <div className="p-5 rounded-3xl bg-surface-container-low border border-surface-container space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              insights
            </span>
            <h3 className="font-title-md font-bold text-on-surface">
              e-NAM & Local APMC Price Intelligence (Nashik Belt)
            </h3>
          </div>
          <span className="font-label-sm text-primary font-bold">
            Updated 15 mins ago from Lasalgaon & Vashi Mandis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-surface-container-lowest rounded-2xl border border-surface-container flex items-center justify-between">
            <div>
              <span className="font-title-md font-bold text-on-surface block">
                Garwa Red Onions
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant">
                Local Mandi Net: ₹2,080/Qtl (After 8% Dalali & Hamali)
              </span>
            </div>
            <div className="text-right">
              <span className="font-headline-sm font-black text-primary block">
                ₹2,450 / Qtl
              </span>
              <span className="font-label-sm text-xs font-bold text-[#0c5216] bg-primary-fixed px-2 py-0.5 rounded-full">
                +₹370/Qtl Extra Direct Profit
              </span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-2xl border border-surface-container flex items-center justify-between">
            <div>
              <span className="font-title-md font-bold text-on-surface block">
                Sharbati Premium Wheat
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant">
                Local Mandi Net: ₹2,440/Qtl
              </span>
            </div>
            <div className="text-right">
              <span className="font-headline-sm font-black text-primary block">
                ₹2,880 / Qtl
              </span>
              <span className="font-label-sm text-xs font-bold text-[#0c5216] bg-primary-fixed px-2 py-0.5 rounded-full">
                +₹440/Qtl Extra Direct Profit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Row: Active Batches + Incoming Retailer Bid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Crop Batches */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-xl font-bold text-on-surface">
              My Active Crop Batches (2)
            </h3>
            <button
              onClick={() => onNavigate('sell-crops-kisan')}
              className="font-label-sm text-primary font-bold hover:underline cursor-pointer"
            >
              + Add Another Batch
            </button>
          </div>

          {/* Batch 1: Sharbati Wheat */}
          <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={wheatImg}
                  alt="Sharbati Wheat"
                  className="w-16 h-16 rounded-2xl object-cover border border-surface-container"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm font-bold text-on-surface-variant">
                      BATCH #FS-WHT-4210
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm font-bold text-xs">
                      Live Listing
                    </span>
                  </div>
                  <h4 className="font-title-md font-bold text-on-surface">
                    Sharbati MP Premium Wheat
                  </h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    140 Quintals available • 3 Retailers viewing right now
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="font-headline-sm font-black text-primary">
                  ₹2,880
                </span>
                <span className="font-label-sm text-on-surface-variant block text-xs">
                  / Quintal Asking Price
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container text-xs">
              <span className="text-on-surface-variant">
                Moisture: <strong className="text-on-surface">10.8%</strong> • Packaging: <strong className="text-on-surface">50kg Jute Bags</strong>
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-surface-container-high font-semibold text-on-surface hover:bg-surface-container">
                  Edit Price
                </button>
                <button
                  onClick={() => onNavigate('buy-crops-mandi-retail')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container font-semibold text-primary hover:bg-surface-container-high"
                >
                  View Market View
                </button>
              </div>
            </div>
          </div>

          {/* Batch 2: Garwa Red Onions */}
          <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={onionImg}
                  alt="Garwa Red Onions"
                  className="w-16 h-16 rounded-2xl object-cover border border-surface-container"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm font-bold text-on-surface-variant">
                      BATCH #FS-NSK-8821
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold text-xs">
                      1 Order in Escrow (60 Qtl)
                    </span>
                  </div>
                  <h4 className="font-title-md font-bold text-on-surface">
                    Nashik Red Onions (Garwa)
                  </h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    150 Quintals total lot • 90 Qtl remaining available
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="font-headline-sm font-black text-primary">
                  ₹2,450
                </span>
                <span className="font-label-sm text-on-surface-variant block text-xs">
                  / Quintal Asking Price
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container text-xs">
              <span className="text-on-surface-variant">
                Weighbridge verified: <strong className="text-on-surface">58.4mm Caliber</strong>
              </span>
              <button
                onClick={() => {
                  const el = document.getElementById('logistics-tracker-card');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90"
              >
                Track Farm Gate Truck →
              </button>
            </div>
          </div>
        </div>

        {/* Incoming Retailer Offer / Bid Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-surface-container-lowest border-2 border-secondary/30 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
                <h3 className="font-title-md font-bold text-on-surface">
                  Incoming Retailer Direct Bid
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold text-xs">
                Escrow Guaranteed
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-title-md font-bold text-on-surface">
                    Shree Balaji Grocers
                  </h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Vashi Sector 19, Navi Mumbai • 5 Star Buyer • 112 Deals Completed
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-surface-container text-xs font-bold text-primary">
                  Verified Dukandar
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Requested Produce:</span>
                  <strong className="text-on-surface">Nashik Red Onions (Garwa)</strong>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Order Volume:</span>
                  <strong className="text-on-surface">60 Quintals (120 Leno Bags)</strong>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Buyer Offer Price:</span>
                  <strong className="text-base font-black text-secondary">₹2,420 / Qtl</strong>
                </div>
                <div className="pt-2 border-t border-surface-container flex justify-between items-baseline">
                  <span className="font-title-sm font-bold text-on-surface">
                    Total Escrow Locked:
                  </span>
                  <span className="font-headline-sm font-black text-primary">
                    ₹1,45,200
                  </span>
                </div>
              </div>

              {/* Safety Margin Indicator */}
              <div className="p-2.5 rounded-xl bg-primary-fixed/40 text-xs text-[#0c5216] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Bid is 98.7% of your asking price. Safe high-profit zone.</span>
              </div>
            </div>

              {/* Bid Action Buttons */}
            <div className="space-y-2">
              {bidAccepted ? (
                <div className="p-3.5 rounded-2xl bg-primary-fixed text-on-primary-fixed-variant text-center font-bold text-xs space-y-1">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Offer Accepted & Escrow Locked!
                  </div>
                  <p>₹1,45,200 is safely reserved in RBI escrow. Truck dispatch has started.</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setBidAccepted(true)}
                    className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 cursor-pointer transition-all"
                    id="accept-bid-btn"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Accept Offer & Lock Escrow (₹1,45,200)
                  </button>

                  <button
                    onClick={() => openUpiForOrder('ORD-MH-9941', 'farmer')}
                    className="w-full py-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-primary/40 text-primary font-label-md font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                    id="bid-generate-upi-qr-btn"
                  >
                    <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                    Generate UPI QR for this Bid (0% Cut)
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCounterOpen(!counterOpen)}
                      className="flex-1 py-2.5 rounded-xl border border-surface-container-high font-label-md text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
                    >
                      Counter Offer
                    </button>
                    <button className="py-2.5 px-4 rounded-xl border border-surface-container-high font-label-md text-error hover:bg-error-container/20 cursor-pointer">
                      Decline
                    </button>
                  </div>
                </>
              )}

              {counterOpen && !bidAccepted && (
                <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container space-y-2">
                  <span className="font-label-sm font-bold block text-xs">
                    Your Counter Price (/Qtl):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(Number(e.target.value))}
                      className="flex-1 p-2 rounded-lg bg-surface-container-lowest border border-surface-container text-xs font-bold"
                    />
                    <button
                      onClick={() => {
                        setBidAccepted(true);
                        setCounterOpen(false);
                      }}
                      className="px-3 py-2 rounded-lg bg-secondary text-on-secondary font-bold text-xs cursor-pointer"
                    >
                      Send Counter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UPI DIRECT PAYMENTS & ORDER DASHBOARD HUB (0% COMMISSION DIRECT PAY)       */}
      {/* ========================================================================= */}
      <div
        className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-6 md:p-8 shadow-sm space-y-6"
        id="upi-order-dashboard-hub"
      >
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-9 h-9 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
              </div>
              <h3 className="font-headline-sm text-xl md:text-2xl font-black text-on-surface">
                UPI Direct Pay Hub • 0% Commission
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-[#0c5216] font-label-sm font-bold text-xs">
                Zero Brokerage Direct Settlements
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant pt-1">
              Direct-to-bank instant settlements for farmers and retail buyers. No intermediary commission, dalali cut, or payment gateway surcharge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openCustomUpiModal('farmer')}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center gap-2 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
              id="generate-custom-upi-qr-btn"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Generate Custom UPI QR
            </button>
          </div>
        </div>

        {/* 4 Mini Stat Cards for 0% Commission Trade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Total Direct UPI Processed
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-sm text-xl font-black text-on-surface">
                ₹{totalDirectUpiProcessed.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-[#0c5216] font-bold">100% Direct</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Brokerage / Dalali Saved
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-sm text-xl font-black text-[#0c5216]">
                +₹{totalCommissionSaved.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-primary font-bold">0% Cut</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Settlement Speed
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-sm text-xl font-black text-on-surface">
                Instant (T+0)
              </span>
              <span className="text-[11px] text-[#0c5216] font-bold">Direct IMPS/UPI</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Farmer VPA (UPI ID)
              </span>
              <button
                onClick={() => setIsEditingVpa(!isEditingVpa)}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                {isEditingVpa ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditingVpa ? (
              <div className="flex items-center gap-1 pt-0.5">
                <input
                  type="text"
                  value={vpaInput}
                  onChange={(e) => setVpaInput(e.target.value)}
                  className="flex-1 px-2 py-1 rounded bg-surface-container-lowest border border-surface-container text-xs font-mono font-bold"
                />
                <button
                  onClick={() => {
                    setFarmerVpa(vpaInput);
                    setIsEditingVpa(false);
                  }}
                  className="px-2 py-1 rounded bg-primary text-white text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="font-mono text-xs font-bold text-primary truncate block">
                {farmerVpa}
              </span>
            )}
          </div>
        </div>

        {/* Order Status Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div className="inline-flex rounded-xl p-1 bg-surface-container-low">
            <button
              onClick={() => setOrderFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderFilter === 'ALL'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setOrderFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderFilter === 'PENDING'
                  ? 'bg-amber-100 text-amber-900 shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Pending QR Payment ({orders.filter((o) => o.paymentStatus === 'PENDING').length})
            </button>
            <button
              onClick={() => setOrderFilter('PAID')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderFilter === 'PAID'
                  ? 'bg-primary-fixed text-[#0c5216] shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Paid via Direct UPI ({orders.filter((o) => o.paymentStatus === 'PAID').length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">security</span>
            <span>NPCI UPI 2.0 Compliant • Verified Merchant VPA</span>
          </div>
        </div>

        {/* Orders Cards Grid */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPaid = order.paymentStatus === 'PAID';
            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-surface-container-low border border-surface-container transition-all hover:border-surface-container-high space-y-4"
                id={`order-card-${order.id}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Order and Produce Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-surface-container text-on-surface">
                        {order.orderNumber}
                      </span>
                      <span className="font-mono text-xs text-on-surface-variant">
                        Batch: {order.batchCode}
                      </span>
                      {isPaid ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-[#0c5216] font-bold text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          Direct UPI Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          Pending Payment
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                        +₹{order.commissionSaved.toLocaleString('en-IN')} Brokerage Saved (0% Cut)
                      </span>
                    </div>

                    <h4 className="font-headline-sm text-lg font-black text-on-surface">
                      {order.cropName}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant flex-wrap">
                      <span>
                        Quantity:{' '}
                        <strong className="text-on-surface font-semibold">
                          {order.quantityQtl} Quintals ({order.bagsCount} Bags)
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Rate:{' '}
                        <strong className="text-on-surface font-semibold">
                          ₹{order.ratePerQtl.toLocaleString('en-IN')} / Qtl
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Buyer:{' '}
                        <strong className="text-on-surface font-semibold">{order.buyerName}</strong>{' '}
                        ({order.buyerLocation})
                      </span>
                    </div>

                    {isPaid && order.upiUtr && (
                      <div className="flex items-center gap-2 text-xs pt-0.5">
                        <span className="text-on-surface-variant">NPCI UTR:</span>
                        <span className="font-mono font-bold text-primary bg-white px-2 py-0.5 rounded border border-surface-container">
                          {order.upiUtr}
                        </span>
                        <span className="text-on-surface-variant">
                          • Credited directly to Bank of Maharashtra
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:text-right">
                    <div>
                      <span className="text-xs text-on-surface-variant block">
                        Net Amount (0% Commission):
                      </span>
                      <span className="font-display-sm text-2xl font-black text-primary">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        Mandi broker cut: ₹0.00
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isPaid ? (
                        <>
                          <button
                            onClick={() => openUpiForOrder(order.id, 'farmer')}
                            className="px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-surface-container hover:bg-surface-container text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer shadow-xs"
                            id={`view-receipt-btn-${order.id}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              receipt_long
                            </span>
                            View Digital Receipt
                          </button>
                          <button
                            onClick={() => openUpiForOrder(order.id, 'retailer')}
                            className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer shadow-xs"
                            id={`view-qr-btn-${order.id}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">qr_code</span>
                            QR Standee
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => openUpiForOrder(order.id, 'farmer')}
                            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-primary/90 cursor-pointer transition-all"
                            id={`generate-upi-qr-btn-${order.id}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              qr_code_scanner
                            </span>
                            Generate UPI QR (0% Cut)
                          </button>
                          <button
                            onClick={() => openUpiForOrder(order.id, 'retailer')}
                            className="px-3.5 py-2.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-secondary/90 cursor-pointer transition-all"
                            id={`retailer-pay-upi-btn-${order.id}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              point_of_sale
                            </span>
                            Retailer Pay
                          </button>
                        </>
                      )}

                      {/* SMS Notification & OTP Security Triggers */}
                      <button
                        onClick={() => handleSendOrderSms(order)}
                        className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title="Dispatch SMS Confirmation to Buyer"
                        id={`sms-confirm-btn-${order.id}`}
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">sms</span>
                        <span>SMS Alert</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveOtpModal({
                            type: order.paymentStatus === 'PAID' ? 'MANDI_DELIVERY' : 'FARM_GATE_LOADING',
                            otp: order.paymentStatus === 'PAID' ? '7190' : '4821',
                            driverName: 'Suresh Kadam',
                            driverPhone: '+91 98230 45612',
                            truckReg: 'MH-15-EG-4412',
                            produce: `${order.quantityQtl} Qtl ${order.cropName}`,
                            orderId: order.orderNumber,
                            retailerName: order.buyerName,
                            retailerPhone: order.buyerPhone,
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer shadow-xs border border-primary/20"
                        title="View & Share Loading / Delivery OTP"
                        id={`view-otp-btn-${order.id}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">pin</span>
                        <span>OTP Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* Logistics & Farm Pickup Tracker */}
      <div
        className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-6 md:p-8 shadow-sm space-y-6"
        id="logistics-tracker-card"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">
                local_shipping
              </span>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                Farm-Gate Logistics & Live Truck Dispatch
              </h3>
            </div>
            <p className="font-body-sm text-on-surface-variant">
              Order #ORD-MH-9941 • 60 Quintals Nashik Red Onions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Truck En Route (14 km away • ETA 28 Mins)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left GPS Map Strip */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-surface-container shadow-inner">
            <img
              src={gpsMapImg}
              alt="Live GPS Truck Location Tracking"
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white font-label-sm px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[#91d78a] text-[16px]">
                navigation
              </span>
              <span>Eicher Pro 2049 (MH-15-EG-8829)</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-xl border border-white/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-on-surface block">Driver: Suresh Kadam</span>
                <span className="text-on-surface-variant">Rural Agro Logistics Hub (Nashik)</span>
              </div>
              <button
                onClick={() => setCallAlert(true)}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                Call Driver
              </button>
            </div>
          </div>

          {/* Right Steps Progress */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-title-md font-bold text-on-surface">
              DBT Escrow Release Milestones:
            </h4>

            <div className="space-y-3 font-body-sm text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-primary-fixed/40">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  check_circle
                </span>
                <div>
                  <strong className="text-on-surface block">1. Escrow Deposited by Buyer</strong>
                  <span className="text-on-surface-variant">₹1,45,200 held in RBI escrow safe</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-primary-fixed/40">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  check_circle
                </span>
                <div>
                  <strong className="text-on-surface block">2. Truck Dispatched to Your Farm</strong>
                  <span className="text-on-surface-variant">Arriving at Niphad Gate No. 4 at 4:30 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container border border-surface-container-high">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  hourglass_top
                </span>
                <div>
                  <strong className="text-on-surface block">3. Farm Gate Weighbridge Weighing</strong>
                  <span className="text-on-surface-variant">Digital weight confirmation with driver</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container border border-surface-container-high">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  account_balance
                </span>
                <div>
                  <strong className="text-on-surface block">4. Direct Bank Transfer (DBT)</strong>
                  <span className="text-on-surface-variant">100% funds released to Bank of Maharashtra</span>
                </div>
              </div>
            </div>

            {/* Farm-Gate UPI Instant Settle Prompt */}
            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">qr_code_2</span>
                <span className="font-semibold text-on-surface">Weighbridge spot payment needed?</span>
              </div>
              <button
                onClick={() => openUpiForOrder('ORD-MH-9941', 'farmer')}
                className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary/90 cursor-pointer"
                id="logistics-upi-settle-btn"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                Generate UPI QR (0% Cut)
              </button>
            </div>
          </div>
        </div>

        {callAlert && (
          <div className="p-3 rounded-xl bg-primary-fixed text-on-primary-fixed text-xs font-semibold flex items-center justify-between">
            <span>Connecting call to driver Suresh Kadam (+91 98230 XXXXX)...</span>
            <button
              onClick={() => setCallAlert(false)}
              className="text-primary font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* 24x7 Gramin Kisan Sahayata Desk */}
      <div className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <div>
            <h4 className="font-title-md font-bold text-on-surface">
              24x7 Gramin Kisan Sahayata Desk
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Any query with weight measurement, payment clearance, or buyer communication?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:18003276796"
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            1800-FARMSYNC (Toll-Free)
          </a>
          <button
            onClick={() => alert('Connected with Mandi Officer Nilesh Gaikwad (Lasalgaon Desk)')}
            className="px-4 py-2.5 rounded-xl border border-surface-container-high font-label-md text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
          >
            WhatsApp Mandi Officer
          </button>
        </div>
      </div>

      {/* UPI QR Payment Modal (0% Commission Direct Payments) */}
      <UpiPaymentQrModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        initialDetails={selectedUpiDetails}
        role={upiModalRole}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* OTP Security Modal for Farm-Gate PIN & Mandi Delivery */}
      {activeOtpModal && (
        <OtpVerificationModal
          isOpen={!!activeOtpModal}
          onClose={() => setActiveOtpModal(null)}
          details={activeOtpModal}
        />
      )}

      {/* SMS Confirmation Toast */}
      {smsNotice && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#0c5216] text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <span className="material-symbols-outlined text-base">sms</span>
          <span>{smsNotice}</span>
        </div>
      )}
    </div>
  );
};

