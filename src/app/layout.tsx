import type { Metadata } from 'next';
import './globals.css';
import ConfigureAmplifyClientSide from '@/components/ConfigureAmplify';
import { Providers } from '@/components/Providers';
import { Nav } from '@/components/Nav';

export const metadata: Metadata = {
  title: 'BayLearn',
  description: 'BayAreaLa8s learning platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConfigureAmplifyClientSide />
          <Nav />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
