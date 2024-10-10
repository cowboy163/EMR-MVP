import { getMemberSelf } from '@/app/actions/patientActions';
import MemberSidebar from '@/components/MemberSidebar';
import { Card } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import React, { ReactNode } from 'react'

export default async function PatientPortalEditPage({children}: {children: ReactNode}) {
    // const userId = await getAuthUserId();
    const member = await getMemberSelf();
    if (!member) return notFound();

    const basePath = `/portal/edit`

    const navLinks = [
        { name: "Edit Profile", href: `${basePath}` },
        { name: "Update Photos", href: `${basePath}/photos` },
    ]
    return (
        <div className='grid grid-cols-12 gap-5 h-[80vh]'>
            <div className='col-span-3'>
                <MemberSidebar member={member} navLinks={navLinks}/>
            </div>
            <div className='col-span-9'>
                <Card className='w-full mt-10 h-[80vh]'>
                    {children}
                </Card>
            </div>
            <div>test page</div>
        </div>
    )
}
