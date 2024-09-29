import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Create an async thunk for the API call
export const fetchCommonDropdowns = createAsyncThunk(
  'user/fetchUser', // name the action type
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // return error message if failed
    }
  }
);

// 2. Create a slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: {},
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous actions here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommonDropdowns.pending, (state) => {
        state.loading = true;
        state.error = null; // clear any existing errors
      })
      .addCase(fetchCommonDropdowns.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload; // store the fetched user data
      })
      .addCase(fetchCommonDropdowns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // store error message
      });
  },
});

// 3. Export the async thunk and reducer
export const { reducer: userReducer } = userSlice;
