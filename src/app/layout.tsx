import type { Metadata } from 'next';
import { Inter, Montserrat, Open_Sans } from 'next/font/google'; // Geist was used before, spec asks for Montserrat & Open Sans
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ResumeProvider } from '@/contexts/ResumeContext';

// const geistSans = Geist({ // Replaced by Open Sans and Montserrat as per spec for resume
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({ // Replaced by Open Sans and Montserrat
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // 400 for watermark, 700 for headings
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'], // 400 for body, 600 for job titles
  variable: '--font-open-sans',
});


export const metadata: Metadata = {
  title: "Resume Boost",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${montserrat.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`} style={{fontFamily: 'var(--font-open-sans)'}}>
        <ResumeProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ResumeProvider>
      </body>
    </html>
  );
}
