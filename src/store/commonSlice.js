import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    listData: [],
    dropdowns: {
        countries: [],
        genders: [],
        bloods: [],
        designations: [],
        documentTypes: [],
        fuelTypes: [],
        userTypes: [],
        services: [],
        vehicleTypes: [],
        vehicleColors: [],
        vehicleColors: [],
    },
    statusList: [
        {
            id: 1,
            nameEn: "Active",
            nameBn: "সক্রিয়",
            value: true,
        },
        {
            id: 2,
            nameEn: "Inactive",
            nameBn: "নিষ্ক্রিয়",
            value: false,
        },
    ],
};

const commonSlice = createSlice({
    name: "dropdowns",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setListData: (state, action) => {
            state.listData = action.payload;
        },
        removeCommonDropdowns: (state) => {
            state.dropdowns = undefined;
        },
        setCommonDropdowns: (state, action) => {
            state.dropdowns = action.payload.dropdowns;
        },
        removeCommonDropdowns: (state) => {
            state.dropdowns = undefined;
        },
    },
});

export const { setLoading, setListData, setCommonDropdowns, removeCommonDropdowns } = commonSlice.actions;
export default commonSlice.reducer;
