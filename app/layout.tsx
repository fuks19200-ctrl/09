import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AccountProvider } from './components/Account';
import { CourseCartProvider } from './components/CourseCart';

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-montserrat', display: 'swap' });

export const metadata: Metadata = { title: 'MULTUM AI', description: 'Школа нейросетей' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${montserrat.variable} ${montserrat.className}`}><CourseCartProvider><AccountProvider>{children}</AccountProvider></CourseCartProvider></body></html>;
}
