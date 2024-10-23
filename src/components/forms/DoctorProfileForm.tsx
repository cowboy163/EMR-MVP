import { Input } from "@nextui-org/react";
import { useFormContext } from "react-hook-form"

export default function DoctorProfileForm() {
    const {register, getValues, formState: {errors}} = useFormContext();
    return (
        <div className="space-y-4">
            <Input
                defaultValue={getValues('field')}
                label="Professional Field"
                variant="bordered"
                {...register('field')}
                isInvalid={!!errors.field}
                errorMessage={errors.field?.message as string}
            />
        </div>
    )
}