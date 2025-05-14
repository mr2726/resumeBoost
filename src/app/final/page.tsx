// @ts-nocheck
"use client";

import ResumeDisplay from "@/components/resume/ResumeDisplay";
import { Button } from "@/components/ui/button";
import { useResume } from "@/contexts/ResumeContext";
import { ArrowLeft, Download, FilePlus2, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { prepareHtmlForDownload, createPaymentIntent } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

const getStripePromise = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (publishableKey) {
      stripePromise = loadStripe(publishableKey);
    } else {
        console.error("Stripe publishable key is not set in .env file.");
    }
  }
  return stripePromise;
};

const StripePaymentForm = ({ clientSecret, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      toast({ title: "Stripe Error", description: "Stripe.js has not loaded yet.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (paymentMethodError) {
        setError(paymentMethodError.message);
        toast({ title: "Payment Error", description: paymentMethodError.message, variant: "destructive" });
        setIsProcessing(false);
        if (onPaymentError) onPaymentError(paymentMethodError.message);
        return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
      toast({ title: "Payment Confirmation Error", description: confirmError.message, variant: "destructive" });
      if (onPaymentError) onPaymentError(confirmError.message);
    } else if (paymentIntent?.status === 'succeeded') {
      toast({ title: "Payment Successful!", description: "Your downloads are now unlocked." });
      if (onPaymentSuccess) onPaymentSuccess();
    } else {
      setError("Payment failed. Status: " + paymentIntent?.status);
      toast({ title: "Payment Failed", description: `Status: ${paymentIntent?.status}`, variant: "destructive" });
      if (onPaymentError) onPaymentError(`Payment failed. Status: ${paymentIntent?.status}`);
    }

    setIsProcessing(false);
  };
  
  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Open Sans", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
      <div className="p-3 border rounded-md">
        <CardElement options={cardElementOptions} />
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg py-3 px-6"
      >
        {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
        Pay $1.00
      </Button>
    </form>
  );
};


export default function FinalResumePage() {
  const { resumeData, isLoading: contextLoading, error: contextError, setResumeData, setIsLoading, setError } = useResume();
  const router = useRouter();
  const { toast } = useToast();

  const [isDownloadingHtml, setIsDownloadingHtml] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false); 
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const SuspendedSearchParams = () => {
    const searchParams = useSearchParams();
    return searchParams;
  };

  const searchParams = SuspendedSearchParams();

  // Check if payment was completed via localStorage, e.g. after a page refresh
  useEffect(() => {
    if (sessionStorage.getItem('paymentCompleted') === 'true') {
      setPaymentCompleted(true);
    }
  }, []);


  useEffect(() => {
    // If not paid and no client secret yet, fetch one
    if (!paymentCompleted && !clientSecret && resumeData) { // ensure resumeData exists before attempting payment
      createPaymentIntent().then(res => {
        if (res.clientSecret) {
          setClientSecret(res.clientSecret);
        } else {
          setStripeError(res.error || "Failed to initialize payment.");
          toast({ title: "Payment Setup Error", description: res.error || "Could not initialize payment.", variant: "destructive"});
        }
      });
    }
  }, [paymentCompleted, clientSecret, resumeData, toast]);


  useEffect(() => {
    if (!contextLoading && !resumeData && !contextError) {
      // Only redirect if there's truly no data and no error from context.
      // Avoid redirecting if we are just waiting for clientSecret or Stripe to load.
      const hasNecessaryStripeVars = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; // Only check for publishable key here
      if (!hasNecessaryStripeVars && !paymentCompleted) {
        // If Stripe isn't configured and payment isn't done, it's likely stuck.
      } else if (!resumeData) {
         router.replace("/create");
      }
    }
  }, [resumeData, contextLoading, contextError, router, paymentCompleted]);

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    sessionStorage.setItem('paymentCompleted', 'true'); // Persist for refresh
  };

  const handlePaymentError = (errorMessage: string) => {
    // Error is already toasted by StripePaymentForm
    console.error("Payment error:", errorMessage);
  }

  const handleDownloadHtml = async () => {
    if (!resumeData) return;
    setIsDownloadingHtml(true);
    const result = await prepareHtmlForDownload(resumeData);
    setIsDownloadingHtml(false);

    if (result.htmlContent) {
      const blob = new Blob([result.htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'resume.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast({ title: "Success", description: "HTML resume downloaded." });
    } else {
      toast({ title: "Error", description: result.error || "Failed to download HTML.", variant: "destructive" });
    }
  };
  
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    toast({
      title: "PDF Download (Demo)",
      description: "PDF generation is a complex feature. For this demo, HTML will be downloaded instead.",
      variant: "default",
    });
    await handleDownloadHtml(); 
    setIsDownloadingPdf(false);
  };

  const handleStartOver = () => {
    setResumeData(null);
    setIsLoading(false);
    setError(null);
    sessionStorage.removeItem('paymentCompleted'); // Clear payment status
    router.push("/create");
  };

  if (contextLoading) {
     return <div className="text-center py-20"><Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" /> <p className="mt-4 text-lg">Loading Final Resume...</p></div>;
  }

  if (contextError) {
    return (
       <div className="text-center py-20 max-w-md mx-auto">
        <Card className="border-destructive shadow-lg">
            <CardHeader>
                <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                <CardDescription>{contextError}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleStartOver} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!resumeData) {
    // Fallback if somehow no resume data, and not loading/error.
    return <div className="text-center py-20"><p>No resume data found. Please <Link href="/create" className="underline text-accent">start over</Link>.</p></div>;
  }

  const isStripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <Suspense fallback={<div className='text-center py-20'><Loader2 className='mx-auto h-12 w-12 animate-spin text-accent' /> <p className='mt-4 text-lg'>Loading...</p></div>}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Your Resume is Ready!</h1>
          <p className="text-muted-foreground text-lg mt-2">
            {paymentCompleted 
              ? "You can now download your professionally crafted resume."
              : "Please complete the $1 payment to download your resume."}
          </p>
        </header>

        {resumeData && <ResumeDisplay resumeData={resumeData} isPreview={!paymentCompleted} />}

        {!paymentCompleted ? (
          <div className="mt-10 text-center max-w-md mx-auto">
            {!isStripeConfigured ? (
              <p className="my-4 text-sm text-red-500">Payment system not configured. Admin: please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env</p>
            ) : stripeError ? (
              <p className="my-4 text-sm text-red-500">Error initializing payment: {stripeError}</p>
            ) : clientSecret ? (
              <Elements stripe={getStripePromise()} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <StripePaymentForm 
                  clientSecret={clientSecret} 
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </Elements>
            ) : (
              <div className="text-center py-10"><Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" /> <p className="mt-2 text-sm">Initializing payment...</p></div>
            )}
          </div>
        ) : (
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              size="lg" 
              onClick={handleDownloadHtml} 
              disabled={isDownloadingHtml}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              {isDownloadingHtml ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Download className="mr-2 h-5 w-5" />}
              Download HTML
            </Button>
            <Button 
              size="lg" 
              onClick={handleDownloadPdf} 
              disabled={isDownloadingPdf}
              variant="secondary" 
              className="rounded-lg shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              {isDownloadingPdf ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Download className="mr-2 h-5 w-5" />}
              Download PDF (Demo)
            </Button>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button
              onClick={handleStartOver}
              variant="outline"
              size="lg"
              className="rounded-lg text-primary border-primary hover:bg-primary/5 w-full sm:w-auto"
          >
              <FilePlus2 className="mr-2 h-5 w-5" /> Start New Resume
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
