import { Button } from '@nextui-org/react'
import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import {signIn} from 'next-auth/react'
import { RoleType } from '@/types/constantsType';
import { getBaseLinkBasedOnRolePlatform } from '@/lib/util';

export default function SocialLogin({rolePlatform}: {rolePlatform: RoleType}) {    
    const onClick = (provider: 'google') => {
        signIn(provider, {
            callbackUrl: getBaseLinkBasedOnRolePlatform(rolePlatform)
        })
    }

    return (
        <div
            className='flex items-center w-full gap-2'
        >
            <Button
                size='lg'
                fullWidth
                variant='bordered'
                onClick={() => onClick('google')}
            >
                <FcGoogle size={20}/>
            </Button>
        </div>
    )
}