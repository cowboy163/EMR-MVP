import { PagingResult } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationState {
    pagination: PagingResult;
}

const initialState: PaginationState = {
    pagination: {
        pageNumber: 1,
        pageSize: 12,
        totalCount: 0,
        totalPages: 1
    }
};

export const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setPagination: (state, action: PayloadAction<number>) => {
            const totalCount = action.payload;
            state.pagination = {
                pageNumber: 1,
                pageSize: state.pagination.pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / state.pagination.pageSize)
            }
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.pageNumber = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            const pageSize = action.payload;
            state.pagination = {
                ...state.pagination,
                pageSize,
                pageNumber: 1,
                totalPages: Math.ceil(state.pagination.totalCount / pageSize)
            }
        }
    }
})