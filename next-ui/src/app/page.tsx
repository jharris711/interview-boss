import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const Home = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main id='content' role='main' className='flex justify-center py-72'>
      <div className='text-center py-10 px-4 sm:px-6 lg:px-8'>
        <h1 className='block text-2xl font-bold dark:text-white text-gray-800 sm:text-4xl'>
          Interview Boss
        </h1>
        <p className='mt-3 text-lg dark:text-gray-300 text-gray-600'>
          Compete against other candidates to prove you are the best candidate
          for the job and take your place on the World Leaderboard
        </p>
        <div className='mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3'>
          <a
            className='w-full sm:w-auto inline-flex justify-center items-center gap-x-3.5 text-center bg-green-500 shadow-sm text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition py-3 px-4 text-white'
            href={session ? '/account' : '/signup'}
          >
            Prove your worth
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-3.5 h-3.5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.25 4.5l7.5 7.5-7.5 7.5'
              />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
};

export default Home;
