import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

declare global {
  interface Window {
    createLemonSqueezy: () => {
      Setup: ({ eventHandler }: { eventHandler: (event: any) => void }) => void;
      Url: {
        Open: (url: string) => void;
      };
    };
  }
}

interface CheckoutFormProps {
  checkoutUrl: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutForm({ checkoutUrl, onSuccess, onCancel }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Lemon Squeezy script
    const script = document.createElement('script');
    script.src = 'https://assets.lemonsqueezy.com/lemon.js';
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Lemon Squeezy
      const lemonSqueezy = window.createLemonSqueezy();
      
      lemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event.event === 'checkout:loaded') {
            setIsLoading(false);
          }
          if (event.event === 'checkout:completed') {
            onSuccess?.();
          }
          if (event.event === 'checkout:closed') {
            setIsLoading(false);
            if (!event.data.success) {
              onCancel?.();
            }
          }
        },
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onSuccess, onCancel]);

  const handleCheckout = () => {
    setIsLoading(true);
    if (window.createLemonSqueezy) {
      const lemonSqueezy = window.createLemonSqueezy();
      lemonSqueezy.Url.Open(checkoutUrl);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Unlock Full Access</CardTitle>
        <CardDescription>
          Get instant access to download your resume in multiple formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="bg-green-500 p-1 rounded-full mr-2">✓</span>
                HTML Export
              </div>
              <div className="flex items-center">
                <span className="bg-green-500 p-1 rounded-full mr-2">✓</span>
                PDF Export
              </div>
              <div className="flex items-center">
                <span className="bg-green-500 p-1 rounded-full mr-2">✓</span>
                Lifetime Access
              </div>
              <div className="flex items-center">
                <span className="bg-green-500 p-1 rounded-full mr-2">✓</span>
                Money-back Guarantee
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>$1.00 USD</span>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay Now
                  <CreditCard className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Secure payment via Lemon Squeezy 🍋
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
