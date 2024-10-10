import { getMemberDoctorByUserId } from '@/app/actions/patientActions';
import CardInnerWrapper from '@/components/CardInnerWrapper';
import { notFound } from 'next/navigation'
import React from 'react'

export default async function MemberDetailedPage({ params }: { params: { userId: string } }) {
    const doctor = await getMemberDoctorByUserId(params.userId)
    if (!doctor) return notFound();
    return (
        <CardInnerWrapper
            header={'Profile'}
            body={<div>{doctor.description}</div>}
        />
    )
}