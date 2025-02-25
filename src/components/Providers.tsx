'use client'
import { getUnreadMessageCount } from '@/app/actions/messageActions'
import { useNotificationChannel } from '@/hooks/useNotificationChannel'
import { usePresenceChannel } from '@/hooks/usePresenceChannel'
import { messageSlice, useDispatch } from '@/lib/redux'
import { RoleType } from '@/types/constantsType'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Providers({ children, userId, role, profileComplete }: { children: ReactNode, userId: string | null, role: RoleType | null, profileComplete: boolean }) {
  // use ref to avoid double trigger in restrict mode
  const isUnreadCountSet = useRef(false);
  const dispatch = useDispatch();

  // use userId to verify use presence channel or not to avoid 401 error
  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, role, profileComplete);

  const setUnreadCount = useCallback((amount: number) => {
    dispatch(messageSlice.actions.updateUnreadCount(amount))
  }, [dispatch])

  useEffect(() => {
    if(!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then((count) => {
        setUnreadCount(count)
      });
      isUnreadCountSet.current = true;
    }
  }, [setUnreadCount, userId])
  
  return (
    <SessionProvider>
      <NextUIProvider>
        <ToastContainer position='bottom-left' hideProgressBar className='z-50' />
        {children}
      </NextUIProvider>
    </SessionProvider>
  )
}