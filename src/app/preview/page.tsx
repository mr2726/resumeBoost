// @ts-nocheck
"use client";

import ResumeDisplay from "@/components/resume/ResumeDisplay";
import { Button } from "@/components/ui/button";
import { useResume } from "@/contexts/ResumeContext";
import { ArrowLeft, CheckCircle, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PreviewResumePage() {
  const { resumeData, isLoading, error } = useResume();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !resumeData && !error) {
      router.replace("/create");
    }
  }, [resumeData, isLoading, error, router]);

  if (isLoading) {
    return <div className="text-center py-20"><Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" /> <p className="mt-4 text-lg">Loading Preview...</p></div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <Card className="border-destructive shadow-lg">
            <CardHeader>
                <CardTitle className="text-destructive">Generation Failed</CardTitle>
                <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild variant="outline">
                    <Link href="/create">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Try Again
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!resumeData) {
    // This case should ideally be handled by the useEffect redirect, but as a fallback:
    return <div className="text-center py-20"><p>No resume data found. Please <Link href="/create" className="underline text-accent">start over</Link>.</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Resume Preview</h1>
        <p className="text-muted-foreground text-lg mt-2">
          Here's your AI-generated resume. Review it and then finalize to download.
        </p>
      </header>

      <ResumeDisplay resumeData={resumeData} isPreview={true} />

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" size="lg" asChild className="rounded-lg border-primary text-primary hover:bg-primary/5">
          <Link href="/create">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Edit
          </Link>
        </Button>
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-md hover:shadow-lg">
          <Link href="/final">
            Finalize & Download <CheckCircle className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
