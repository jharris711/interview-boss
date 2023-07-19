import SignupForm from './signup-form';

const SignupPage = () => {
  return (
    <div className='mb-64 w-full flex h-full items-center py-16 pt-10 px-4 sm:px-6 md:px-8'>
      <main className='w-full max-w-md mx-auto p-6'>
        <div className='mt-7 bg-white border border-gray-200 rounded-xl shadow-md dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-4 sm:p-7'>
            <div className='text-center'>
              <h1 className='block text-2xl font-bold text-gray-800 dark:text-white'>
                Sign up
              </h1>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?{' '}
                <a
                  className='text-green-600 decoration-2 hover:underline font-medium'
                  href='/login'
                >
                  Log in here
                </a>
              </p>
            </div>

            <div className='mt-5'>
              {/* <!-- Form --> */}
              <SignupForm />
              {/* <!-- End Form --> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
