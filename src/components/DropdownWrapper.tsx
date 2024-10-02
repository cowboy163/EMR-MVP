'use client'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react";
import Link from "next/link";
import { ReactNode } from "react";

type OverlayPlecement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

export type DropdownWrapperProps = {
    trigger: string | ReactNode,
    dropdownMenu: {
        ariaLable: string,
        readOnlySection?: {
            ariaLabel: string,
            label: string
        },
        dropItems: {
            ariaLabel: string,
            label: string,
            href?: string,
            startContent?: ReactNode,
            description?: string,
        }[]
    },
    placement?: OverlayPlecement
}

export const DropdownWrapper = ({ trigger, dropdownMenu, placement="bottom-end" }: DropdownWrapperProps) => {
    const { ariaLable, readOnlySection, dropItems } = dropdownMenu
    return (
        <Dropdown placement={placement}>
            <DropdownTrigger>
                {
                    typeof trigger === 'string' ? (
                        <Button variant='bordered' className='text-white'>{trigger}</Button>
                    ) : trigger
                }
            </DropdownTrigger>
            <DropdownMenu variant='flat' aria-label={ariaLable}>
                <DropdownSection showDivider hidden={!readOnlySection}>
                    <DropdownItem isReadOnly as='span' className='h-14 flex flex-row' aria-label={readOnlySection?.ariaLabel}>
                        {readOnlySection?.label}
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection
                    className="m-0"
                >
                    {
                        dropItems && dropItems.map((item, index) => (
                            <DropdownItem
                                key={item.label + index}
                                aria-label={item.ariaLabel}
                                showDivider={index < dropItems.length - 1}
                                {...(item.href && { href: item.href, as: Link })}
                                {...(item.description && { description: item.description })}
                                {...(item.startContent && { startContent: item.startContent })}
                            >
                                {item.label}
                            </DropdownItem>
                        ))
                    }
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}