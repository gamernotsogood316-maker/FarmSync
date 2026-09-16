export interface DispatchedSms {
  id: string;
  senderId: string;
  to: string;
  recipientName: string;
  type: string;
  message: string;
  sentAt: string;
  status: 'DELIVERED' | 'SENT';
  dltTemplateId: string;
}

export interface SendSmsOptions {
  to: string;
  recipientName?: string;
  type:
    | 'TRUCK_BOOKED'
    | 'FARM_GATE_LOADING_OTP'
    | 'DELIVERY_OTP'
    | 'PAYMENT_RECEIVED'
    | 'ESCROW_LOCKED'
    | 'CROP_LISTED'
    | 'LOADING_CONFIRMED'
    | 'DELIVERED'
    | 'ORDER_CONFIRMED_FARMER'
    | 'POST_ORDER_FARMER'
    | 'ORDER_PLACED_BUYER'
    | 'GENERAL';
  message?: string;
  templateData?: Record<string, any>;
}

type SmsListener = (sms: DispatchedSms) => void;
const smsListeners: SmsListener[] = [];

export function subscribeToSmsSent(listener: SmsListener): () => void {
  smsListeners.push(listener);
  return () => {
    const idx = smsListeners.indexOf(listener);
    if (idx !== -1) smsListeners.splice(idx, 1);
  };
}

function notifySmsListeners(sms: DispatchedSms) {
  smsListeners.forEach((l) => {
    try {
      l(sms);
    } catch (e) {
      console.error('Error in SMS listener', e);
    }
  });
}

/**
 * Dispatch an official confirmation SMS via backend API (with fallback simulation)
 */
export async function sendSmsConfirmation(options: SendSmsOptions): Promise<DispatchedSms> {
  try {
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.sms) {
        notifySmsListeners(data.sms);
        return data.sms;
      }
    }
  } catch (err) {
    console.warn('Network call to /api/send-sms failed, falling back to local dispatch:', err);
  }

  // Fallback local dispatch
  let fallbackMessage = options.message;
  if (!fallbackMessage) {
    const td = options.templateData || {};
    switch (options.type) {
      case 'TRUCK_BOOKED':
        fallbackMessage = `FarmSync Alert: Truck booking confirmed! Vehicle: ${td.truckReg || 'MH-15-EG-4412'}, Driver: ${td.driverName || 'Suresh Kadam'} (${td.driverPhone || '+91 98230 45612'}). Loading PIN: ${td.farmOtp || '4821'}. Live GPS: farmsync.in/track`;
        break;
      case 'FARM_GATE_LOADING_OTP':
        fallbackMessage = `FarmSync Security: Your Farm-Gate Loading OTP is ${td.farmOtp || '4821'}. Share this ONLY with driver ${td.driverName || 'Suresh Kadam'} upon physical crop inspection.`;
        break;
      case 'DELIVERY_OTP':
        fallbackMessage = `FarmSync Security: Your Mandi Delivery OTP is ${td.deliveryOtp || '7190'}. Provide this to driver upon receiving goods at store. 100% DBT will be released.`;
        break;
      case 'PAYMENT_RECEIVED':
        fallbackMessage = `FarmSync Alert: ₹${td.amount || '0'} directly credited to ${td.vpa || 'bank'}. NPCI UTR: ${td.utr || 'UTR' + Date.now()}. 0% commission direct transfer completed.`;
        break;
      case 'ESCROW_LOCKED':
        fallbackMessage = `FarmSync Alert: Escrow locked for ₹${td.amount || '0'} (Order #${td.orderId || 'ORD-9941'}). Truck dispatch initiated to farm gate.`;
        break;
      case 'LOADING_CONFIRMED':
        fallbackMessage = `FarmSync Alert: Loading verified at farm gate! Vehicle ${td.truckReg || 'MH-15-EG-4412'} has departed for Mandi. Order #${td.orderId || 'ORD-9941'}.`;
        break;
      case 'DELIVERED':
        fallbackMessage = `FarmSync Alert: Produce delivery completed at Mandi! Direct bank settlement of ₹${td.fare || '10400'} released. Order #${td.orderId || 'ORD-9941'}.`;
        break;
      case 'ORDER_CONFIRMED_FARMER':
        fallbackMessage = `FarmSync Order Confirmed: Ram Ram ${td.farmerName || 'Ramesh Patil'}! New order #${td.orderId || 'ORD-9941'} received for ${td.quantityQtl || '50'} Qtl ${td.cropName || 'Produce'} from ${td.buyerName || 'Mandi Buyer'}. ₹${td.totalAmount || '0'} locked in Escrow. Loading PIN: ${td.farmOtp || '4821'}.`;
        break;
      case 'POST_ORDER_FARMER':
        fallbackMessage = `FarmSync Post-Order Alert: Order #${td.orderId || 'ORD-9941'} scheduled for pickup. Truck ${td.truckReg || 'MH-15-EG-4412'} (Driver: ${td.driverName || 'Suresh Kadam'}, Ph: ${td.driverPhone || '+91 98230 45612'}) is en-route. Check Loading PIN: ${td.farmOtp || '4821'}. Live GPS: farmsync.in/t/${td.orderId || 'ORD-9941'}`;
        break;
      case 'ORDER_PLACED_BUYER':
        fallbackMessage = `FarmSync Order Placed: Order #${td.orderId || 'ORD-9941'} for ${td.quantityQtl || '50'} Qtl ${td.cropName || 'Produce'} placed with farmer ${td.farmerName || 'Ramesh Patil'}. Delivery OTP: ${td.deliveryOtp || '7190'}. 0% dalali.`;
        break;
      default:
        fallbackMessage = `FarmSync Alert: Confirmation for transaction ${td.orderId || 'FS-' + Date.now()}. Direct trade verified.`;
    }
  }

  const simulatedSms: DispatchedSms = {
    id: `SMS-LOCAL-${Date.now()}`,
    senderId: 'VK-FARMSYNC',
    to: options.to,
    recipientName: options.recipientName || 'User',
    type: options.type,
    message: fallbackMessage,
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140716',
  };

  notifySmsListeners(simulatedSms);
  return simulatedSms;
}

/**
 * Fetch list of recently sent SMS messages
 */
export async function getSmsHistory(): Promise<DispatchedSms[]> {
  try {
    const res = await fetch('/api/sms-history');
    if (res.ok) {
      const data = await res.json();
      return data.history || [];
    }
  } catch (err) {
    console.warn('Could not fetch SMS history:', err);
  }
  return [];
}

/**
 * Open native SMS application on mobile devices
 */
export function openNativeSms(phone: string, text: string) {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const encodedBody = encodeURIComponent(text);
  // Universal mobile SMS URI schema
  window.location.href = `sms:${cleanPhone}?body=${encodedBody}`;
}
