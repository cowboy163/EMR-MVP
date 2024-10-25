import DoctorEditForm from './DoctorEditForm';
import { Member } from '@prisma/client';
import PatientEditForm from './PatientEditForm';
import AdminEditForm from './AdminEditForm';

type Props = {
    member: Member
}

export default function MemberEditForm({ member }: Props) {
    const role = member.role;
    switch (role) {
        case 'DOCTOR':
            return < DoctorEditForm member={member} />
        case 'PATIENT':
            return < PatientEditForm member={member} />
        case 'ADMIN':
            return < AdminEditForm member={member} />
        default:
            console.log("rolePlatform is undefined in MemberEditForm Component");
            throw new Error('Something Went Wrong')
    }
}