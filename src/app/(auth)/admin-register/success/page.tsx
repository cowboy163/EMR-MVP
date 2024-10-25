'use client'

import CardWrapper from '@/components/wrappers/CardWrapper';
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa';

export default function AdminRegisterSuccessPage() {
    const router = useRouter();
    return (
        <CardWrapper
            headerText='Admin account create successfully'
            subHeaderText='Please verify your email address before you can login'
            action={() => router.push('/admin-login')}
            actionLabel='Go to login'
            headerIcon={FaCheckCircle}
        />
    )
}