import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
            name_en: "Active",
            name_bn: "সক্রিয়",
            value: true,
        },
        {
            id: 2,
            name_en: "Inactive",
            name_bn: "নিষ্ক্রিয়",
            value: false,
        },
    ],
};

const commonSlice = createSlice({
    name: "dropdowns",
    initialState,
    reducers: {
        setCommonDropdowns: (state, action) => {
            state.dropdowns = action.payload.dropdowns;
        },
        removeCommonDropdowns: (state) => {
            state.dropdowns = undefined;
        },
    },
});

export const { setCommonDropdowns, removeCommonDropdowns } = commonSlice.actions;
export default commonSlice.reducer;
