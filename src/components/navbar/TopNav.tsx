import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { FaClinicMedical } from "react-icons/fa";
import NavLink from './NavLink'
import { auth } from '@/auth'
import UserMenu from './UserMenu'
import { getUserInfoForNav } from '@/app/actions/userActions'
import LoginMenu from './LoginMenu';
import RegisterMenu from './RegisterMenu';
import FiltersWrapper from '../filters/FilterWrapper';

export default async function TopNav() {
    const session = await auth();
    const userInfo = session?.user && await getUserInfoForNav();


    const patientLinks = [
        {
            href: '/portal',
            label: 'Home'
        },
        {
            href: '/portal/doctors',
            label: 'Doctors'
        },
        {
            href: '/portal/saved-doctors',
            label: 'Saved Doctors'
        },
        {
            href: '/portal/messages',
            label: 'Messages'
        },
    ]

    const doctorLinks = [
        {
            href: '/doctor-portal',
            label: 'Home'
        },
        {
            href: '/doctor-portal/saved-patients',
            label: 'Saved Patients'
        },
        {
            href: '/doctor-portal/messages',
            label: 'Messages'
        },
    ]

    const links = session?.user.role === 'DOCTOR' ? doctorLinks : patientLinks;

    return (
        <>
            <Navbar
                maxWidth='xl'
                className='bg-gradient-to-r from-blue-400 to-blue-700'
                classNames={{
                    item: [
                        'text-xl',
                        'text-white',
                        'text-uppercase',
                        'data-[active=true]:text-yellow-200'
                    ]
                }}
            >
                <NavbarBrand as={Link} href="/">
                    <FaClinicMedical size={40} />
                    <div className='font-bold text-3xl flex'>
                        <span className='text-gray-900'>NoQ</span>
                        <span className='text-gray-200'>clinic</span>
                    </div>
                </NavbarBrand>
                <NavbarContent justify='center' className='text-gray-200 gap-8'>
                    {
                        session && links.map(item => (
                            <NavLink href={item.href} key={item.href} label={item.label} />
                        ))
                    }
                </NavbarContent>
                <NavbarContent justify='end'>
                    {
                        session?.user ? (
                            <UserMenu userInfo={userInfo} rolePlatform={session.user.role} />
                        ) : (
                            <Fragment>
                                <LoginMenu />
                                <RegisterMenu />
                            </Fragment>
                        )
                    }
                </NavbarContent>
            </Navbar>
            <FiltersWrapper/>
        </>
    )
}