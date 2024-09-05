import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: undefined,
    authUser: {
        name_en: "Ruhul Amin",
        name_bn: "রুহুল আমিন",
        username: "Ruhul",
        email: "",
        roles: [],
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.authUser = action.payload.authUser;
        },
        removeAuthUser: (state) => {
            state.accessToken = undefined;
            state.authUser = undefined;
        },
    },
});

export const { setAuthUser, removeAuthUser } = authSlice.actions;
export default authSlice.reducer;
