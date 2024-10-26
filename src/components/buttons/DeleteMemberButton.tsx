'use client'

import React, { useState } from 'react'
import { Button, ButtonProps, useDisclosure } from '@nextui-org/react'
import AppModal from '../AppModal'
import { deleteUser } from '@/app/actions/userActions'
import { useRouter } from 'next/navigation'

export default function DeleteMemberButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const onDelete = async () => {
        try {
            setLoading(true)
            await deleteUser(userId);
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const footerButtons: ButtonProps[] = [
        { color: 'default', onClick: onClose, children: 'Cancel' },
        { color: 'primary', onClick: onDelete, children: 'Confirm' },
    ]
    return (
        <>

            <Button
                isLoading={loading}
                color='danger'
                onClick={() => onOpen()}
            >Delete</Button>

            <AppModal
                isOpen={isOpen}
                onClose={onClose}
                header='Please confirm this action'
                body={<div>Are you sure you want to delete this account? This cannot be undone.</div>}
                footerButtons={footerButtons}
            />
        </>

    )
}
