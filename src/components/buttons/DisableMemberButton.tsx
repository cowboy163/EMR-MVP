'use client'

import React, { useState } from 'react'
import { Button, ButtonProps, useDisclosure } from '@nextui-org/react'
import AppModal from '../AppModal'
import { useRouter } from 'next/navigation'

export default function DisableMemberButton({ userId }: { userId: string }) {
    const [isActive, setIsAvtive] = useState(true);
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const onToggle = () => {
        try {
            setLoading(true)
            console.log("user id check ===> ", userId)
            setIsAvtive(prev => !prev)
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const footerButtons: ButtonProps[] = [
        { color: 'default', onClick: onClose, children: 'Cancel' },
        { color: 'primary', onClick: onToggle, children: 'Confirm' },
    ]
    return (
        <>
            <Button
                isLoading={loading}
                color={isActive ? "danger" : "success"}
                onClick={() => onOpen()}
            >{isActive ? "Deactive" : "Avtice"}</Button>

            <AppModal
                isOpen={isOpen}
                onClose={onClose}
                header='Please confirm this action'
                body={<div>Are you sure you want to {isActive ? "diactive" : "active"} this account?</div>}
                footerButtons={footerButtons}
            />
        </>

    )
}