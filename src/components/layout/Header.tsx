import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold font-mono">
          ResumeBoost
        </Link>
        <nav>
          {/* For future use with authentication */}
          {/* <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            Sign In
          </Button> */}
        </nav>
      </div>
    </header>
  );
}
