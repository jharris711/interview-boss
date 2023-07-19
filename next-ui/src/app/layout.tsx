import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import SidebarToogle from '@/components/SidebarToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interview Boss',
  description: 'Be the best candidate ',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let { data: profile } = await supabase
    .from('profiles')
    .select(`*`)
    .eq('id', session?.user?.id)
    .single();

  return (
    <html lang='en' className='min-h-screen'>
      <body
        className={`${inter.className} bg-gray-50 dark:bg-slate-800 min-h-screen`}
      >
        <Header session={session} profile={profile} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
