import React from 'react'
import { fetchCurrentUserLikeIds } from '@/app/actions/likeActions';
import { getMembers } from '@/app/actions/memberActions';
import MemberCard from '@/components/member/MemberCard';
import PaginationComponent from '@/components/PaginationComponent';
import { GetMemberParams } from '@/types';
import EmptyState from '@/components/filters/EmptyState';

export default async function DoctorListPage({ searchParams }: { searchParams: GetMemberParams }) {
  const {items: doctors, totalCount} = await getMembers({ ...searchParams, role: 'DOCTOR' });
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <>
      {
        !doctors || doctors.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className='mt-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
              {doctors && doctors.map(doctor => (
                <MemberCard key={doctor.id} member={doctor} likeIds={likeIds} rolePlatform='PATIENT' />
              ))}
            </div>
            <PaginationComponent totalCount={totalCount}/>
          </>
        )
      }
    </>
  )
}