import logo from '@/assets/images/logo.png';
import i18n from '@/i18n';
import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import slider6 from '@/assets/images/slider/slider-6.jpg';
import carDrive from '@/assets/images/home/car-drive.png';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
// import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import Loading from '@/components/common/Loading';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import { toBengaliNumber } from 'bengali-number';

const FooterSection = ({ t }) => {
    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)

    const currentLanguage = i18n.language;

    return (
        <div className="container-fluid bg-[#5d7383] text-white fixed bottom-0 left-0 w-full">
            <div className="row">
                <div className="col-md-12">
                    <div className="flex">
                        <div className="flex-1 my-auto mx-auto">
                            {/* <p className="leading-7 text-center p-[40px]">{t('Copyright © 2024 - All right reserved by Bangladesh Road Transport Authority (BRTA)')}</p> */}
                            <p className="leading-7 text-center p-[8px] text-[12px]">{t('copyright')} © {currentLanguage === 'en' ? new Date().getFullYear() : toBengaliNumber(new Date().getFullYear())} - {t('allRightReservedBybrtafullName')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withNamespaces()(FooterSection);
