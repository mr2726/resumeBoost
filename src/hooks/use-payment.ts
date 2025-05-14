import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from './use-toast';

export type PaymentStatus = 'idle' | 'loading' | 'completed' | 'cancelled' | 'error';

export function usePayment() {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment_status');
    if (paymentStatus === 'success') {
      setStatus('completed');
      toast({ title: 'Payment successful', description: 'Thank you for your purchase!' });
    } else if (paymentStatus === 'cancelled') {
      setStatus('cancelled');
      toast({ title: 'Payment cancelled', description: 'You can try again anytime.' });
    }
  }, [searchParams, toast]);

  return { status };
}
