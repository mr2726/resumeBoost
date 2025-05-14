import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

export function StripeCheckoutButton({ email }: { email?: string }) {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/stripe/checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      const data = await res.json();
      window.location.href = data.url;
    } else {
      alert('Failed to start payment.');
    }
    setLoading(false);
  };

  return (
    <Button
      className="w-full bg-green-600 hover:bg-green-700"
      onClick={handleStripeCheckout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          Pay with Card <CreditCard className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}
