import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    listData: [],
    pagination: {
        currentPage: 0,
        perPage: 5,
        totalRows: 0,
        totalPages: 0,
        slOffset: 1,
    },
    resetPagination: {
        currentPage: 0,
        perPage: 5,
        totalRows: 0,
        totalPages: 0,
        slOffset: 1,
    },
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
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setResetPagination: (state) => {
            state.pagination = state.resetPagination;
        },
        setPaginationData: (state, action) => {
            console.log('action ====', action)
            state.pagination.currentPage = action.payload.page;
            state.pagination.totalRows = action.payload.totalElements;
            state.pagination.perPage = action.payload.size;
            state.pagination.totalPages = action.payload.totalPages;
            console.log('pagination.perPage ====', pagination.perPage)
            console.log('pagination.currentPage ====', pagination.perPage)
            state.pagination.slOffset = state.pagination.perPage * (state.pagination.currentPage + 1) - state.pagination.perPage + 1;
        },
    },
});

export const { 
    setLoading, setListData, 
    setCommonDropdowns, removeCommonDropdowns, 
    setCurrentPage, setResetPagination, setPaginationData
 } = commonSlice.actions;
export default commonSlice.reducer;
