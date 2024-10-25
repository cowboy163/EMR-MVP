import { RoleType } from '@/types/constantsType'
import DoctorRegisterForm from './DoctorRegisterForm';
import PatientRegisterForm from './PatientRegisterForm';
import AdminRegisterForm from './AdminRegisterForm';

type Props = {
    rolePlatform?: RoleType
}

export default function RegisterForm({ rolePlatform = 'PATIENT' }: Props) {
    switch (rolePlatform) {
        case 'DOCTOR':
            return <DoctorRegisterForm />
        case 'PATIENT':
            return <PatientRegisterForm />
        case 'ADMIN':
            return <AdminRegisterForm />
        default:
            console.log("rolePlatform is undefined in RegisterForm Component");
            throw new Error('Something Went Wrong')
    }
}
