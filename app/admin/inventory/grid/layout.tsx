import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Grid',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
