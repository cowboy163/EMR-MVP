import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions';
import React from 'react'
import MemberPhotoUpload from '@/components/member/MemberPhotoUpload';
import MemberPhotos from '@/components/member/MemberPhotos';
import CardInnerWrapper from '@/components/wrappers/CardInnerWrapper';

export default async function PatientUploadPhotosPage() {
    const userId = await getAuthUserId();
    const member = await getMemberByUserId({userId: userId});
    const photos = await getMemberPhotosByUserId({ userId: userId });
    return (
        <CardInnerWrapper
            header={
                <div className='flex flex-row justify-between items-center w-full'>
                    <div
                        className='text-2xl font-semibold text-primary'
                    >
                        Edit Profile
                    </div>
                    <MemberPhotoUpload />
                </div>
            }
            body={<MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image}/>}
        />
    )
}
