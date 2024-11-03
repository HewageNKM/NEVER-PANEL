import {configureStore} from '@reduxjs/toolkit'
import loadSlice from './loadSlice/loadSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            loadSlice
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
