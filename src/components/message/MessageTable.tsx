'use client'
import { MessageDto } from '@/types';
import { Button, Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React from 'react'
import { useMessages } from '@/hooks/useMessages';
import MessageTableCell from './MessageTableCell';
import { RoleType } from '@/types/constantsType';

type Props = {
    initialMessages: MessageDto[],
    rolePlatform: RoleType,
    nextCursor?: string;
}

export default function MessageTable({ initialMessages, rolePlatform, nextCursor }: Props) {
    const { columns, isOutbox, isDeleting, deletMessage, selectRow, messages, loadMore, loadingMore, hasMore } = useMessages(initialMessages, rolePlatform, nextCursor);

    return (
        <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
            <Table
                aria-label='Table with messages'
                selectionMode='single'
                onRowAction={(key) => {
                    selectRow(key)
                }}
                shadow='none'
            >
                <TableHeader
                    columns={columns}
                >
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={messages} emptyContent='No Messages for this container'>
                    {(item) => (
                        <TableRow key={item.id} className='cursor-pointer'>
                            {(columnKey) => (
                                <TableCell className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                                    <MessageTableCell
                                        item={item}
                                        columnKey={columnKey as string}
                                        isOutbox={isOutbox}
                                        deleteMessage={deletMessage}
                                        isDeleting={isDeleting.loading && isDeleting.id === item.id}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* load more button */}
            <div
                className='sticky bottom-0 pb-3 mr-3 text-right'
            >
                <Button
                    color='primary'
                    isLoading={loadingMore}
                    isDisabled={!hasMore}
                    onClick={loadMore}
                >
                    {hasMore ? 'Load more' : 'No more messages'}
                </Button>
            </div>
        </Card>
    )
}