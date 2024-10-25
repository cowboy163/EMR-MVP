import RegisterForm from '@/components/forms/RegisterForm'
import CardWrapper from '@/components/wrappers/CardWrapper'
import React from 'react'
import { GiPadlock } from 'react-icons/gi'

export default function AdminRegisterCard() {    
    return (
        <CardWrapper
            headerText='Admin Register'
            subHeaderText='Welcome to NoQclinic'
            headerIcon={GiPadlock}
            body={<RegisterForm rolePlatform='ADMIN'/>}
        />
    )
}