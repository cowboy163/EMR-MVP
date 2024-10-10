'use client';
import { Spinner, Tab, Tabs } from '@nextui-org/react';
import { Key } from '@react-types/shared';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react'
import MemberCard from '@/components/MemberCard';
import { Member } from '@prisma/client';
import { RoleType } from '@/app/actions/authActions';

type Props = {
    members: Member[];
    likeIds: string[];
    rolePlatform: RoleType;
}

export default function ListsTab({ members, likeIds, rolePlatform }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const getLabelBasedOnRolePlatform = () => {
        switch (rolePlatform) {
            case "PATIENT":
                return [
                    { id: 'source', label: "Doctors I have saved" },
                    { id: 'target', label: "Doctors that saved me" }
                ]

            case "DOCTOR":
                return [
                    { id: 'source', label: "Members I have saved" },
                    { id: 'target', label: "Members that saved me" }
                ]
            default:
                return [];
        }
    }

    const tabs = getLabelBasedOnRolePlatform();

    function handleTabChange(key: Key) {
        startTransition(() => {
            const params = new URLSearchParams(searchParams);
            params.set('type', key.toString());
            router.replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className='flex w-full flex-col mt-10 gap-5'>
            <div className='flex items-center'>
                <Tabs
                    aria-label='Like tabs'
                    color='primary'
                    onSelectionChange={(key) => handleTabChange(key)}
                >
                    {tabs.map((item) => (
                        <Tab key={item.id} title={item.label} />
                    ))}
                </Tabs>
                {isPending && <Spinner color='primary' className='self-center ml-3' />}
            </div>

            {tabs.map((item) => {
                const isSelected = searchParams.get('type') === item.id;
                return isSelected ? (
                    <div key={item.id}>
                        {members.length > 0 ? (
                            <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
                                {members.map((member) => (
                                    <MemberCard key={member.id} member={member} likeIds={likeIds} rolePlatform={rolePlatform}/>
                                ))}
                            </div>
                        ) : (
                            <div>No Members for this filter</div>
                        )}
                    </div>) : null
            })}
        </div >
    )
}
