import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Resume Download',
              description: 'AI-generated resume download',
            },
            unit_amount: 100, // $1.00
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/final?payment_status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/preview?payment_status=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return new NextResponse('Stripe session error', { status: 500 });
  }
}
