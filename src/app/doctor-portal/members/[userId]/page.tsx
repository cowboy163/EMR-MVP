import { getMemberByUserId } from '@/app/actions/memberActions';
import CardInnerWrapper from '@/components/wrappers/CardInnerWrapper';
import { notFound } from 'next/navigation'
import React from 'react'

export default async function MemberDetailedPage({ params }: { params: { userId: string } }) {
    const doctor = await getMemberByUserId({userId: params.userId})
    if (!doctor) return notFound();
    return (
        <CardInnerWrapper
            header={'Profile'}
            body={<div>{doctor.description}</div>}
        />
    )
}