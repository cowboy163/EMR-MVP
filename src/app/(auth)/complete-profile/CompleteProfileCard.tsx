import { auth } from '@/auth';
import CompleteProfileForm from '@/components/forms/CompleteProfileForm';
import CardWrapper from '@/components/wrappers/CardWrapper'
import React from 'react'
import { GiPadlock } from 'react-icons/gi'

export default async function CompleteProfileCard() {  
    const session = await auth();
    const role = session?.user.role;
    if (!role) return null;  
    return (
        <CardWrapper
            headerText='Complete Profile'
            subHeaderText='Welcome to Noqclinic! Please complete your profile to get started and experience a whole new way of life'
            headerIcon={GiPadlock}
            body={<CompleteProfileForm rolePlatform={role}/>}
        />
    )
}