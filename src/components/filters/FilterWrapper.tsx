'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import Filters from './Filters';

// fillter wrapper decide if the filter should rendered
export default function FiltersWrapper() {
    const pathname = usePathname();

    if(pathname.endsWith('/doctors') || pathname.endsWith('/members')) return <Filters />
    else return null;
}