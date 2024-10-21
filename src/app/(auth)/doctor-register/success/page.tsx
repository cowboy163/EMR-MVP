'use client'

import CardWrapper from '@/components/wrappers/CardWrapper';
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa';

// 注册成功后的消息Card
export default function RegisterSuccessPage() {
    const router = useRouter();
    return (
        <CardWrapper
            headerText='You have successfully registered'
            subHeaderText='Please verify your email address before you can login'
            action={() => router.push('/doctor-login')}
            actionLabel='Go to login'
            headerIcon={FaCheckCircle}
        />
    )
}