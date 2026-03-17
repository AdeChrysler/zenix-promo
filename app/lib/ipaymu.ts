import crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const QRCode = require('qrcode');

interface IPaymuConfig {
  va: string;
  apiKey: string;
  isProduction: boolean;
}

function getConfig(): IPaymuConfig {
  return {
    va: process.env.IPAYMU_VA || '',
    apiKey: process.env.IPAYMU_API_KEY || '',
    isProduction: process.env.IPAYMU_IS_PRODUCTION === 'true',
  };
}

function getBaseUrl(isProduction: boolean): string {
  return isProduction ? 'https://my.ipaymu.com' : 'https://sandbox.ipaymu.com';
}

function generateSignature(jsonBody: string, config: IPaymuConfig): string {
  const bodyHash = crypto.createHash('sha256').update(jsonBody).digest('hex').toLowerCase();
  const stringToSign = `POST:${config.va}:${bodyHash}:${config.apiKey}`;
  return crypto.createHmac('sha256', config.apiKey).update(stringToSign).digest('hex');
}

export async function createPayment(params: {
  referenceId: string;
  amount: number;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: string;
  paymentChannel: string;
  notifyUrl: string;
  returnUrl: string;
}) {
  const config = getConfig();
  const baseUrl = getBaseUrl(config.isProduction);

  const bodyObj = {
    name: params.buyerName,
    phone: params.buyerPhone || '081200000000',
    email: params.buyerEmail,
    amount: params.amount,
    comments: params.productName,
    description: params.productName,
    referenceId: params.referenceId,
    paymentMethod: params.paymentMethod,
    paymentChannel: params.paymentChannel,
    notifyUrl: params.notifyUrl,
    returnUrl: params.returnUrl,
    product: [params.productName],
    qty: [1],
    price: [params.amount],
  };

  const bodyString = JSON.stringify(bodyObj);
  const signature = generateSignature(bodyString, config);
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

  const response = await fetch(`${baseUrl}/api/v2/payment/direct`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      va: config.va,
      signature,
      timestamp,
    },
    body: bodyString,
  });

  const data = await response.json();

  console.log('[ipaymu] Full response:', JSON.stringify(data, null, 2));

  if (!response.ok || data.Status !== 200) {
    throw new Error(data.Message || 'Payment creation failed');
  }

  // For QRIS: generate QR code image server-side from the raw QRIS string
  let qrDataUrl: string | null = null;
  const qrisRawString = data.Data.QrString || data.Data.PaymentNo;
  if (params.paymentMethod === 'qris' && qrisRawString && qrisRawString.length > 30) {
    try {
      qrDataUrl = await QRCode.toDataURL(qrisRawString, { width: 300, margin: 2 }) as string;
      console.log('[ipaymu] Generated QR data URL, length:', qrDataUrl?.length);
    } catch (qrErr) {
      console.error('[ipaymu] QR generation failed:', qrErr);
    }
  }

  return {
    transactionId: data.Data.TransactionId,
    paymentNo: data.Data.PaymentNo,
    paymentName: data.Data.PaymentName,
    expired: data.Data.Expired,
    qrisUrl: qrDataUrl || null, // always use server-generated QR (iPaymu returns HTML pages, not images)
    qrString: data.Data.QrString || null,
    total: data.Data.Total,
  };
}
