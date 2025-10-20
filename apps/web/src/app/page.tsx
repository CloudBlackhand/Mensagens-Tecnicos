import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect para dashboard por padrão
  redirect('/dashboard');
}
