'use client'
import { paginationSlice, useDispatch, useSelector } from '@/lib/redux';
import { Pagination } from '@nextui-org/react'
import clsx from 'clsx';
import React, { useEffect } from 'react'

export default function PaginationComponent({ totalCount }: { totalCount: number }) {
    const dispatch = useDispatch();
    const pagination = useSelector(state => state.pagination.pagination);

    const { pageNumber, pageSize, totalPages } = pagination;

    useEffect(() => {
        dispatch(paginationSlice.actions.setPagination(totalCount));
    }, [dispatch, totalCount])

    const start = (pageNumber - 1) * pageSize + 1;
    const end = Math.min(pageNumber * pageSize, totalCount);
    const resultText = `Showing ${start}-${end} of ${totalCount} results`;

    return (
        <div
            className='border-t-2 w-full mt-5'
        >
            <div
                className='flex flex-row justify-between items-center py-5'
            >
                <div>{resultText}</div>
                <Pagination
                    total={totalPages}
                    color='primary'
                    page={pageNumber}
                    variant='bordered'
                    onChange={value => dispatch(paginationSlice.actions.setPage(value))}
                />
                <div
                    className='flex flex-row gap-1 items-center'
                >
                    Page size:
                    {
                        [3, 6, 12].map(size => (
                            <div
                                key={size}
                                onClick={() => dispatch(paginationSlice.actions.setPageSize(size))}
                                className={clsx('page-size-box', {
                                    'bg-primary text-white hover:bg-primary hover:text-white': pageSize === size
                                })}
                            >
                                {size}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}