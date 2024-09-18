import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    listData: [],
    windowSize: 10,
    showFilter: true,
    selectedRow: null,
    selectedRows: [],
    filter: {
        search: "",
        dateFrom: null,
        dateTo: null,
        countryId: null,
        genderId: null,
        bloodId: null,
        designationId: null,
        documentTypeId: null,
        fuelTypeId: null,
        userTypeId: null,
        serviceId: null,
        vehicleTypeId: null,
        vehicleColorId: null,
        vehicleColorId: null,
    },
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
        countryList: [],
        genderList: [],
        bloodList: [],
        designationList: [],
        documentTypeList: [],
        fuelTypeList: [],
        userTypeList: [],
        serviceList: [],
        vehicleTypeList: [],
        vehicleColorList: [],
    },
    activeStatusList: [
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
        setCommonDropdowns: (state, action) => {
            state.dropdowns = action.payload;
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
        setShowFilter: (state, action) => {
            state.showFilter = state, action;
        },
        toggleShowFilter: (state) => {
            state.showFilter = !state.showFilter
        },
    },
});

export const { 
    setLoading, setListData, 
    setCommonDropdowns, removeCommonDropdowns, 
    setCurrentPage, setResetPagination, setPaginationData,
    setShowFilter, toggleShowFilter
 } = commonSlice.actions;
export default commonSlice.reducer;
