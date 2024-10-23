'use client'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { doctorProfileSchema, DoctorRegisterSchema, memberProfileSchema, registerSchema } from '@/lib/schemas/registerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/react'
import UserDetailsForm from './UserDetailsForm'
import MemberProfileForm from './MemberProfileForm'
import DoctorProfileForm from './DoctorProfileForm'
import { registerUser } from '@/app/actions/authActions'
import { handleFormServerErrors } from '@/lib/util'
import { useRouter } from 'next/navigation'

const stepSchemas = [
    registerSchema,
    memberProfileSchema,
    doctorProfileSchema
];

export default function DoctorRegisterForm() {
    const router = useRouter();
    // three steps to register
    const [activeStep, setActiveStep] = useState(0);
    const currentValidationSchema = stepSchemas[activeStep];

    // form provider methods
    const methods = useForm<DoctorRegisterSchema>({
        resolver: zodResolver(currentValidationSchema),
        mode: "onTouched"
    });

    // const router = useRouter();
    const { handleSubmit, getValues, setError, formState: { errors, isValid, isSubmitting } } = methods

    const onSubmit = async () => {
        const result = await registerUser(getValues(), 'DOCTOR')
        if (result.status === "success") {
            router.push(`/doctor-register/success`)
        } else {
            handleFormServerErrors(result, setError)
        }
    }

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <UserDetailsForm />
            case 1:
                return <MemberProfileForm />
            case 2:
                return <DoctorProfileForm />
            default:
                return 'Unknown step'
        }
    }

    const onBack = () => {
        setActiveStep(prev => prev - 1);
    }

    const onNext = async () => {
        if (activeStep === stepSchemas.length - 1) {
            await onSubmit();
        } else {
            setActiveStep(prev => prev + 1);
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onNext)}>
                <div className='space-y-4'>
                    {getStepContent(activeStep)}
                    {errors?.root?.serverError && (
                        <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
                    )}
                    {/* go forward and go back */}
                    <div
                        className='flex flex-row items-center gap-6'
                    >
                        {activeStep !== 0 && (
                            <Button onClick={onBack} fullWidth>
                                Back
                            </Button>
                        )}
                        <Button
                            isLoading={isSubmitting}
                            isDisabled={!isValid}
                            fullWidth color='primary'
                            type='submit'
                        >
                            {activeStep === stepSchemas.length - 1 ? 'Submit' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
