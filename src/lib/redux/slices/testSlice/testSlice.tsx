import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface StepperState {
    activeStep: number
    stepLength: number
}

const initialState: StepperState = {
    activeStep: 0,
    stepLength: 3,
}

export const testSlice = createSlice({
    name: "testSlice",
    initialState,
    reducers: {
        setActiveStep: (state, action: PayloadAction<number>) => {
            state.activeStep = action.payload
        },
        setStepLength: (state, action: PayloadAction<number>) => {
            state.stepLength = action.payload
        }
    }
})