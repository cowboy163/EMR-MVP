'use client'
import { useSelector } from '@/lib/redux';
import { Member } from '@prisma/client'
import React from 'react'
import { GoDot, GoDotFill } from 'react-icons/go';

type Props = {
    member: Member;
}

// indicator shows whether user is online
export default function PresenceDot({ member }: Props) {
    const members = useSelector(state => state.presence.members);

    // indexOf will find the index value, if not find anything, return -1
    const isOnline = members.indexOf(member.userId) !== -1;

    if (!isOnline) return null

    return (
        <>
            <GoDot size={36} className='fill-white absolute inset-0 m-auto z-10'/>
            <GoDotFill size={36} className='fill-green-500 animate-pulse'/>
        </>
    )
}