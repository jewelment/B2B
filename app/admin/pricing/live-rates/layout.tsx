import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Price Master',
};

export default function PricingLiveRatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
