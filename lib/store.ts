import { configureStore } from '@reduxjs/toolkit'
import toastSlice from "@/lib/toastSlice/toastSlice";
import authSlice from "@/lib/userSlice/userSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            toastSlice,
            authSlice
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
