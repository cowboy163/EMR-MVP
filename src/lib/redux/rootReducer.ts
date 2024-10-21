import {messageSlice, testSlice, presenceSlice, filterSlice, paginationSlice} from './slices'

export const reducer = {
    test: testSlice.reducer,
    presence: presenceSlice.reducer,
    message: messageSlice.reducer,
    filter: filterSlice.reducer,
    pagination: paginationSlice.reducer
}