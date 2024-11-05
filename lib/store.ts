import {configureStore} from '@reduxjs/toolkit'
import loadSlice from './loadSlice/loadSlice'
import authSlice from "@/lib/authSlice/authSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            loadSlice,
            authSlice
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
