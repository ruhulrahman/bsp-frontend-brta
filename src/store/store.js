import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from '../features/common/auth/authSlice'
import commonSliceReducer from './commonSlice'

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    common: commonSliceReducer,
  },
})