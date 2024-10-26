import React from 'react'
import { fetchCurrentUserLikeIds } from '@/app/actions/likeActions';
import { getMembers } from '@/app/actions/memberActions';
import MemberCard from '@/components/member/MemberCard';
import PaginationComponent from '@/components/PaginationComponent';
import { GetMemberParams } from '@/types';
import EmptyState from '@/components/filters/EmptyState';
import DeleteMemberButton from '@/components/buttons/DeleteMemberButton';
import DisableMemberButton from '@/components/buttons/DisableMemberButton';

export default async function MembersListPage({ searchParams }: { searchParams: GetMemberParams }) {
  const { items: members, totalCount } = await getMembers({ ...searchParams });
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
                <div key={member.id}>
                  <MemberCard member={member} likeIds={likeIds} rolePlatform='ADMIN' customizedButton={<> </>} />
                  <div className='flex justify-around items-center h-16'>
                    <DisableMemberButton userId={member.userId}/>
                    <DeleteMemberButton userId={member.userId} />
                  </div>
                </div>
              ))}
            </div>
            <PaginationComponent totalCount={totalCount} />
          </>
        )
      }
    </>
  )
}