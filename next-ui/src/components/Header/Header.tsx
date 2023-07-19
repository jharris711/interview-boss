'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import AvatarButton from './AvatarButton';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
interface Props {
  profile?: Profile | null;
  session?: Session | null;
  user?: User | null;
}

const Header = ({ session, profile, user }: Props) => {
  const pathname = usePathname();
  useEffect(() => {
    import('preline');
  }, []);

  const navLinks = [
    { name: 'Log in', href: '/login' },
    { name: 'Sign up', href: '/signup' },
  ];

  return (
    <header className='sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 dark:bg-gray-800 dark:border-gray-700'>
      <nav
        className='flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8'
        aria-label='Global'
      >
        <div className='mr-5 w-full'>
          <a
            className='flex-none text-xl font-semibold dark:text-white'
            href='/'
            aria-label='Interview Boss'
          >
            Interview Boss
          </a>
        </div>

        <div className='w-full flex items-center justify-end ml-auto sm:justify-between sm:gap-x-3 sm:order-3'>
          <div className='hidden sm:block'></div>
          <div
            id='navbar-collapse-with-animation'
            className='hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block'
          >
            <div className='flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5'>
              {session && profile ? (
                <AvatarButton session={session} profile={profile} user={user} />
              ) : (
                navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <a
                      key={link.href}
                      className={`font-medium ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-green-500 hover:underline'
                      }`}
                      href={link.href}
                    >
                      {link.name}
                    </a>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
