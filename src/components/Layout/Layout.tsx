import { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 lg:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};