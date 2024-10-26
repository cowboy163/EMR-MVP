'use client'
import { toggleLikeMember } from '@/app/actions/likeActions'
import { calculateAge, getMemberLinkBasedOnRolePlatform, transformImageUrl } from '@/lib/util'
import { Card, CardFooter, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'
import Link from 'next/link'
import React, { ReactNode, useState } from 'react'
import LikeButton from '../buttons/LikeButton'
import PresenceDot from '../presence/PresenceDot'
import { RoleType } from '@/types/constantsType'

type Props = {
    member: Member,
    likeIds: string[],
    rolePlatform: RoleType,
    customizedButton?: ReactNode
}

export default function MemberCard({ member, likeIds, rolePlatform, customizedButton }: Props) {
    const [hasLiked, setHasLiked] = useState(likeIds?.includes(member.userId));
    const [loading, setLoading] = useState(false);

    const memberLink = `${getMemberLinkBasedOnRolePlatform(rolePlatform)}/${member.userId}`

    async function toggleLike() {
        try {
            setLoading(true);
            await toggleLikeMember(member.userId, hasLiked);
            setHasLiked(!hasLiked)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
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
            href={memberLink}
            isPressable
        >
            <Image
                isZoomed
                alt={member.name}
                width={300}
                src={transformImageUrl(member.image) || '/images/user.png'}
                className='aspect-square object-cover'
            />
            <div onClick={preventLinkAction}>
                <div className='absolute top-3 right-3 z-50'>
                    {customizedButton ? customizedButton : <LikeButton loading={loading} toggleLike={toggleLike} hasLiked={hasLiked} />}
                </div>
                <div className='absolute top-2 left-3 z-50'>
                    <PresenceDot member={member} />
                </div>
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