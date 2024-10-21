'use client'

import { useRef, type ReactNode } from "react"
import { ReduxStore, reduxStore } from "@/lib/redux"
import { Provider } from "react-redux"

export const ReduxProviders = ({children}: {children: ReactNode}) => {
    const storeRef = useRef<ReduxStore | null>(null)
    if(!storeRef.current) {
        storeRef.current = reduxStore
    }
    return <Provider store={storeRef.current}>{children}</Provider>
}