const STORE_SUBDOMAIN = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_SUBDOMAIN;
const VARIANT_ID = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_VARIANT_ID;

if (!STORE_SUBDOMAIN) {
  console.error('NEXT_PUBLIC_LEMONSQUEEZY_STORE_SUBDOMAIN is not set in .env');
}

if (!VARIANT_ID) {
  console.error('NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_VARIANT_ID is not set in .env');
}

export function createCheckoutUrl(customerId?: string): string {
  if (!STORE_SUBDOMAIN || !VARIANT_ID) {
    throw new Error('Lemon Squeezy configuration is missing');
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectUrl = `${baseUrl}/final?payment_status=success`;
  
  const checkoutOptions: {
    checkout: {
      product: string;
      redirectUrl: string;
      customerId?: string;
      test?: boolean;
    };
  } = {
    checkout: {
      product: VARIANT_ID,
      redirectUrl: encodeURIComponent(redirectUrl),
      test: true // Enable test mode
    },
  };

  if (customerId) {
    checkoutOptions.checkout['customerId'] = customerId;
  }

  // Add test mode parameter to the URL
  const checkoutUrl = `https://${STORE_SUBDOMAIN}.lemonsqueezy.com/buy/${VARIANT_ID}?test=1&redirect_url=${encodeURIComponent(redirectUrl)}`;
  return checkoutUrl;
}

// Helper function to validate a webhook signature
export function isValidWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = require('crypto').createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}

export type LemonSqueezyWebhookEvent = {
  meta: {
    event_name: string;
    custom_data?: any;
  };
  data: {
    id: string;
    type: string;
    attributes: {
      status: string;
      [key: string]: any;
    };
  };
};
