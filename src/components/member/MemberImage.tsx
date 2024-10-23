'use client'
import { Photo } from '@prisma/client'
import { CldImage } from 'next-cloudinary'
import { Image, useDisclosure } from '@nextui-org/react'
import React from 'react'
import AppModal from '../AppModal'
import clsx from 'clsx'

type Props = {
    photo: Photo | null
}

export default function MemberImage({ photo }: Props) {
    // modal controller
    const { isOpen, onOpen, onClose } = useDisclosure();
    if (!photo) return null;
    return (
        <div className='cursor-pointer' onClick={onOpen}>
            {photo?.publicId ? (
                <CldImage
                    alt="Image of member"
                    src={photo.publicId}
                    width={300}
                    height={300}
                    crop='fill'
                    gravity='faces'
                    className='rounded-2xl'
                    priority
                />
            ) : (
                <Image
                    width={207}
                    height={207}
                    src={photo?.url || '/images/user.png'}
                    alt='Image of user'
                />
            )}
            <AppModal
                imageModal={true}
                isOpen={isOpen}
                onClose={onClose}
                body={
                    <>
                        {photo?.publicId ? (
                            <CldImage
                                alt="Image of member"
                                src={photo.publicId}
                                width={750}
                                height={750}
                                className={clsx('rounded-2xl')}
                                priority
                            />
                        ) : (
                            <Image
                                width={750}
                                // height={750}
                                src={photo?.url || '/images/user.png'}
                                alt='Image of user'
                            />
                        )}
                    </>
                }
            />
        </div>
    )
}