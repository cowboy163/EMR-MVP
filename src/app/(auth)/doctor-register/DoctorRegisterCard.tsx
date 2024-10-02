import CardWrapper from '@/components/CardWrapper'
import RegisterForm from '@/components/forms/RegisterForm'
import React from 'react'
import { GiPadlock } from 'react-icons/gi'

export default function DoctorRegisterCard() {    
    return (
        <CardWrapper
            headerText='Doctor Register'
            subHeaderText='Welcome to NoQclinic'
            headerIcon={GiPadlock}
            body={<RegisterForm rolePlatform='DOCTOR'/>}
        />
    )
}