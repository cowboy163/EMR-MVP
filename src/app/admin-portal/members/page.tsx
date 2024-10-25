import React from 'react'
import { fetchCurrentUserLikeIds } from '@/app/actions/likeActions';
import { getMembers } from '@/app/actions/memberActions';
import MemberCard from '@/components/member/MemberCard';
import PaginationComponent from '@/components/PaginationComponent';
import { GetMemberParams } from '@/types';
import EmptyState from '@/components/filters/EmptyState';
import DeleteMemberButton from '@/components/buttons/DeleteMemberButton';

export default async function MembersListPage({ searchParams }: { searchParams: GetMemberParams }) {
  const {items: members, totalCount} = await getMembers({ ...searchParams });
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <>
      {
        !members || members.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className='mt-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
              {members && members.map(member => (
                <MemberCard key={member.id} member={member} likeIds={likeIds} rolePlatform='ADMIN' customizedButton={<DeleteMemberButton userId={member.userId}/>}/>
              ))}
            </div>
            <PaginationComponent totalCount={totalCount}/>
          </>
        )
      }
    </>
  )
}