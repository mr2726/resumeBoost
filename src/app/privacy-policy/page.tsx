// @ts-nocheck
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            At ResumeBoost, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your information.
          </p>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="mb-4">
            We may collect personal information such as your name, email address, and payment details when you use our services.
          </p>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p className="mb-4">
            Your information is used to provide and improve our services, process payments, and communicate with you.
          </p>
          <h2 className="text-xl font-semibold mb-2">3. Sharing Your Information</h2>
          <p className="mb-4">
            We do not share your personal information with third parties except as necessary to provide our services or as required by law.
          </p>
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your information from unauthorized access, alteration, or disclosure.
          </p>
          <h2 className="text-xl font-semibold mb-2">5. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. Your continued use of our services indicates your acceptance of the updated policy.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at support@resumeboost.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
