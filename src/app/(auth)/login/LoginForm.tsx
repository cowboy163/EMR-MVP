"use client"
import { signInUser } from '@/app/actions/authAction'
import CardWrapper from '@/components/CardWrapper'
import { LoginSchema, loginSchema } from '@/lib/schemas/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GiPadlock } from 'react-icons/gi'
import { toast } from 'react-toastify'

export default function LoginForm() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched"
    })
    const onSubmit = async (data: LoginSchema) => {
        const result = await signInUser(data)
        if(result.status === 'success') {
            router.push("/");
            router.refresh();
        } else {
            toast.error(result.error as string)
        }
    }

    return (
        <CardWrapper
            headerText='Login'
            subHeaderText='Welcome back to Noqclinic'
            headerIcon={GiPadlock}
            body={
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
            }
        />
    )
}