import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useParams, useNavigate } from 'react-router-dom';
import AcsDrivingLicensePayment from '@/components/common/AcsDrivingLicensePayment';

const PaymentForDLSmartCard = () => {
    const { t } = useTranslation();

    const currentLanguage = i18n.language;
    let { serviceRequestId, serviceRequestNo, isViewable } = useParams();
    isViewable = isViewable === 'true' ? true : false

    const serviceCode = 'after_driving_skills_test_fees';

    return (
        <>
            <AcsDrivingLicensePayment
                title="Smart Card Driving License Fees"
                backUrl={`/applicant-panel/driving-license/new-driving-license/application-for-driving-license`}
                serviceCode={serviceCode}
                serviceRequestId={serviceRequestId}
                serviceRequestNo={serviceRequestNo}
            />
        </ >
    );
}

export default (PaymentForDLSmartCard)
