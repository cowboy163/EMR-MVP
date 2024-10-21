"use client";
import { useSelector } from '@/lib/redux';
import { NavbarItem } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

type Props = {
    href: string;
    label: string;
}

export default function NavLink({ href, label }: Props) {
    const pathname = usePathname();
    const unreadCount = useSelector(state => state.message.unreadCount);

    return (
        <NavbarItem isActive={pathname === href} as={Link} href={href}>
            <span>
                {label}
            </span>
            {
                // not display count when it is 0
                href.endsWith('/messages') && unreadCount > 0 && (
                    <span
                        className='ml-1'
                    >
                        ({unreadCount})
                    </span>
                )
            }
        </NavbarItem>
    )
}
