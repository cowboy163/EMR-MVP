import { DoctorWithMemberType, MemberWithDoctorType } from "@/types";

export type DoctorDTO = {
    doctorId?: string,
    memberId: string,
    userId: string,
    name: string,
    gender: string,
    dateOfBirth: Date,
    created: Date,
    updated: Date,
    description: string,
    city: string,
    country: string,
    image: string | null,
    field?: string
}

export function mapDoctorToDoctorDto(doctor: DoctorWithMemberType | MemberWithDoctorType):DoctorDTO {
    if((doctor as DoctorWithMemberType)?.member) {
        const doctorWithMember = doctor as DoctorWithMemberType
        return {
            doctorId: doctorWithMember.id,
            memberId: doctorWithMember.member.id,
            userId: doctorWithMember.member.userId,
            name: doctorWithMember.member.name,
            gender: doctorWithMember.member.gender,
            dateOfBirth: doctorWithMember.member.dateOfBirth,
            created: doctorWithMember.member.created,
            updated: doctorWithMember.member.updated,
            description: doctorWithMember.member.description,
            city: doctorWithMember.member.city,
            country: doctorWithMember.member.country,
            image: doctorWithMember.member?.image,
            field: doctorWithMember.field
        }
    } else {
        const memberWithDoctor = doctor as MemberWithDoctorType;
        return {
            doctorId: memberWithDoctor.doctor?.id,
            memberId: memberWithDoctor.id,
            userId: memberWithDoctor.userId,
            name: memberWithDoctor.name,
            gender: memberWithDoctor.gender,
            dateOfBirth: memberWithDoctor.dateOfBirth,
            created: memberWithDoctor.created,
            updated: memberWithDoctor.updated,
            description: memberWithDoctor.description,
            city: memberWithDoctor.city,
            country: memberWithDoctor.country,
            image: memberWithDoctor?.image,
            field: memberWithDoctor.doctor?.field
        }
    }
}