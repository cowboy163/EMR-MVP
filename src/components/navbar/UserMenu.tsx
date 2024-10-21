'use client';
import { signOutUser } from '@/app/actions/authActions';
import { transformImageUrl } from '@/lib/util';
import { RoleType } from '@/types/constantsType';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

type Props = {
    userInfo: { name: string | null; image: string | null; } | null | undefined
    rolePlatform: RoleType
}

const getLinkBasedOnRolePlatform = (rolePlatform: RoleType) => {
    if (rolePlatform === 'PATIENT') {
        return `/portal`
    }
    if (rolePlatform === 'DOCTOR') {
        return `/doctor-portal`
    }
}

export default function UserMenu({ userInfo, rolePlatform }: Props) {
    return (
        <Dropdown placement='bottom-end'>
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as='button'
                    className='transition-transform'
                    color='secondary'
                    name={userInfo?.name || 'user avatar'}
                    size='sm'
                    src={transformImageUrl(userInfo?.image) || '/images/user.png'}
                />
            </DropdownTrigger>
            <DropdownMenu variant='flat' aria-label='User actions menu'>
                <DropdownSection showDivider>
                    <DropdownItem isReadOnly as='span' className='h-14 flex flex-row' aria-label='username'>
                        Signed in as {userInfo?.name}
                    </DropdownItem>
                </DropdownSection>

                <DropdownItem as={Link} href={`${getLinkBasedOnRolePlatform(rolePlatform)}/edit`}>
                    Edit profile
                </DropdownItem>
                <DropdownItem color='danger' onClick={async () => await signOutUser()}>
                    Log out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}