import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId } from '@/app/actions/memberActions';
import MemberSidebar from '@/components/member/MemberSidebar';
import { getBaseLinkBasedOnRolePlatform } from '@/lib/util';
import { Card } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import React, { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
    const userId = await getAuthUserId();
    const member = await getMemberByUserId({ userId });
    if (!member) return notFound();

    const basePath = `${getBaseLinkBasedOnRolePlatform('DOCTOR')}/edit`

    const navLinks = [
        { name: "Edit Profile", href: `${basePath}` },
        { name: "Upload Photos", href: `${basePath}/photos` },
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
