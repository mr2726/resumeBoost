import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} ResumeBoost. All rights reserved.</p>
        <nav className="flex gap-4 mt-4 md:mt-0">
          <Link href="/terms-of-service" className="text-sm hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="text-sm hover:text-foreground">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
