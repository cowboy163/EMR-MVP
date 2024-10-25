import { Input } from "@nextui-org/react";
import { useFormContext } from "react-hook-form"

export default function AdminProfileForm() {
    const {register, getValues, formState: {errors}} = useFormContext();
    return (
        <div className="space-y-4">
            <Input
                defaultValue={getValues('secretKey')}
                label="App Secret Key"
                variant="bordered"
                {...register('secretKey')}
                isInvalid={!!errors.secretKey}
                errorMessage={errors.secretKey?.message as string}
            />
        </div>
    )
}