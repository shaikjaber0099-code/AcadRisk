import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'AcadRisk | Transparent Student Performance Prediction & Academic Risk Analysis',
  description:
    'AI-based, explainable, rule-based student performance prediction and early academic risk detection system using verifiable mathematics and Ordinary Least Squares trend projection.',
  keywords: [
    'Student Performance Prediction',
    'Academic Risk Analysis',
    'Early Warning System',
    'Higher Education Analytics',
    'Explainable AI in Education',
  ],
  authors: [{ name: 'Office of Academic Affairs' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Normal Clean Standard Typography: Inter + JetBrains Mono */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-white selection:text-black">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1 w-full bg-black">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
