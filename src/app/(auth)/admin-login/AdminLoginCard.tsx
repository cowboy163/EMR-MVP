import LoginForm from '@/components/forms/LoginForm'
import CardWrapper from '@/components/wrappers/CardWrapper'
import React from 'react'
import { GiPadlock } from 'react-icons/gi'

export default function AdminLoginCard() {
    return (
        <CardWrapper
            headerText='Admin Login'
            subHeaderText='Welcome back to Noqclinic'
            headerIcon={GiPadlock}
            body={<LoginForm rolePlatform='ADMIN'/>}
        />
    )
}