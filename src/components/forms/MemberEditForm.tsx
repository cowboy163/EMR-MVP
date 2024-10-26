import DoctorEditForm from './DoctorEditForm';
import { Member } from '@prisma/client';
import PatientEditForm from './PatientEditForm';
import AdminEditForm from './AdminEditForm';
import { auth } from '@/auth';

type Props = {
    member: Member
}

export default async function MemberEditForm({ member }: Props) {
    const { userId, role } = member;
    const session = await auth();
    const { id: selfUserId} = session?.user || {};
    switch (role) {
        case 'DOCTOR':
            return < DoctorEditForm member={member} selfEdit={userId === selfUserId}/>
        case 'PATIENT':
            return < PatientEditForm member={member} selfEdit={userId === selfUserId}/>
        case 'ADMIN':
            return < AdminEditForm member={member} selfEdit={userId === selfUserId}/>
        default:
            console.log("rolePlatform is undefined in MemberEditForm Component");
            throw new Error('Something Went Wrong')
    }
}