import {configureStore} from '@reduxjs/toolkit'
import authSlice from "@/lib/authSlice/authSlice";
import inventorySlice from "@/lib/inventorySlice/inventorySlice";
import itemDetailsSlice from "@/lib/itemDetailsSlice/itemDetailsSlice";
import ordersSlice from "@/lib/ordersSlice/ordersSlice";
import expensesSlice from './expensesSlice/expensesSlice';
import usersSlice from "@/lib/usersSlice/usersSlice";
import emailAndSMSSlice from "@/lib/emailAndSMSSlice/emailSMSSlice";
import bannersSlice  from "@/lib/bannersSlice/bannersSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            authSlice,
            inventorySlice,
            itemDetailsSlice,
            ordersSlice,
            expensesSlice,
            usersSlice,
            emailAndSMSSlice,
            bannersSlice
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
