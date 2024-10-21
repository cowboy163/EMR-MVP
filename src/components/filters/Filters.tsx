'use client';

import { useFilters } from '@/hooks/useFilter';
import { Button, Select, SelectItem, Slider, Spinner, Switch } from '@nextui-org/react';
import React from 'react'


export default function Filters() {
    const { genderList, orderByList, filters, selectAge, selectGender, selectOrder, isPending, selectWithPhoto } = useFilters();

    return (
        <div
            className='shadow-md py-2'
        >
            <div
                className='flex flex-row justify-around items-center'
            >
                <div className='flex gap-2 items-center'>
                    <div
                        className='text-primary font-semibold text-xl'
                    >
                        Result: 10
                    </div>
                    {
                        isPending && <Spinner size='sm' color='primary' />
                    }
                </div>
                {/* gender selection */}
                <div
                    className='flex gap-2 items-center'
                >
                    <div>
                        Gender:
                    </div>
                    {
                        genderList.map(({ icon: Icon, value }) => (
                            <Button
                                key={value}
                                size='sm'
                                isIconOnly
                                color={filters.gender.includes(value) ? 'primary' : 'default'}
                                onClick={() => selectGender(value)}
                            >
                                <Icon size={24} />
                            </Button>
                        ))
                    }
                </div>
                {/* age slider */}
                <div
                    className='flex flex-row items-center gap-2 w-1/4'
                >
                    <Slider
                        label='Age range'
                        color='primary'
                        size='sm'
                        minValue={0}
                        maxValue={100}
                        defaultValue={filters.ageRange}
                        onChangeEnd={(value) => { selectAge(value as number[]) }}
                        aria-label='age slider'
                    />
                </div>
                {/* select with photo */}
                <div
                    className='flex flex-col items-center'
                >
                    <p
                        className='text-sm'
                    >
                        With photo
                    </p>
                    <Switch
                        color='primary'
                        defaultSelected
                        size='sm'
                        onChange={selectWithPhoto}
                    />
                </div>

                {/* order */}
                <div
                    className='w-1/4'
                >
                    <Select
                        size='sm'
                        fullWidth
                        label='Order by'
                        variant='bordered'
                        color='primary'
                        aria-label='Order by selector'
                        selectedKeys={new Set([filters.orderBy])}
                        onSelectionChange={selectOrder}
                        disallowEmptySelection={true}
                    >
                        {
                            orderByList.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))
                        }
                    </Select>
                </div>
            </div>
        </div>
    )
}