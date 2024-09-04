import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import authSliceReducer from '../features/common/auth/authSlice'

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    auth: authSliceReducer,
  },
})