import ResumeForm from "@/components/resume/ResumeForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CreateResumePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Create Your Perfect Resume</h1>
        <p className="text-muted-foreground text-lg">
          Fill in the details below, and let our AI craft a resume tailored to your dream job.
        </p>
      </header>
      
      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Input Your Details</CardTitle>
          <CardDescription>Provide the job vacancy and a brief description of yourself.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeForm />
        </CardContent>
      </Card>
    </div>
  );
}
