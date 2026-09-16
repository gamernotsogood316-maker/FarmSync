import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { UpiPaymentDetails } from '../types';

interface UpiPaymentQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDetails: UpiPaymentDetails;
  role?: 'farmer' | 'retailer';
  onPaymentSuccess?: (utr: string, amount: number) => void;
}

export const UpiPaymentQrModal: React.FC<UpiPaymentQrModalProps> = ({
  isOpen,
  onClose,
  initialDetails,
  role = 'farmer',
  onPaymentSuccess,
}) => {
  const [activeRole, setActiveRole] = useState<'farmer' | 'retailer'>(role);
  const [vpa, setVpa] = useState(initialDetails.vpa || 'ramesh.patil@sbi');
  const [payeeName, setPayeeName] = useState(initialDetails.payeeName || 'Ramesh Patil (Kisan)');
  const [amount, setAmount] = useState<number>(initialDetails.amount || 145200);
  const [transactionNote, setTransactionNote] = useState(
    initialDetails.transactionNote || 'FarmSync Order Direct Payment'
  );
  const [refId, setRefId] = useState(initialDetails.refId || 'FS-ORD-MH-9941');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [confirmedUtr, setConfirmedUtr] = useState('');
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize when initial details change
  useEffect(() => {
    if (initialDetails) {
      setVpa(initialDetails.vpa || 'ramesh.patil@sbi');
      setPayeeName(initialDetails.payeeName || 'Ramesh Patil (Kisan)');
      setAmount(initialDetails.amount || 145200);
      setTransactionNote(initialDetails.transactionNote || 'FarmSync Order Direct Payment');
      setRefId(initialDetails.refId || 'FS-ORD-MH-9941');
      setPaymentCompleted(false);
      setConfirmedUtr('');
      setUtrInput('');
    }
  }, [initialDetails]);

  // Generate NPCI-compliant UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(vpa.trim())}&pn=${encodeURIComponent(
    payeeName.trim()
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    transactionNote.trim()
  )}&tr=${encodeURIComponent(refId.trim())}`;

  // Generate QR Code data URL whenever URI changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      upiUri,
      {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 320,
        color: {
          dark: '#0e3816', // Rich agro forest green for high contrast & thematic cohesion
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && isMounted) {
          setQrDataUrl(url);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [upiUri]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Zero Commission Calculations
  const standardGatewayFee = Math.round(amount * 0.02); // 2.0% standard PG
  const traditionalDalaliCut = Math.round(amount * 0.065); // 6.5% typical Mandi brokerage
  const totalDirectSavings = standardGatewayFee + traditionalDalaliCut;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiUri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2200);
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `🌾 FarmSync Direct Trade Payment\nOrder Ref: ${refId}\nCrop: ${initialDetails.cropDetails || 'Direct Farm Produce'}\nAmount: ₹${amount.toLocaleString(
        'en-IN'
      )}\nPayee UPI ID: ${vpa}\nPayee: ${payeeName}\n0% Commission Direct Bank Transfer.\nPay link: ${upiUri}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadQrStandee = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `FarmSync-UPI-QR-${refId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const generatedUtr = `429${Math.floor(100000000 + Math.random() * 900000000)}`;
      setIsVerifying(false);
      setPaymentCompleted(true);
      setConfirmedUtr(generatedUtr);
      if (onPaymentSuccess) {
        onPaymentSuccess(generatedUtr, amount);
      }
    }, 1200);
  };

  const handleVerifyManualUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (utrInput.trim().length < 8) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPaymentCompleted(true);
      setConfirmedUtr(utrInput.trim());
      if (onPaymentSuccess) {
        onPaymentSuccess(utrInput.trim(), amount);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-2xl overflow-hidden my-6 transition-all"
        id="upi-payment-qr-modal"
      >
        {/* Top Header Banner with Indian National Tiranga subtle stripe */}
        <div className="w-full h-1.5 flex">
          <div className="w-1/3 bg-[#ff9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        {/* Modal Top Bar */}
        <div className="p-5 md:p-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm uppercase font-bold text-primary tracking-wider text-xs">
                  NPCI UPI Direct Pay • 0% Commission
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-[#0c5216] font-label-sm font-bold text-[11px]">
                  Zero Dalali ✓
                </span>
              </div>
              <h3 className="font-headline-sm text-xl md:text-2xl font-black text-on-surface">
                {paymentCompleted ? 'Payment Verified & Confirmed' : 'Instant Farm UPI QR Code'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            id="upi-modal-close-btn"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Role Toggle Strip */}
        <div className="px-6 pt-4 pb-2 bg-surface-container-lowest border-b border-surface-container-low flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex rounded-xl p-1 bg-surface-container">
            <button
              onClick={() => setActiveRole('farmer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'farmer'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              id="upi-toggle-farmer-role-btn"
            >
              👨‍🌾 Kisan Mode (Receive Direct)
            </button>
            <button
              onClick={() => setActiveRole('retailer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'retailer'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              id="upi-toggle-retailer-role-btn"
            >
              🛒 Retailer Mode (Scan & Pay)
            </button>
          </div>

          <span className="text-xs font-semibold text-on-surface-variant">
            Order Ref: <strong className="text-on-surface font-mono">{refId}</strong>
          </span>
        </div>

        <div className="p-6 space-y-6">
          {paymentCompleted ? (
            /* Success State */
            <div className="p-6 rounded-3xl bg-primary-fixed/50 border border-primary/30 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary mx-auto flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-white text-primary text-xs font-bold shadow-xs">
                  0% Commission Settlement Complete
                </span>
                <h4 className="font-headline-md text-2xl font-black text-on-surface pt-2">
                  ₹{amount.toLocaleString('en-IN')} Credited Directly!
                </h4>
                <p className="font-body-md text-xs text-on-surface-variant max-w-md mx-auto">
                  Payment sent directly from Retailer to {payeeName} ({vpa}) without any gateway or dalali cuts.
                </p>
              </div>

              {/* Receipt Pill */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">NPCI UPI Reference (UTR):</span>
                  <strong className="font-mono text-primary font-bold">{confirmedUtr}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Payment Mode:</span>
                  <strong className="text-on-surface">Direct Bank UPI (Instant T+0)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Middleman / Gateway Cut:</span>
                  <strong className="text-[#0c5216] font-bold">₹0.00 (100% Retained)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Order / Batch Code:</span>
                  <span className="font-mono text-on-surface">{refId}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadQrStandee}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  Download Receipt
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary/90 cursor-pointer"
                  id="upi-done-btn"
                >
                  Back to Order Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Active QR Display Grid */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: QR Code Standee Card */}
              <div className="md:col-span-6 flex flex-col items-center">
                <div className="relative p-5 rounded-3xl bg-white border-2 border-[#0e3816]/20 shadow-xl w-full max-w-[280px] text-center space-y-3">
                  {/* Top Branding on Standee */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center text-[11px] font-black">
                        ₹
                      </div>
                      <span className="font-bold text-xs text-primary font-display-sm">
                        FarmSync UPI
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0c5216] bg-primary-fixed px-2 py-0.5 rounded-full">
                      0% Dalali
                    </span>
                  </div>

                  {/* QR Image Container with centered Logo */}
                  <div className="relative mx-auto bg-white p-2 rounded-2xl border border-gray-100 shadow-inner flex items-center justify-center">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`UPI QR code to pay ₹${amount} to ${payeeName}`}
                        className="w-56 h-56 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-56 h-56 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                        Generating UPI QR...
                      </div>
                    )}
                    {/* Centered Rupee / Farm Badge */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-[#0e3816] border-2 border-white text-white flex items-center justify-center font-black text-sm shadow-md">
                        ₹
                      </div>
                    </div>
                  </div>

                  {/* Payee Info */}
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-900 truncate">{payeeName}</p>
                    <p className="text-[11px] font-mono text-gray-600 truncate">{vpa}</p>
                    <p className="text-lg font-black text-primary pt-1">
                      ₹{amount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Accepted Apps Badges */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-semibold text-gray-500">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100">GPay</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100">PhonePe</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100">Paytm</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100">BHIM</span>
                  </div>
                </div>

                {/* Quick actions under QR */}
                <div className="flex items-center gap-2 mt-3 w-full max-w-[280px]">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    id="copy-upi-link-btn"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={handleDownloadQrStandee}
                    className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    id="download-qr-btn"
                    title="Download QR Poster"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    PNG
                  </button>
                  <button
                    onClick={handleShareWhatsapp}
                    className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    id="share-whatsapp-btn"
                    title="Share to Retailer via WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[14px]">share</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Order Details, Zero Commission Breakdown & Payment Trigger */}
              <div className="md:col-span-6 space-y-4">
                {/* 0% Commission Guarantee Box */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        verified_user
                      </span>
                      Direct-to-Bank 0% Commission
                    </span>
                    <span className="text-[11px] font-black text-[#0c5216] bg-primary-fixed px-2 py-0.5 rounded-full">
                      Zero Fees
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Mandi Dalali (Brokerage):</span>
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-gray-400">
                          ₹{traditionalDalaliCut.toLocaleString('en-IN')}
                        </span>
                        <strong className="text-[#0c5216]">₹0 (100% Waived)</strong>
                      </div>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Gateway Surcharge (2%):</span>
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-gray-400">
                          ₹{standardGatewayFee.toLocaleString('en-IN')}
                        </span>
                        <strong className="text-[#0c5216]">₹0 (No Extra Cost)</strong>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-surface-container flex justify-between font-bold text-on-surface">
                      <span>Direct Farmer Payout:</span>
                      <span className="text-sm font-black text-primary">
                        100% (₹{amount.toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant pt-1">
                    Total direct value retained by farmer & retailer:{' '}
                    <strong className="text-primary">+₹{totalDirectSavings.toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                {/* Edit Details Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-on-surface-variant">Payee UPI VPA:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyVpa}
                        className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[12px]">content_copy</span>
                        {copiedVpa ? 'Copied' : vpa}
                      </button>
                      <button
                        onClick={() => setEditDetailsOpen(!editDetailsOpen)}
                        className="text-xs font-bold text-secondary hover:underline cursor-pointer"
                        id="edit-upi-vpa-btn"
                      >
                        {editDetailsOpen ? 'Done' : 'Change VPA/Amount'}
                      </button>
                    </div>
                  </div>

                  {editDetailsOpen && (
                    <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-2 text-xs animate-in fade-in">
                      <div>
                        <label className="font-semibold text-on-surface block mb-1">
                          Farmer UPI ID (VPA):
                        </label>
                        <input
                          type="text"
                          value={vpa}
                          onChange={(e) => setVpa(e.target.value)}
                          placeholder="e.g. kisan.patil@sbi"
                          className="w-full p-2 rounded-lg bg-surface-container-lowest border border-surface-container font-mono text-xs font-bold"
                          id="upi-vpa-input"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-on-surface block mb-1">
                          Amount (₹):
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full p-2 rounded-lg bg-surface-container-lowest border border-surface-container font-mono text-xs font-bold"
                          id="upi-amount-input"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Specific Actions */}
                {activeRole === 'retailer' ? (
                  <div className="space-y-2 pt-1">
                    {/* Deep link button for mobile */}
                    <a
                      href={upiUri}
                      className="w-full py-3.5 rounded-xl bg-secondary text-on-secondary font-label-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-secondary/90 transition-all text-center block"
                      id="pay-via-upi-app-btn"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      Pay Directly in UPI App (GPay/PhonePe)
                    </a>

                    {/* Manual UTR verification Form */}
                    <form onSubmit={handleVerifyManualUtr} className="space-y-2 pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={utrInput}
                          onChange={(e) => setUtrInput(e.target.value)}
                          placeholder="Enter 12-digit UPI UTR / Ref No."
                          className="flex-1 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-mono font-bold text-on-surface"
                          id="manual-utr-input"
                        />
                        <button
                          type="submit"
                          disabled={isVerifying || utrInput.length < 8}
                          className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                          id="verify-utr-btn"
                        >
                          {isVerifying ? 'Checking...' : 'Verify'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Farmer Mode Options */
                  <div className="space-y-2 pt-1">
                    <p className="text-xs text-on-surface-variant font-medium">
                      Show this QR code to the retailer at farm-gate pickup or share via WhatsApp. The funds will be credited straight into your linked bank account.
                    </p>

                    {/* Instant payment simulation button for test/demo workflows */}
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isVerifying}
                      className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                      id="simulate-upi-received-btn"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isVerifying ? 'sync' : 'price_check'}
                      </span>
                      {isVerifying
                        ? 'Verifying Bank Notification...'
                        : 'Simulate Buyer Paid via UPI (Demo)'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
