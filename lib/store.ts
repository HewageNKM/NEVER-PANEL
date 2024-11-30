import {configureStore} from '@reduxjs/toolkit'
import loadSlice from './loadSlice/loadSlice'
import authSlice from "@/lib/authSlice/authSlice";
import inventorySlice from "@/lib/inventorySlice/inventorySlice";
import itemDetailsSlice from "@/lib/itemDetailsSlice/itemDetailsSlice";
import ordersSlice from "@/lib/ordersSlice/ordersSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            loadSlice,
            authSlice,
            inventorySlice,
            itemDetailsSlice,
            ordersSlice
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
