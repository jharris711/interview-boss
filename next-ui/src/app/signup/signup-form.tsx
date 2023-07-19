'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const initialState = {
  isLoading: false,
  passwordError: '',
};

const SignupForm = () => {
  const [state, setState] = useState(initialState);
  const ref = useRef<HTMLFormElement>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    import('preline');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const formData = new FormData(ref.current);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
      setState((prevState) => ({
        ...prevState,
        passwordError: 'Passwords do not match',
      }));
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
      });
      console.log(error);

      if (error) throw error;

      console.log(data);
    } catch (err) {
      const e = err as Error;
      console.error(e.message);
    } finally {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }

    console.log(email, password, confirmPassword);
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
              className='py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
              required
              aria-describedby='email-error'
            />
            <div className='hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3'>
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
          <p className='hidden text-xs text-red-600 mt-2' id='email-error'>
            Please include a valid email address so we can get back to you
          </p>
        </div>
        {/* <!-- End Form Group --> */}

        {/*  <!-- Form Group --> */}
        <div>
          <label
            htmlFor='password'
            className='block text-sm mb-2 dark:text-white'
          >
            Password
          </label>
          <div className='relative'>
            <input
              type='password'
              id='password'
              name='password'
              autoComplete='new-password'
              className='py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
              required
              aria-describedby='password-error'
            />
            <div
              className={`${
                state.passwordError ? '' : 'hidden'
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
              state.passwordError ? '' : 'hidden'
            } text-xs text-red-600 mt-2`}
            id='password-error'
          >
            {state.passwordError}
          </p>
        </div>
        {/* <!-- End Form Group --> */}

        {/* <!-- Form Group --> */}
        <div>
          <label
            htmlFor='confirm-password'
            className='block text-sm mb-2 dark:text-white'
          >
            Confirm Password
          </label>
          <div className='relative'>
            <input
              type='password'
              id='confirm-password'
              name='confirm-password'
              autoComplete='new-password'
              className='py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
              required
              aria-describedby='confirm-password-error'
            />
            <div
              className={`${
                state.passwordError ? '' : 'hidden'
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
              state.passwordError ? '' : 'hidden'
            } text-xs text-red-600 mt-2`}
            id='password-error'
          >
            {state.passwordError}
          </p>
        </div>
        {/* <!-- End Form Group --> */}

        {/* <!-- Checkbox --> */}
        <div className='flex items-center'>
          <div className='flex'>
            <input
              type='checkbox'
              required
              className='shrink-0 mt-0.5 border-gray-200 rounded text-green-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-green-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800'
              id='terms'
            />
          </div>
          <div className='ml-3'>
            <label htmlFor='terms' className='text-sm dark:text-white'>
              I accept the{' '}
              <Link
                className='text-green-600 decoration-2 hover:underline font-medium'
                href='#'
              >
                Terms and Conditions
              </Link>
            </label>
          </div>
        </div>
        {/* <!-- End Checkbox --> */}

        <button
          type='submit'
          className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
