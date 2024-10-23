import React from 'react'
import { fetchCurrentUserLikeIds, fetchLikedMembers } from '@/app/actions/likeActions';
import ListsTab from '@/components/tabs/ListsTab';

export const dynamic = 'force-dynamic';

export default async function SavedDoctorsPage({searchParams}: {searchParams: {type: string}}) {
    const likeIds = await fetchCurrentUserLikeIds();
    const doctors = await fetchLikedMembers(searchParams.type)
    return (
      <div>
        <ListsTab members={doctors} likeIds={likeIds} rolePlatform='PATIENT'/>
      </div>
    )
}
