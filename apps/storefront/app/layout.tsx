import type { Metadata } from 'next';
import './globals.css';
import 'driver.js/dist/driver.css';
import { CommerceProvider } from '@/components/CommerceContext';
import { TourProvider } from '@/components/TourContext';
import { TourLauncher } from '@/components/TourLauncher';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NotificationToastContainer } from '@/components/NotificationToast';
import { BuyingAssistantButton } from '@/components/BuyingAssistantButton';

export const metadata: Metadata = {
  title: 'Cymbal Auto | UK Tyres, Autocentres & Mobile Fitting',
  description:
    'National UK tyre retailer and autocentre network in Birmingham, Bristol, and Croydon. Premium tyres, guaranteed laser wheel alignment, and certified technician fitting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#060913] text-[#f1f5f9] antialiased selection:bg-sky-500 selection:text-white" suppressHydrationWarning>
        <CommerceProvider>
          <TourProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <NotificationToastContainer />
            <BuyingAssistantButton />
            <TourLauncher />
          </TourProvider>
        </CommerceProvider>
      </body>
    </html>
  );
}

