import { redirect } from 'next/navigation';

export default function AdminIndex() {
  // Redirect root /admin directly to the CRM clients page
  redirect('/admin/clients');
}
