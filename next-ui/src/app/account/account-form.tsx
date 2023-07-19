'use client';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import type { Database } from '@/types/supabase';
import { genUsername } from '@/utils/genUsername';
import Toast from '@/components/Toast';
import useAvatarImage from '@/hooks/useAvatarImage';

type Profiles = Database['public']['Tables']['profiles']['Row'];
interface Props {
  session: Session | null;
}
interface State {
  isLoading: string;
  fullname: Profiles['full_name'];
  username: Profiles['username'];
  avatar_url: Profiles['avatar_url'];
  bio: Profiles['bio'];
  avatar: string | null;
  success: string;
  error: string;
}

const initialState: State = {
  isLoading: '',
  fullname: '',
  username: '',
  avatar_url: '',
  avatar: '',
  bio: '',
  success: '',
  error: '',
};

const AccountForm = ({ session }: Props) => {
  const [state, setState] = useState(initialState);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const defaultUsername = useMemo(() => genUsername(), []);
  const supabase = createClientComponentClient<Database>();
  const { avatar, loading: avatarLoading } = useAvatarImage(state.avatar_url);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        isLoading: 'Fetching Profile...',
      }));

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url, bio`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      setState((prevState) => {
        if (!data) return prevState;
        return {
          ...prevState,
          fullname: data.full_name,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
        };
      });
    } catch (error) {
      const err = error as Error;
      setState((prevState) => ({ ...prevState, error: err.message }));
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: '' }));
    }
  }, [user, supabase]);

  /**
   * Get profile
   */
  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;

    const formData = new FormData(ref.current);
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;
    const updated_at = new Date().toISOString();

    setState((prevState) => ({
      ...prevState,
      isLoading: 'Updating profile...',
    }));

    try {
      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: `${firstName} ${lastName}`,
        username,
        updated_at,
        bio,
        avatar_url: state.avatar_url,
      });

      if (error) throw error;

      setState((prevState) => ({
        ...prevState,
        success: 'Profile updated successfully',
      }));

      router.refresh();

      setTimeout(
        () => setState((prevState) => ({ ...prevState, success: '' })),
        3000
      );
    } catch (err) {
      const e = err as Error;
      setState((prevState) => ({ ...prevState, error: e.message }));
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: '' }));
    }
  };

  const handleAvatarUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: 'Uploading avatar...',
    }));

    try {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setState((prevState) => ({
        ...prevState,
        avatar_url: filePath,
        success: 'Avatar uploaded successfully',
      }));
    } catch (err) {
      const e = err as Error;
      setState((prevState) => ({ ...prevState, error: e.message }));
    } finally {
      setState((prevState) => ({
        ...prevState,
        isLoading: '',
      }));
    }
  };

  return (
    <>
      <Toast
        isLoading={state.isLoading}
        success={state.success}
        error={state.error}
      />
      <form ref={ref} onSubmit={handleSubmit}>
        {/* <!-- Grid --> */}
        {/* Profile Photo */}
        <div className='grid sm:grid-cols-12 gap-2 sm:gap-6'>
          <div className='sm:col-span-3'>
            <label className='inline-block text-sm text-gray-800 mt-2.5 dark:text-gray-200'>
              Profile photo
            </label>
          </div>
          <div className='sm:col-span-9'>
            <div className='flex items-center gap-5'>
              {avatar ? (
                <Image
                  className='inline-block h-16 w-16 rounded-full ring-2 ring-white dark:ring-gray-800'
                  src={avatar ?? ''}
                  alt='avatar'
                  height={16}
                  width={16}
                />
              ) : (
                <span className='inline-flex items-center justify-center h-[3.875rem] w-[3.875rem] rounded-full bg-gray-600'>
                  <span className='text-lg font-medium text-white leading-none'>
                    {state.fullname
                      ? state.fullname[0].toUpperCase()
                      : user?.email
                      ? user?.email[0].toUpperCase()
                      : 'BC'}
                  </span>
                </span>
              )}

              <div className='flex gap-x-2'>
                <div>
                  <label
                    htmlFor='upload-photo'
                    className='py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800'
                  >
                    <svg
                      className='w-3 h-3'
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 16 16'
                    >
                      <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z' />
                      <path d='M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z' />
                    </svg>
                    Upload photo
                  </label>
                  <input
                    type='file'
                    id='upload-photo'
                    className='hidden' // hide the input element visually
                    onChange={handleAvatarUpload} // handle the file selection event
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End Profile Photo */}
          {/* Full Name */}
          <div className='sm:col-span-3'>
            <label
              htmlFor='af-account-full-name'
              className='inline-block text-sm text-gray-800 mt-2.5 dark:text-gray-200'
            >
              Full name
            </label>
          </div>
          <div className='sm:col-span-9'>
            <div className='sm:flex'>
              <input
                id='af-account-full-name'
                type='text'
                name='first-name'
                className='py-2 px-3 pr-11 block w-full border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-l-lg sm:mt-0 sm:first:ml-0 sm:first:rounded-tr-none sm:last:rounded-bl-none sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400'
                placeholder='First Name'
                defaultValue={state.fullname?.split(' ')[0]}
              />
              <input
                type='text'
                name='last-name'
                className='py-2 px-3 pr-11 block w-full border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-l-lg sm:mt-0 sm:first:ml-0 sm:first:rounded-tr-none sm:last:rounded-bl-none sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400'
                placeholder='Last Name'
                defaultValue={state.fullname?.split(' ')[1]}
              />
            </div>
          </div>
          {/* <!-- End Full Name --> */}
          {/* Email */}
          <div className='sm:col-span-3'>
            <label
              htmlFor='af-account-username'
              className='inline-block text-sm text-gray-800 mt-2.5 dark:text-gray-200'
            >
              Username
            </label>
          </div>
          <div className='sm:col-span-9'>
            <input
              id='af-account-username'
              type='text'
              name='username'
              className='py-2 px-3 pr-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400'
              placeholder='UsernamexXx_69420_xXx'
              defaultValue={state.username ?? defaultUsername}
            />
          </div>
          {/* <!-- End Email --> */}
          {/* Password */}
          {/*  <div className='sm:col-span-3'>
          <label
            htmlFor='af-account-password'
            className='inline-block text-sm text-gray-800 mt-2.5 dark:text-gray-200'
          >
            Password
          </label>
        </div>
        <div className='sm:col-span-9'>
          <div className='space-y-2'>
            <input
              id='af-account-password'
              type='password'
              className='py-2 px-3 pr-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400'
              placeholder='Enter current password'
            />
            <input
              type='password'
              className='py-2 px-3 pr-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400'
              placeholder='Enter new password'
            />
          </div>
        </div> */}
          {/* <!-- End Password --> */}

          <div className='sm:col-span-3'>
            <label
              htmlFor='af-account-bio'
              className='inline-block text-sm text-gray-800 mt-2.5 dark:text-gray-200'
            >
              BIO
            </label>
          </div>
          {/* <!-- End Col --> */}
          <div className='sm:col-span-9'>
            <textarea
              id='af-account-bio'
              name='bio'
              className='py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400'
              rows={6}
              placeholder='What is your favorite location to visit?'
              defaultValue={state.bio ?? ''}
            ></textarea>
          </div>
          {/* <!-- End Col --> */}
        </div>
        {/* <!-- End Grid --> */}

        <div className='mt-5 flex justify-end gap-x-2'>
          <button
            type='submit'
            className='py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'
          >
            Save changes
          </button>
        </div>
      </form>
    </>
  );
};

export default AccountForm;
