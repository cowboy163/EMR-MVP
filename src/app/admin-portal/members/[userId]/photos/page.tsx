import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions';
import MemberPhotos from '@/components/member/MemberPhotos';
import MemberPhotoUpload from '@/components/member/MemberPhotoUpload';
import CardInnerWrapper from '@/components/wrappers/CardInnerWrapper';
import React from 'react'

export default async function AdminEditMemberPhotoPage({ params }: { params: { userId: string } }) {
    const member = await getMemberByUserId({ userId: params.userId });
    const photos = await getMemberPhotosByUserId({ userId: params.userId });
    return (
        <CardInnerWrapper
            header={
                <div className='flex flex-row justify-between items-center w-full'>
                    <div
                        className='text-2xl font-semibold text-primary'
                    >
                        Edit Photos
                    </div>
                    <MemberPhotoUpload targetId={params.userId} />
                </div>
            }
            body={<MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} targetId={params.userId}/>}
        />
    )
}
