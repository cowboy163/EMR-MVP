import { getMessagesByContainer } from '@/app/actions/messageActions';
import MessageSidebar from '@/components/message/MessageSidebar'
import MessageTable from '@/components/message/MessageTable';
import React from 'react'

export default async function DoctorMessagePge({ searchParams }: { searchParams: { container: string } }) {
  const {messages, nextCursor} = await getMessagesByContainer(searchParams.container);
  return (
    <div
      className='grid grid-cols-12 gap-5 h-[80vh] mt-10'
    >
      <div
        className='col-span-2'
      >
        <MessageSidebar />
      </div>
      <div
        className='col-span-10'
      >
        <MessageTable initialMessages={messages} rolePlatform='DOCTOR' nextCursor={nextCursor}/>
      </div>
    </div>
  )
}
