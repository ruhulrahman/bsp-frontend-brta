import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import RestApi from '@/utils/RestApi';

// 1. Create an async thunk for the API call
export const fetchCommonDropdowns = createAsyncThunk(
    'common/fetchCommonDropdowns', // name the action type
    async ({ rejectWithValue }) => {
        try {
            console.log('clicked =====')
            const response = await RestApi.get(`/api/v1/admin/configurations/common-dropdown-list`);
            console.log('response =========', response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data); // return error message if failed
        }
    }
);

export const updateAndFetchDropdowns = createAsyncThunk(
    'common/updateAndFetchDropdowns',
    async ({ newItem }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await RestApi.get('/api/v1/admin/common/dropdown-list');
            dispatch(setCommonDropdowns(data.data)); // Update the Redux store
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update");
        }
    }
);

export const getCommonDropdowns = async (dispatch) => {
    try {
        console.log('clicked =====')
        const { data } = await RestApi.get('api/v1/admin/common/dropdown-list')
        dispatch(setCommonDropdowns(data.data));
    } catch (error) {
        console.log('error', error)
    }
};

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
    },
    pagination: {
        currentPage: 0,
        perPage: 20,
        totalRows: 0,
        totalPages: 0,
        slOffset: 1,
    },
    resetPagination: {
        currentPage: 0,
        perPage: 20,
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
        statusGroupList: [],
        statusList: [],
        fiscalYearList: [],
        appointmentTimeSlotList: [],
        locationTypeList: [],
        routePermitTypes: [],
        paymentStatusList: [],
        revenueCheckStatusList: [],
        inspectionStatusList: [],
        acquisitionProcessList: [],
        usedByList: [],
        vehicleApplicationCheckStatusList: [],
        userList: [],
        ownerTypeList: [],
        // Driving License Related Start =====================================
        occupationList: [],
        educationalQualificationList: [],
        maritalStatusList: [],
        languageList: [],
        drivingLicenseClassList: [],
        drivingLicenseTypeList: [],
        addressTypeList: [],
        drivingLicenseApplicationTypeList: [],
        applicantTypeList: [],
        drivingLicenseApplicationStatusList: [],
        relationshipList: [],
        // Driving License Related End =====================================
    },
    activeStatusList: [
        {
            id: true,
            nameEn: "Active",
            nameBn: "সক্রিয়",
            value: true,
        },
        {
            id: false,
            nameEn: "Inactive",
            nameBn: "নিষ্ক্রিয়",
            value: false,
        },
    ],
    yesNoList: [
        {
            id: true,
            nameEn: "Yes",
            nameBn: "হ্যা",
            value: true,
        },
        {
            id: false,
            nameEn: "No",
            nameBn: "না",
            value: false,
        },
    ],
    permissionTypeList: [
        {
            id: 1,
            value: 1,
            nameEn: "Page",
            nameBn: "পৃষ্ঠা",
        },
        {
            id: 2,
            value: 2,
            nameEn: "Feature",
            nameBn: "ফিচার",
        },
    ],
};

const commonSlice = createSlice({
    name: "common",
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommonDropdowns.pending, (state) => {
                state.loading = true;
                state.error = null; // clear any existing errors
            })
            .addCase(fetchCommonDropdowns.fulfilled, (state, action) => {
                state.loading = false;
                state.dropdowns = action.payload; // store the fetched user data
            })
            .addCase(fetchCommonDropdowns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // store error message
            });
    },
});

export const {
    setLoading, setListData,
    setCommonDropdowns, removeCommonDropdowns,
    setCurrentPage, setResetPagination, setPaginationData,
    setShowFilter, toggleShowFilter
} = commonSlice.actions;
export default commonSlice.reducer;
