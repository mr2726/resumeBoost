// @ts-nocheck
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Welcome to ResumeBoost! By using our services, you agree to the following terms and conditions. Please read them carefully.
          </p>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
          </p>
          <h2 className="text-xl font-semibold mb-2">2. Use of Services</h2>
          <p className="mb-4">
            You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for all activities conducted under your account.
          </p>
          <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
          <p className="mb-4">
            All content on this website, including text, graphics, logos, and software, is the property of ResumeBoost or its licensors and is protected by copyright laws.
          </p>
          <h2 className="text-xl font-semibold mb-2">4. Termination</h2>
          <p className="mb-4">
            We reserve the right to terminate or suspend your access to our services at any time, without notice, for conduct that we believe violates these terms.
          </p>
          <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
          <p className="mb-4">
            We may update these terms from time to time. Your continued use of our services after any changes indicates your acceptance of the new terms.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us at support@resumeboost.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
