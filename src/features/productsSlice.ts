import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { productInterface, productList } from "../types/product";

const apiUrl = "http://localhost:8000/api/products";

export const fetchProducts = createAsyncThunk<productInterface[], void>("products/fetchProducts", async () => {
    const response = await axios.get<productInterface[]>(apiUrl);
    return response.data;
});

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
    },
});

export default productSlice.reducer;