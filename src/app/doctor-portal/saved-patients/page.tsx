import React from 'react'
import { fetchCurrentUserLikeIds, fetchLikedMembers } from '@/app/actions/likeActions';
import ListsTab from '@/components/tabs/ListsTab';

export default async function SavedDoctorsPage({ searchParams }: { searchParams: { type: string } }) {
    const likeIds = await fetchCurrentUserLikeIds();
    const patients = await fetchLikedMembers(searchParams.type)
    return (
        <div>
            <ListsTab members={patients} likeIds={likeIds} rolePlatform='DOCTOR'/>
        </div>
    )
}