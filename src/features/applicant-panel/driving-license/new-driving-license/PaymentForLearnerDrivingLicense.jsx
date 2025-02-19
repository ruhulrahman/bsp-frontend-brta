import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useParams, useNavigate } from 'react-router-dom';
import AcsDrivingLicensePayment from '@/components/common/AcsDrivingLicensePayment';

const PaymentForLearnerDrivingLicense = () => {
    const { t } = useTranslation();

    const currentLanguage = i18n.language;
    let { serviceRequestId, serviceRequestNo, isViewable } = useParams();
    isViewable = isViewable === 'true' ? true : false

    const serviceCode = 'before_driving_skills_test_fees';

    return (
        <div>
            <AcsDrivingLicensePayment
                title="Learner Driving License Fees"
                backUrl={`/applicant-panel/driving-license/new-driving-license/application-page2/${serviceRequestNo}`}
                serviceCode={serviceCode}
                serviceRequestId={serviceRequestId}
                serviceRequestNo={serviceRequestNo}
            />
        </div >
    );
}

export default (PaymentForLearnerDrivingLicense)
