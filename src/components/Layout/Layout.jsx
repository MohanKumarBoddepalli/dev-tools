import React from 'react';

export default function Layout({ children }) {
  return (
      <main>
        <div className='flex max-w-6xl min-h-screen pt-[20px] mx-auto px-5 bg-white '>
          <div className='mx-auto w-full'>{children}</div>
        </div>
      </main>
  );
}
