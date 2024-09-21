import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { productInterface, productList } from "../types/product";

const apiUrl = "http://localhost:8000/api/products";

export const fetchProducts = createAsyncThunk<productInterface[], void>("products/fetchProducts", async () => {
    const response = await axios.get<productInterface[]>(apiUrl);
    return response.data;
});

export const deleteProduct = createAsyncThunk("product/delete", async (id:number) => {
    const response = await axios.delete( `${apiUrl}/${id}`);
    return response.data;
})

type statusInterface = "idle" | "loading" | "succeeded" | "failed"

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [] as productList,
        status: "idle" as statusInterface,
        deleteStatus: "idle" as statusInterface,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.status = "failed";
            })
            // status delete
            // .addCase(fetchProducts.pending, (state) => {
            //     state.deleteStatus = "loading";
            // })
            // .addCase(fetchProducts.fulfilled, (state) => {
            //     state.deleteStatus = "succeeded";
            // })
            // .addCase(fetchProducts.rejected, (state) => {
            //     state.deleteStatus = "failed";
            // });
            
    },
});

export default productSlice.reducer;