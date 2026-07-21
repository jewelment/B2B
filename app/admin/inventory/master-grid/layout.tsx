import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Master Grid',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
