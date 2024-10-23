'use client'
import { signInUser } from '@/app/actions/authActions'
import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema'
import { RoleType } from '@/types/constantsType'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import SocialLogin from '../SocialLogin'

type Props = {
    rolePlatform?: RoleType
}
export default function LoginForm({ rolePlatform = 'PATIENT' }: Props) {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched"
    })
    const onSubmit = async (data: LoginSchema) => {
        const result = await signInUser(data, rolePlatform)
        if (result.status === 'success') {
            if (rolePlatform === 'PATIENT') {
                router.push("/portal");
            }
            if (rolePlatform === 'DOCTOR') {
                router.push("/doctor-portal")
            }
            router.refresh();
        } else {
            toast.error(result.error as string)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
                <Input
                    defaultValue=''
                    label="Email"
                    variant="bordered"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message as string}
                />
                <Input
                    defaultValue=''
                    label="Password"
                    variant="bordered"
                    type="password"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message as string}
                />
                <Button isDisabled={!isValid} fullWidth color='primary' type='submit' isLoading={isSubmitting}>
                    Login
                </Button>
                {rolePlatform === 'PATIENT' && <SocialLogin rolePlatform={rolePlatform} />}
                <div
                    className='flex justify-center hover:underline text-sm'
                >
                    <Link
                        href='/forgot-password'
                    >
                        Forgot password?
                    </Link>
                </div>
            </div>
        </form>
    )
}
