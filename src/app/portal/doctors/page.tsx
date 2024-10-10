import React from 'react'
import { getMemberDoctors } from '@/app/actions/patientActions';
import { fetchCurrentUserLikeIds } from '@/app/actions/likeActions';
import MemberCard from '@/components/MemberCard';

export default async function DoctorListPage() {
  const doctors = await getMemberDoctors();
  const likeIds = await fetchCurrentUserLikeIds();
  return (
    <div className='mt-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
      {doctors && doctors.map(doctor => (
        <MemberCard key={doctor.id} member={doctor} likeIds={likeIds} rolePlatform='PATIENT' />
      ))}
    </div>
  )
}