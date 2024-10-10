'use client'
import { RoleType } from '@/app/actions/authActions'
import { toggleLikeMember } from '@/app/actions/likeActions'
import LikeButton from '@/components/LikeButton'
import { calculateAge, getBaseLinkBasedOnRolePlatform } from '@/lib/util'
import { Card, CardFooter, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
    member: Member,
    likeIds: string[],
    rolePlatform: RoleType
}

// export const getLinkBasedOnRolePlatform = (userId:string, rolePlatform:RoleType) => {
//     if(rolePlatform === 'PATIENT') {
//         return `/portal/doctors/${userId}`
//     }
//     if(rolePlatform === 'DOCTOR') {
//         return `/doctor-portal/patients/${userId}`
//     }
// }

export default function MemberCard({ member, likeIds, rolePlatform }: Props) {
    const [hasLiked, setHasLiked] = useState(likeIds?.includes(member.userId));
    // const [loading, setLoading] = useState(false);

    const baseLink = getBaseLinkBasedOnRolePlatform(rolePlatform);
    const getLink = () => {
        if (rolePlatform === 'PATIENT') return `${baseLink}/doctors/${member.userId}`;
        if (rolePlatform === 'DOCTOR') return `${baseLink}/members/${member.userId}`;
    }

    async function toggleLike() {
        try {
            // setLoading(true);
            await toggleLikeMember(member.userId, hasLiked);
            setHasLiked(!hasLiked)
        } catch (error) {
            console.log(error)
        } finally {
            // setLoading(false);
        }
    }

    const preventLinkAction = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <Card
            fullWidth
            as={Link}
            href={getLink()}
            isPressable
        >
            <Image
                isZoomed
                alt={member.name}
                width={300}
                src={member.image || '/images/user.png'}
                className='aspect-square object-cover'
            />
            <div
                className='absolute top-3 right-3 z-50'
                onClick={preventLinkAction}
            >
                <LikeButton toggleLike={toggleLike} hasLiked={hasLiked} />
            </div>
            <CardFooter className='flex justify-start overflow-hidden absolute bottom-0 z-10 bg-dark-gradient'>
                <div className='flex flex-col text-white'>
                    <span className='font-semibold'>{member.name}, {calculateAge(member.dateOfBirth)}</span>
                    <span className='text-sm'>{member.city}</span>
                </div>
            </CardFooter>
        </Card>
    )
}