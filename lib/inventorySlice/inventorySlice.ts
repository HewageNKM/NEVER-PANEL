import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {getCurrentUser} from "@/firebase/firebaseClient";
import {Item} from "@/interfaces";

interface InventorySlice {
    inventory: any[],
    loading: boolean,
    selectedBrand: string,
    page: number,
    size: number,
    error:string | null
}

const initialState: InventorySlice = {
    inventory: [],
    selectedBrand:"all",
    loading: false,
    page: 1,
    size: 20,
    error:null
}

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.inventory = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSize: (state, action) => {
            state.size = action.payload;
        },
        setSelectedBrand: (state, action) => {
            state.selectedBrand = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInventory.fulfilled, (state, action) => {
            if(state.selectedBrand !== "all"){
                state.inventory = action.payload.filter((item:Item) => item.manufacturer === state.selectedBrand);
            }else {
                state.inventory = action.payload;
            }
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchInventory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchInventory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(deleteItemById.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(deleteItemById.fulfilled, (state, action) => {
            state.inventory = state.inventory.filter(item => item.id !== action.payload.id);
            state.loading = false;
            state.error = null;
        }).addCase(deleteItemById.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            state.error = null;
        });
    }
})

export const fetchInventory = createAsyncThunk(
    "inventory/fetchInventory",
    async ({page, size}: { page: number, size: number }, thunkAPI) => {
        const uid = getCurrentUser()?.uid;
        const token = await getCurrentUser()?.getIdToken()
        try {
            const res = await axios({
                method: 'GET',
                url: `/api/inventory?page=${page}&size=${size}&uid=${uid}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status !== 200) {
                new Error(res.data.message)
            }
            return res.data;
        } catch (error: any) {
            console.error(error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const deleteItemById = createAsyncThunk(
    "inventory/deleteItem",
    async ({id}:{id:string}, thunkAPI) => {
        const uid = getCurrentUser()?.uid;
        const token = await getCurrentUser()?.getIdToken()

        try {
            const res = await axios({
                method: 'DELETE',
                url: `/api/inventory/${id}?uid=${uid}`,
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status !== 200) {
                new Error(res.data.message)
            }
            return res.data;
        } catch (error: any) {
            console.error(error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const {setLoading,setError, setPage, setSize,setSelectedBrand,setItems} = inventorySlice.actions;
export default inventorySlice.reducer;