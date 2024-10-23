import { getMemberPhotosByUserId } from '@/app/actions/memberActions'
import MemberPhotos from '@/components/member/MemberPhotos'
import CardInnerWrapper from '@/components/wrappers/CardInnerWrapper'
import React from 'react'

export default async function PhotosPage({ params }: { params: { userId: string } }) {
    const photos = await getMemberPhotosByUserId({ userId: params.userId, role: 'DOCTOR' })
    return (
        <CardInnerWrapper
            header={'Photos'}
            body={
                <MemberPhotos photos={photos} />
            }
        />
    )
}
