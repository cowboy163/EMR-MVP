import LoginForm from '@/components/forms/LoginForm'
import CardWrapper from '@/components/wrappers/CardWrapper'
import React from 'react'
import { GiPadlock } from 'react-icons/gi'

export default function LoginCard() {
    return (
        <CardWrapper
            headerText='Login'
            subHeaderText='Welcome back to Noqclinic'
            headerIcon={GiPadlock}
            body={<LoginForm />}
        />
    )
}