import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import AccountForm from './account-form';

const AccountPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='w-full flex h-full items-center pt-4 px-4 py-36'>
      <main className='w-full mx-auto'>
        {/* <!-- Card Section --> */}
        <div className=' px-4 py-10 mx-auto'>
          {/* <!-- Card --> */}
          <div className='bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-slate-900'>
            <div className='mb-8'>
              <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200'>
                Profile
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Manage your name, password and account settings.
              </p>
            </div>

            <AccountForm session={session} />
          </div>
          {/* <!-- End Card --> */}
        </div>
        {/* <!-- End Card Section --> */}
      </main>
    </div>
  );
};

export default AccountPage;
