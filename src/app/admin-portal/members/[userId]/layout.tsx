import React, { ReactNode } from 'react'

import { notFound } from 'next/navigation'
import { Card } from '@nextui-org/react';
import { getMemberByUserId } from '@/app/actions/memberActions';
import MemberSidebar from '@/components/member/MemberSidebar';
import { getMemberLinkBasedOnRolePlatform } from '@/lib/util';

export default async function Layout({ children, params }: { children: ReactNode, params: { userId: string } }) {

    const member = await getMemberByUserId({userId: params.userId});
    if (!member) return notFound();

    const basePath = `${getMemberLinkBasedOnRolePlatform('ADMIN')}/${member.userId}`;

    const navLinks = [
        { name: "Edit Member", href: `${basePath}` },
        { name: "Edit Photos", href: `${basePath}/photos` },
        { name: "Chat", href: `${basePath}/chat` }
    ]
    return (
        <div className='grid grid-cols-12 gap-5 h-[80vh]'>
            <div className='col-span-3'>
                <MemberSidebar member={member} navLinks={navLinks} />
            </div>
            <div className='col-span-9'>
                <Card className='w-full mt-10 h-[80vh]'>
                    {children}
                </Card>
            </div>
        </div>
    )
}