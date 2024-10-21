import { UserFilters } from "@/types";
import { genderValues } from "@/types/constantsType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    filters: UserFilters;
}

type FilterPayload<T extends keyof UserFilters> = {
    filterName: T;
    value: UserFilters[T];
}

const initialState: FilterState = {
    filters: {
        ageRange: [0, 100],
        orderBy: 'updated',
        gender: genderValues,
        withPhoto: true,
    }
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilters: <T extends keyof FilterState['filters']>(state: FilterState, action: PayloadAction<FilterPayload<T>>) => {
            const { filterName, value } = action.payload;
            state.filters[filterName] = value;
        }
    }
})