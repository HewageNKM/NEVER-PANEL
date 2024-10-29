import {configureStore} from '@reduxjs/toolkit'
import toastSlice from "@/lib/toastSlice/toastSlice";
import authSlice from "@/lib/userSlice/userSlice";
import pageLoaderSlice from "@/lib/pageLoaderSlice/pageLoaderSlice";
import orderSlice from "@/lib/orderSlice/orderSlice";
import inventorySlice from "@/lib/inventorySlice/inventorySlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            toastSlice,
            authSlice,
            pageLoaderSlice,
            orderSlice,
            inventorySlice
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
