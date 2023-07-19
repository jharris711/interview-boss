'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const initialState = {
  isLoading: false,
  error: '',
};

const LoginForm = () => {
  const [state, setState] = useState(initialState);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    import('preline');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    const formData = new FormData(ref.current);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setState((prevState) => ({ ...prevState, isLoading: true }));

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.refresh();
      router.push('/account');
    } catch (err) {
      const e = err as Error;
      setState((prevState) => ({ ...prevState, error: e.message }));
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <div className='grid gap-y-4'>
        {/* <!-- Form Group --> */}
        <div>
          <label htmlFor='email' className='block text-sm mb-2 dark:text-white'>
            Email address
          </label>
          <div className='relative'>
            <input
              type='email'
              id='email'
              name='email'
              autoComplete='email'
              className='py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
              required
              aria-describedby='email-error'
            />
            <div
              className={`${
                state.error ? '' : 'hidden'
              } absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3`}
            >
              <svg
                className='h-5 w-5 text-red-500'
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 16 16'
                aria-hidden='true'
              >
                <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
              </svg>
            </div>
          </div>
          <p
            className={`${
              state.error ? '' : 'hidden'
            } text-xs text-red-600 mt-2`}
            id='email-error'
          >
            {state.error}
          </p>
        </div>
        {/*  <!-- End Form Group --> */}

        {/* <!-- Form Group --> */}
        <div>
          <div className='flex justify-between items-center'>
            <label
              htmlFor='password'
              className='block text-sm mb-2 dark:text-white'
            >
              Password
            </label>
            <a
              className='text-sm text-green-500 decoration-2 hover:underline font-medium'
              href='/'
            >
              Forgot password?
            </a>
          </div>
          <div className='relative'>
            <input
              type='password'
              id='password'
              name='password'
              autoComplete='current-password'
              className='py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
              required
              aria-describedby='password-error'
            />
            <div
              className={`${
                state.error ? '' : 'hidden'
              } absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3`}
            >
              <svg
                className='h-5 w-5 text-red-500'
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 16 16'
                aria-hidden='true'
              >
                <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
              </svg>
            </div>
          </div>
          <p
            className={`${
              state.error ? '' : 'hidden'
            } text-xs text-red-600 mt-2`}
            id='email-error'
          >
            {state.error}
          </p>
        </div>
        {/* <!-- End Form Group --> */}

        {/* <!-- Checkbox --> */}
        <div className='flex items-center'>
          <div className='flex'>
            <input
              type='checkbox'
              className='shrink-0 mt-0.5 border-gray-200 rounded text-green-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-green-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800'
              id='terms'
            />
          </div>
          <div className='ml-3'>
            <label htmlFor='terms' className='text-sm dark:text-white'>
              Remember me
            </label>
          </div>
        </div>
        {/* <!-- End Checkbox --> */}

        <button
          type='submit'
          className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'
        >
          Log in
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
