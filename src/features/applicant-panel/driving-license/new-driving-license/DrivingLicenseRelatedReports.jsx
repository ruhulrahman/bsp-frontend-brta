import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useContext, useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useParams } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import LearnerDrivingLicensePage from './LearnerDrivingLicensePage.jsx';
import EDrivingLicensePage from './EDrivingLicensePage.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import helpers, { toaster } from '@/utils/helpers.js';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { AuthContext } from '@/components/common/AuthContext';

const DrivingLicenseRelatedReports = () => {
const { t } = useTranslation();
    let { serviceRequestNo } = useParams()
    const dispatch = useDispatch();
    const { activeStatusList, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const { commonDropdowns, loadingContext } = useContext(AuthContext);

    useEffect(() => {
        if (!loadingContext) {
            console.log('commonDropdowns', commonDropdowns);
            console.log('Loading...');
            getLearnerData(serviceRequestNo);
        }
    }, [loadingContext, serviceRequestNo]); // Add loadingContext as a dependency


    const [learnerData, setLearnerData] = useState()

    const getLearnerData = async (serviceRequestNo) => {

        const params = Object.assign({ serviceRequestNo })
        dispatch(setLoading(true));
        try {
            const { data } = await RestApi.get('api/driving-license/v1/get-learner-by-service-request-no', { params })
            if (data && data.dlInformation) {
                const bloodGroup = dropdowns.bloodList.find(item => item.id == data.dlInformation.bloodGroupId)
                data.bloodGroup = bloodGroup ? bloodGroup : null;
            }
            setLearnerData(data)
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }


    if (loadingContext) {
        return <div>Loading... dropdowns</div>;
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 ">
                        <Tabs
                            defaultActiveKey="learnerLicense"
                            id="driving-license-related-reports-tab"
                            className="mb-3 bg-slate-300"
                            fill
                        >
                            <Tab eventKey="learnerLicense" title="Learner License">
                                <LearnerDrivingLicensePage learnerData={learnerData} />
                            </Tab>
                            {learnerData && learnerData.dlServiceRequest && learnerData.dlServiceRequest.applicationStatus && learnerData.dlServiceRequest.applicationStatus.statusCode === "dl_app_final_approved" && (
                                <Tab eventKey="eDrivingLicense" title="E-Driving License">
                                    <EDrivingLicensePage learnerData={learnerData} />
                                </Tab>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}

export default (DrivingLicenseRelatedReports)
