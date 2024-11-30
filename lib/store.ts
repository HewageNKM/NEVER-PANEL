import {configureStore} from '@reduxjs/toolkit'
import authSlice from "@/lib/authSlice/authSlice";
import inventorySlice from "@/lib/inventorySlice/inventorySlice";
import itemDetailsSlice from "@/lib/itemDetailsSlice/itemDetailsSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            authSlice,
            inventorySlice,
            itemDetailsSlice,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
