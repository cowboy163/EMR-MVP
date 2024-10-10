import { getMemberByUserId } from '@/app/actions/doctorActions';
import CardInnerWrapper from '@/components/CardInnerWrapper';
import { notFound } from 'next/navigation'
import React from 'react'

export default async function MemberDetailedPage({ params }: { params: { userId: string } }) {
    const doctor = await getMemberByUserId(params.userId)
    if (!doctor) return notFound();
    return (
        <CardInnerWrapper
            header={'Profile'}
            body={<div>{doctor.description}</div>}
        />
    )
}