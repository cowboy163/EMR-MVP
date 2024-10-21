
import React, { ReactNode } from 'react'

import { notFound } from 'next/navigation'
import { Card } from '@nextui-org/react';
import { getMemberByUserId } from '@/app/actions/memberActions';
import MemberSidebar from '@/components/member/MemberSidebar';

export default async function Layout({ children, params }: { children: ReactNode, params: { userId: string } }) {

    const doctor = await getMemberByUserId({userId: params.userId, role: 'DOCTOR'});
    if (!doctor) return notFound();

    const basePath = `/portal/doctors/${doctor.userId}`;

    const navLinks = [
        { name: "Profile", href: `${basePath}` },
        { name: "Booking", href: `${basePath}/booking` },
        { name: "Photos", href: `${basePath}/photos` },
        { name: "Chat", href: `${basePath}/chat` }
    ]
    return (
        <div className='grid grid-cols-12 gap-5 h-[80vh]'>
            <div className='col-span-3'>
                <MemberSidebar member={doctor} navLinks={navLinks} />
            </div>
            <div className='col-span-9'>
                <Card className='w-full mt-10 h-[80vh]'>
                    {children}
                </Card>
            </div>
        </div>
    )
}