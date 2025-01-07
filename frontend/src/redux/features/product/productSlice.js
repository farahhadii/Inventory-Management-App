import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";
import { toast } from "react-toastify";
import {logoutUser} from "../../../services/authService"

const initialState = {
  product: null,
  products: [],
  isError: false,
  isSuccess: false,
  message: "",
  totalStoreValue: 0,
  category: [],
  hasFetched: false, // Flag to track if products have been fetched
};

// Create New Product
export const createProduct = createAsyncThunk(
  "products/create",
  async (formData, thunkAPI) => {
    try {
      return await productService.createProduct(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProducts = createAsyncThunk(
  "products/getAll",
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        thunkAPI.dispatch(logoutUser());
        thunkAPI.dispatch(resetProductState());
      }
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a Product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id, thunkAPI) => {
    try {
      return await productService.getProduct(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update a Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: (state) => {
      Object.assign(state, initialState); 
    },
    CALC_STORE_VALUE(state, action) {
      const products = Array.isArray(action.payload) ? action.payload : [];
      state.totalStoreValue = products.reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return acc + price * quantity;
      }, 0);
    },
    CALC_CATEGORY(state, action) {
      const products = Array.isArray(action.payload) ? action.payload : [];
      state.category = [
        ...new Set(products.map((item) => item.category || "Unknown")),
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isError = false;
        state.products.push(action.payload);
        toast.success("Product created successfully!");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        toast.error(`Failed to create product: ${action.payload}`);
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.products = action.payload;
        } else {
          console.error("Invalid product data:", action.payload);
          state.products = [];
        }
        state.isSuccess = true;
        state.isError = false;
        state.hasFetched = true;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isError = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        );
        toast.success("Product deleted successfully!");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        toast.error(`Failed to delete product: ${action.payload}`);
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isError = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        toast.success("Product updated successfully!");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        toast.error(`Failed to update product: ${action.payload}`);
      });
  },
});

export const { resetProductState, CALC_STORE_VALUE, CALC_CATEGORY } =
  productSlice.actions;

export const selectProduct = (state) => state.product.product;
export const selectProducts = (state) => state.product.products;
export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
export const selectCategory = (state) => state.product.category;

export default productSlice.reducer;

