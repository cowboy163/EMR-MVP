'use client'
import { Textarea } from "@nextui-org/react";
import { useFormContext } from "react-hook-form"

export default function PatientProfileForm() {
    const {register, getValues, formState: {errors}} = useFormContext();    
    return (
        <div className="space-y-4">
            <Textarea
                defaultValue={getValues('medicalHistory')}
                label="Medical History"
                variant="bordered"
                {...register("medicalHistory")}
                isInvalid={!!errors.medicalHistory}
                errorMessage={errors.medicalHistory?.message as string}
            />
        </div>
    )
}