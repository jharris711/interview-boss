import { Database } from '@/types/supabase';
import { type Session, type User } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import useAvatarImage from '@/hooks/useAvatarImage';

type Profile = Database['public']['Tables']['profiles']['Row'];
interface Props {
  profile?: Profile | null;
  session?: Session | null;
  user?: User | null;
}

const AvatarButton = ({ session, profile, user }: Props) => {
  const { avatar } = useAvatarImage(profile?.avatar_url ?? '');

  return (
    <div className='flex flex-row items-center justify-end gap-2'>
      <div className='hs-dropdown relative inline-flex [--placement:bottom-right]'>
        <button
          id='hs-dropdown-with-header'
          type='button'
          className='hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-xs dark:bg-gray-800 dark:hover:bg-slate-800 dark:text-gray-400 dark:hover:text-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800'
        >
          {avatar ? (
            <Image
              className='inline-block h-[2.375rem] w-[2.375rem] rounded-full ring-2 ring-white dark:ring-gray-800'
              src={avatar ?? ''}
              alt='User Avatar'
              height={2.375}
              width={2.375}
            />
          ) : (
            <span className='inline-flex rounded-full items-center justify-center h-[3.875rem] w-[3.875rem] bg-gray-600'>
              <span className='text-lg font-medium text-white leading-none'>
                {profile?.full_name
                  ? profile?.full_name[0].toUpperCase()
                  : 'BC'}
              </span>
            </span>
          )}
        </button>

        <div
          className='hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] bg-white shadow-md rounded-lg p-2 dark:bg-gray-800 dark:border dark:border-gray-700'
          aria-labelledby='hs-dropdown-with-header'
        >
          <div className='py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-gray-700'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Signed in as
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-gray-300'>
              {user?.email}
            </p>
          </div>
          <div className='mt-2 py-2 first:pt-0 last:pb-0'>
            <a
              className='flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
              href='/career-paths'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='flex-none'
                viewBox='0 0 16 16'
              >
                <path d='M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z' />
              </svg>
              Career Paths
            </a>
            <a
              className='flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
              href='/leaderboards'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='flex-none'
                viewBox='0 0 16 16'
              >
                <path d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383h1.312Z' />
              </svg>
              Leaderboards
            </a>
            <a
              className='flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
              href='/account'
            >
              <svg
                className='flex-none'
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 16 16'
              >
                <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
                <path
                  fill-rule='evenodd'
                  d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'
                />
              </svg>
              Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AvatarButton;
