import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <ToastContainer position='bottom-left' hideProgressBar className='z-50' />
        {children}
      </NextUIProvider>
    </SessionProvider>
  )
}