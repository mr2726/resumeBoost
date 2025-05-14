import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import StaticResumePreview from '@/components/landing/StaticResumePreview'; // New component
import type { GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';

const exampleResumeData: GenerateResumeContentOutput = {
  name: "Alex Johnson",
  contact: {
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/alexjohnson",
  },
  aboutMe: "Dedicated Front-End Developer with a strong background in creating user-friendly web applications. Skilled in React.js and JavaScript, with a passion for delivering seamless user experiences. Adept at collaborating with cross-functional teams to meet project goals and deadlines.",
  skills: [
    "React.js",
    "JavaScript",
    "CSS",
    "Agile Methodologies",
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "French", proficiency: "Intermediate" },
  ],
  workExperience: [
    {
      jobTitle: "Front-End Developer",
      company: "Tech Innovations",
      dates: "2023-2025",
      duties: [
        "Developed responsive web applications using React.js and JavaScript.",
        "Collaborated with designers to implement UI/UX designs.",
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-8">
        {/* Left Column: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[var(--font-montserrat)] text-foreground">
            Craft a Winning Resume in Minutes for $1
          </h1>
          <p className="text-lg text-muted-foreground">
            Create a tailored resume in minutes with AI. Perfect for any job application.
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              Get Started
              <FileText className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Right Column: Example Resume */}
        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end items-center mt-10 lg:mt-0">
          <StaticResumePreview resumeData={exampleResumeData} />
        </div>
      </div>
    </section>
  );
}
