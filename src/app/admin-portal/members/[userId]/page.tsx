import { getMemberByUserId } from '@/app/actions/memberActions';
import MemberEditForm from '@/components/forms/MemberEditForm';
import CardInnerWrapper from '@/components/wrappers/CardInnerWrapper';
import { notFound } from 'next/navigation'
import React from 'react'

export default async function MemberDetailedPage({ params }: { params: { userId: string } }) {
    const member = await getMemberByUserId({ userId: params.userId });
    if (!member) return notFound();
    return (
        <CardInnerWrapper
            header={'Edit Member'}
            body={<MemberEditForm member={member}/>}
        />
    )
}

