import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import React from 'react'
import { notFound } from 'next/navigation';
import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId } from '@/app/actions/memberActions';
import MemberEditForm from '@/components/forms/MemberEditForm';

export default async function PatientEditPage() {
    const userId = await getAuthUserId();
    const member = await getMemberByUserId({userId});
    if (!member) return notFound();
    return (
        <>
            <CardHeader className='text-2xl font-semibold text-primary'>
                Edit Profile
            </CardHeader>
            <Divider />
            <CardBody>
                <MemberEditForm member={member} />
            </CardBody>
        </>
    )
}
