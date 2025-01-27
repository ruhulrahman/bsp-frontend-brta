import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: undefined,
    tokenInfo: undefined,
    authUser: undefined,
    userOfficeRole: undefined,
    roleSet: false,
    permissions: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.accessToken = action.payload;
        },
        removeToken: (state) => {
            state.accessToken = undefined;
        },
        setAuthUser: (state, action) => {
            // console.log('action====', action)
            // state.accessToken = action.payload.accessToken;
            removeAuthUser()
            state.authUser = action.payload;
        },
        removeAuthUser: (state) => {
            // state.accessToken = undefined;
            state.authUser = undefined;
        },
        setOfficeRole: (state, action) => {
            state.roleSet = true;
        },
        removeOfficeRole: (state) => {
            state.roleSet = false;
        },
        setUserOfficeRole: (state, action) => {
            state.userOfficeRole = action.payload;
        },
        removeUserOfficeRole: (state) => {
            state.userOfficeRole = undefined;
        },
        setTokenInfo: (state, action) => {
            state.tokenInfo = action.payload;
        },
        removeTokenInfo: (state) => {
            state.tokenInfo = undefined;
            state.authUser = undefined;
        },
        setUserPermissions: (state, action) => {
            state.permissions = []
            state.permissions = action.payload
        },
        removeUserPermissions: (state) => {
            state.permissions = []
        },
    },
});

export const {
    setAuthUser, removeAuthUser,
    setToken, removeToken,
    setTokenInfo, removeTokenInfo,
    setUserPermissions, removeUserPermissions,
    setUserOfficeRole, removeUserOfficeRole,
    setOfficeRole, removeOfficeRole
} = authSlice.actions;
export default authSlice.reducer;
