import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduPortal AI',
  description: 'Education Management Portal with integrated AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
