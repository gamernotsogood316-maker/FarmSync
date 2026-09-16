import React, { useState, useEffect } from 'react';
import { DispatchedSms, subscribeToSmsSent, getSmsHistory, sendSmsConfirmation, openNativeSms } from '../services/smsService';

interface SmsNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsNotificationCenter: React.FC<SmsNotificationCenterProps> = ({ isOpen, onClose }) => {
  const [activeAlert, setActiveAlert] = useState<DispatchedSms | null>(null);
  const [history, setHistory] = useState<DispatchedSms[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Manual Compose State
  const [composeTo, setComposeTo] = useState('+91 98221 44910');
  const [composeName, setComposeName] = useState('Ramesh Patil (Kisan)');
  const [composeType, setComposeType] = useState<'TRUCK_BOOKED' | 'FARM_GATE_LOADING_OTP' | 'DELIVERY_OTP' | 'PAYMENT_RECEIVED' | 'ESCROW_LOCKED'>('TRUCK_BOOKED');
  const [customMsg, setCustomMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccessMsg, setSentSuccessMsg] = useState<string | null>(null);

  // Subscribe to real-time SMS broadcasts
  useEffect(() => {
    const unsubscribe = subscribeToSmsSent((sms) => {
      setActiveAlert(sms);
      setHistory((prev) => [sms, ...prev]);

      // Sound/vibration notification if available
      try {
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
      } catch (_) {}
    });

    // Load initial history
    getSmsHistory().then((h) => setHistory(h));

    return () => unsubscribe();
  }, []);

  // Auto-dismiss floating alert after 8 seconds
  useEffect(() => {
    if (!activeAlert) return;
    const timer = setTimeout(() => {
      setActiveAlert(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeAlert]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendManualSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim()) return;
    setIsSending(true);

    try {
      const res = await sendSmsConfirmation({
        to: composeTo,
        recipientName: composeName,
        type: composeType,
        message: customMsg.trim() || undefined,
        templateData: {
          truckReg: 'MH-15-EG-4412',
          driverName: 'Suresh Kadam',
          driverPhone: '+91 98230 45612',
          farmOtp: '4821',
          deliveryOtp: '7190',
          amount: '1,45,200',
          orderId: 'ORD-MH-9941',
        },
      });

      setSentSuccessMsg(`SMS dispatched to ${composeTo} (ID: ${res.id})`);
      setCustomMsg('');
      setTimeout(() => setSentSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to send SMS:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Realistic SMS Pop-up Banner (Visible when any SMS is sent) */}
      {activeAlert && (
        <div
          className="fixed top-20 right-4 z-50 max-w-md w-[calc(100vw-2rem)] bg-surface-container-lowest border-2 border-primary/40 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
          id="active-sms-alert-banner"
        >
          <div className="flex items-start justify-between gap-3 pb-2 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                <span className="material-symbols-outlined text-[18px]">sms</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs text-primary">{activeAlert.senderId}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Official DLT SMS
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  To: <strong className="text-on-surface">{activeAlert.to}</strong> ({activeAlert.recipientName})
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveAlert(null)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
              aria-label="Dismiss SMS Alert"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="py-2.5">
            <p className="font-mono text-xs text-on-surface leading-relaxed bg-surface-container-low p-2.5 rounded-xl border border-surface-container">
              {activeAlert.message}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCopy(activeAlert.id, activeAlert.message)}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-bold text-[11px] text-on-surface flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedId === activeAlert.id ? 'check' : 'content_copy'}
                </span>
                <span>{copiedId === activeAlert.id ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleSpeak(activeAlert.message)}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                  isSpeaking
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isSpeaking ? 'volume_off' : 'volume_up'}
                </span>
                <span>{isSpeaking ? 'Stop' : 'Voice'}</span>
              </button>
            </div>

            <button
              onClick={() => openNativeSms(activeAlert.to, activeAlert.message)}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs hover:bg-primary/90 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              <span>Open in Phone SMS</span>
            </button>
          </div>
        </div>
      )}

      {/* Full SMS History & Outbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-surface-container-lowest border border-surface-container-high rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            id="sms-outbox-history-modal"
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-primary to-primary/90 text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                  <span className="material-symbols-outlined text-[22px]">sms</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold">
                    FarmSync SMS Confirmation Center
                  </h3>
                  <p className="font-body-sm text-xs opacity-90">
                    Instant SMS notifications with OTPs, truck tracking links, and DBT settlement alerts
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-6">
              {/* Compose / Test Dispatch Box */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm font-bold text-xs text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">send</span>
                    Send Confirmation SMS to Farmer, Driver, or Retailer
                  </span>
                  <span className="font-mono text-[11px] text-on-surface-variant font-bold">
                    Sender ID: VK-FARMSYNC
                  </span>
                </div>

                <form onSubmit={handleSendManualSms} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                        Recipient Mobile Number:
                      </label>
                      <input
                        type="tel"
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        placeholder="+91 98XXXXXXXX"
                        className="w-full p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-mono font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                        Recipient Name & Role:
                      </label>
                      <input
                        type="text"
                        value={composeName}
                        onChange={(e) => setComposeName(e.target.value)}
                        placeholder="e.g. Ramesh Patil (Farmer)"
                        className="w-full p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                        SMS Template Type:
                      </label>
                      <select
                        value={composeType}
                        onChange={(e) => setComposeType(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-semibold"
                      >
                        <option value="TRUCK_BOOKED">🚚 Truck Booking & Farm OTP</option>
                        <option value="FARM_GATE_LOADING_OTP">🔒 Farm Gate Loading PIN</option>
                        <option value="DELIVERY_OTP">📦 Mandi Store Delivery OTP</option>
                        <option value="PAYMENT_RECEIVED">💰 Direct UPI DBT Payment</option>
                        <option value="ESCROW_LOCKED">🛡️ Escrow Locked Confirmation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                        Custom Message (Optional Override):
                      </label>
                      <input
                        type="text"
                        value={customMsg}
                        onChange={(e) => setCustomMsg(e.target.value)}
                        placeholder="Leave blank to use official DLT template"
                        className="w-full p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs"
                      />
                    </div>
                  </div>

                  {sentSuccessMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>{sentSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-primary/90 cursor-pointer disabled:opacity-60 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isSending ? 'sync' : 'outgoing_mail'}
                      </span>
                      <span>{isSending ? 'Sending via Telecom...' : 'Send Official SMS'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* History Log */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm uppercase font-bold text-on-surface-variant text-[11px] tracking-wider">
                    Dispatched SMS History ({history.length} Messages)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Live DLT Gateway Active
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {history.length === 0 ? (
                    <p className="text-xs text-on-surface-variant text-center py-6">
                      No SMS messages sent yet. Book a truck or complete a direct trade to trigger SMS alerts.
                    </p>
                  ) : (
                    history.map((sms) => (
                      <div
                        key={sms.id}
                        className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary bg-white px-2 py-0.5 rounded border border-surface-container">
                              {sms.senderId}
                            </span>
                            <span className="text-on-surface font-semibold">
                              To: {sms.to} ({sms.recipientName})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <span>{new Date(sms.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {sms.status}
                            </span>
                          </div>
                        </div>

                        <p className="font-mono text-xs text-on-surface bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container leading-relaxed">
                          {sms.message}
                        </p>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-[10px] text-on-surface-variant">
                            DLT Template: {sms.dltTemplateId}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(sms.id, sms.message)}
                              className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {copiedId === sms.id ? 'check' : 'content_copy'}
                              </span>
                              <span>{copiedId === sms.id ? 'Copied' : 'Copy Text'}</span>
                            </button>

                            <button
                              onClick={() => openNativeSms(sms.to, sms.message)}
                              className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                              <span>Mobile SMS</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
