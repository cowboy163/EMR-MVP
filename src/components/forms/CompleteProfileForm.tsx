import React from 'react'
import { RoleType } from "@/types/constantsType";
import CompletePatientProfileForm from './CompletePatientProfileForm';
import CompleteDoctorProfileForm from './CompleteDoctorProfileForm';


export default function CompleteProfileForm({ rolePlatform }: { rolePlatform: RoleType }) {
    switch (rolePlatform) {
        case 'PATIENT':
            return <CompletePatientProfileForm />
        case 'DOCTOR':
            return <CompleteDoctorProfileForm />

        default:
            console.log("rolePlatform is undefined in CompleteProfileForm Component");
            throw new Error('Something Went Wrong')
    }
}