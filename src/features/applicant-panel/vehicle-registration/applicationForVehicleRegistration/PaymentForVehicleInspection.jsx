import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import helpers, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { Windows } from 'react-bootstrap-icons';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { Link } from "react-router-dom";
import AcsVehiclePayment from '../../../../components/common/AcsVehiclePayment';

const PaymentForVehicleInspection = () => {
    const { t } = useTranslation();

    const currentLanguage = i18n.language;
    let { serviceRequestId, serviceRequestNo } = useParams();

    const [serviceCode, setServiceCode] = useState('vehicle_registration_related_primary_fees')

    return (
        <>
            <AcsVehiclePayment
                title="Vehicle Registration Inspection Related Fees"
                backUrl={`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page4/${serviceRequestId}`}
                serviceCode={serviceCode}
                serviceRequestId={serviceRequestId}
                serviceRequestNo={serviceRequestNo}
            />
        </>
    );
}

export default (PaymentForVehicleInspection)
