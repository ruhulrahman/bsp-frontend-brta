import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import i18n from '@/i18n';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import Loading from '@/components/common/Loading';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import manPhoto from '@/assets/images/man.png';
import profileBackground from '@/assets/images/profile-background.png';
import helper, { toaster } from '@/utils/helpers.js';

const DownloadReport = async (reportName, parameters) => {
    try {
        const response = await RestApi.post(
            `/api/reports/${reportName}`,
            parameters,
            { responseType: 'blob' } // Important to handle binary data
        );

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${reportName}.pdf`;
        link.click();
    } catch (error) {
        console.error('Error downloading report:', error);
    }
};

export default DownloadReport;
