import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";
import { differenceInYears, format, formatDistance } from "date-fns";
import { RoleType } from "@/app/actions/authActions";

export function handleFormServerErrors<TFieldValues extends FieldValues> (
    errorResponse: {error: string | ZodIssue[]},
    setError: UseFormSetError<TFieldValues>
) {
    if(Array.isArray(errorResponse.error)) {
        errorResponse.error.forEach((e) => {
            const fieldName = e.path.join('.') as Path<TFieldValues>;
            setError(fieldName, {message: e.message})
        })
    } else {
        setError('root.serverError', {message: errorResponse.error})
    }
}

// get age based on date of birth
export function calculateAge (dob: Date) {
    return differenceInYears(new Date(), dob);
}

// format the time format
export function formatShortDateTime(date: Date) {
    return format(date, 'dd MMM yy h:mm a')
}

// get how long it passed until now based on the given date
export function timeAgo(date: string) {
    return formatDistance(new Date(date), new Date()) + ' ago';
}

export function getBaseLinkBasedOnRolePlatform(rolePlatform: RoleType) {
    if(rolePlatform === 'DOCTOR') return '/doctor-portal';
    if(rolePlatform === 'PATIENT') return '/portal';
}

// export function getMemberLinkBasedOnRolePlatform(rolePlatform: RoleType) {
//     if(rolePlatform === 'DOCTOR') return `${getBaseLinkBasedOnRolePlatform(rolePlatform)}/members`;
//     if(rolePlatform === 'PATIENT') return `${getBaseLinkBasedOnRolePlatform(rolePlatform)}/doctors`;
// }