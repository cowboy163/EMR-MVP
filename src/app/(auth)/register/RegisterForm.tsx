"use client"
import { registerUser } from '@/app/actions/authAction'
import CardWrapper from '@/components/CardWrapper'
import { RegisterSchema, registerSchema } from '@/lib/schemas/registerSchema'
import { handleFormServerErrors } from '@/lib/util'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GiPadlock } from 'react-icons/gi'

export default function RegisterForm() {
    const router = useRouter();
    const { register, handleSubmit, setError, formState: { errors, isValid, isSubmitting } } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched"
    })
    const onSubmit = async (data: RegisterSchema) => {
        const result = await registerUser(data)
        if (result.status === "success") {
            router.push("/register/success")
        } else {
            handleFormServerErrors(result, setError)
        }
    }
    
    return (
        <CardWrapper
            headerText='Register'
            subHeaderText='Welcome to NoQclinic'
            headerIcon={GiPadlock}
            body={
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-4'>
                        <Input
                            defaultValue=''
                            label="Name"
                            variant="bordered"
                            {...register("name")}
                            isInvalid={!!errors.name}
                            errorMessage={errors.name?.message}
                        />
                        <Input
                            defaultValue=''
                            label="Email"
                            variant="bordered"
                            {...register("email")}
                            isInvalid={!!errors.email}
                            errorMessage={errors.email?.message}
                        />
                        <Input
                            defaultValue=''
                            label="Password"
                            variant="bordered"
                            type="password"
                            {...register("password")}
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                        />
                        {errors?.root?.serverError && (
                            <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
                        )}
                        <Button
                            isLoading={isSubmitting}
                            isDisabled={!isValid}
                            fullWidth color='primary'
                            type='submit'
                        >
                            Register
                        </Button>
                    </div>
                </form>
            }
        />
    )
}