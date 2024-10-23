'use client'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { memberProfileSchema, PatientProfileSchema, patientProfileSchema } from '@/lib/schemas/registerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/react'
import MemberProfileForm from './MemberProfileForm'
import PatientProfileForm from './PatientProfileForm'
import { completeSocialLoginProfile } from '@/app/actions/authActions'
import { getBaseLinkBasedOnRolePlatform } from '@/lib/util'
import { signIn } from 'next-auth/react'

const stepSchemas = [
    memberProfileSchema,
    patientProfileSchema
];

export default function CompletePatientProfileForm() {
    // two steps to complete the form
    const [activeStep, setActiveStep] = useState(0);
    const currentValidationSchema = stepSchemas[activeStep];

    // form provider methods
    const methods = useForm<PatientProfileSchema>({
        resolver: zodResolver(currentValidationSchema),
        mode: "onTouched"
    });

    // const router = useRouter();
    const { handleSubmit, getValues, formState: { errors, isValid, isSubmitting } } = methods

    const onSubmit = async () => {
        const result = await completeSocialLoginProfile(getValues(), 'PATIENT');

        if (result.status === "success") {
            signIn(result.data, {
                callbackUrl: getBaseLinkBasedOnRolePlatform('PATIENT')
            })
        }
    }

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <MemberProfileForm />
            case 1:
                return <PatientProfileForm />
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
