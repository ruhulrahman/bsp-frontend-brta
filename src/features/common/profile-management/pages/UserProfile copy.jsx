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
import helpers, { toaster } from '@/utils/helpers.js';
import { toBengaliNumber } from 'bengali-number';


const UserProfile = ({ t }) => {

  const dispatch = useDispatch();
  const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
  const currentLanguage = i18n.language;

  const { authUser } = useSelector((state) => state.auth) || {};

  const [initialValues, setInitialValues] = useState({
    nameBn: '',
    nameEn: '',
    mobile: '',
    email: '',
    isProfileCompleted: '',
    userDetails: {
      nidNumber: '',
      dob: '',
      fatherOrHusbandNameEn: '',
      fatherOrHusbandNameBn: '',
      motherNameEn: '',
      motherNameBn: '',
      genderId: '',
      presentAddressId: '',
      permanentAddressId: '',
      passportNumber: '',
      birthRegNumber: '',
      photo: '',
      bloodGroupId: '',
    }
  })

  const resetValues = {
    nameBn: '',
    nameEn: '',
    mobile: '',
    email: '',
    isProfileCompleted: '',
    userDetails: {
      nidNumber: '',
      dob: '',
      fatherOrHusbandNameEn: '',
      fatherOrHusbandNameBn: '',
      motherNameEn: '',
      motherNameBn: '',
      genderId: '',
      presentAddressId: '',
      permanentAddressId: '',
      passportNumber: '',
      birthRegNumber: '',
      photo: '',
      bloodGroupId: '',
      presentAddress: {
        holdingHouseVillage: '',
        roadBlockSectorColony: '',
        divisionId: '',
        districtId: '',
        locationId: '',
        postCode: '',
      },
      permanentAddress: {
        holdingHouseVillage: '',
        roadBlockSectorColony: '',
        divisionId: '',
        districtId: '',
        locationId: '',
        postCode: '',
      }
    }
  };

  const handleReset = (resetForm) => {
    resetForm({
      values: resetValues, // Reset to initial values
    });
  };

  const validationSchema = Yup.object().shape({
    nameBn: Yup.string().required('Name is required'),
    nameEn: Yup.string().required('Name is required'),
  });

  useEffect(() => {
    getUserProfileInfo();
  }, []);

  const getUserProfileInfo = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-auth-user-profile`)
      // console.log('data', data)
      setInitialValues(resetValues)
      setInitialValues(data);
      // console.log('initialValues', initialValues)
    } catch (error) {
      console.log('error', error)
    } finally {
      dispatch(setLoading(false));
    }
  }

  const [userUploadImage, setUserUploadImage] = useState(null);

  useEffect(() => {
    getUserProfilePhoto()
  }, [])

  const getUserProfilePhoto = async () => {

    try {
      const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-profile-photo`, {
        responseType: "text", // Use "arraybuffer" for PDFs and "text" for Base64
      })

      if (data) {
        const userPhoto = `data:image/jpeg;base64,${data}`
        setUserUploadImage(userPhoto)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {
    // console.log('values', values)
    dispatch(setLoading(true));
    try {
      let result = await RestApi.post('api/v1/admin/user-management/user/update-profile-info', values)

      // console.log('result', result)
      getUserProfileInfo()

      if (result.data.success) {
        toaster(data.message)
      }

    } catch (error) {
      console.log('error', error)
      setErrors(helper.getErrorMessage(error))
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid mx-auto max-w-screen-4xl px-4 lg:px-8 xl:px-16">

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
          // console.log('Form Submitted', values);
          // You can reset the form here as well after submission
          // handleReset(resetForm);
          onSubmit(values, setSubmitting, resetForm, setErrors);
        }}
      >
        {({ values, resetForm, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => {

          return (
            <FormikForm>
              <Loading loading={loading} loadingText={t('submitting')} />

              <div className="row">
                <div className="col-md-12">
                  <div className="card p-[16px] bg-cover rounded-[15px] border-none" style={{ backgroundImage: `url(${profileBackground})` }} id="profile">
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <div className="flex items-center justify-start">
                          <div className="flex-none">
                            <div className='w-[133px] h-[133px] rounded-full relative'>
                              {userUploadImage && (
                                <img src={userUploadImage} alt="" className="w-[133px] h-[133px] border-3 border-white rounded-full" />
                              )}
                              {!userUploadImage && (
                                <img src={manPhoto} alt="" className="w-[133px] h-[133px] border-3 border-white rounded-full" />
                              )}

                              {/* <div className='absolute bottom-0 h-[35px] left-0 bg-gray-200  text-black w-full text-center'> */}
                              <div className='absolute bottom-[-2px] left-0  w-full text-center'>
                                {/* <span className=" text-[12px] p-[3px] text-black">{currentLanguage === 'en' ? values?.userTypeNameEn : values?.userTypeNameBn}</span> */}
                                <span className="badge bg-success text-[10px] px-[8px] py-[4px]">{currentLanguage === 'en' ? values?.userTypeNameEn : values?.userTypeNameBn}</span>
                              </div>
                            </div>

                          </div>
                          <div className="flex-1 my-auto max-w-[700px] mx-[16px]">
                            <h3 className="text-[22px] xs:text-[16px]">{currentLanguage === 'bn' ? authUser?.nameBn : authUser?.nameEn}</h3>
                            {/* <span className="badge bg-secondary text-[12px] p-[3px]">{currentLanguage === 'en' ? values?.userTypeNameEn : values?.userTypeNameBn}</span> */}
                            <p className="text-[#778293] text-[16px] xs:text-[14px]">Joined on {helpers.dDate(authUser?.createdAt, 'DD MMM, YYYY')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="row mt-[24px]">
                <div className="col-md-12">
                  <div className="card px-[24px] pb-[8px] border-none">
                    <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('profileInformation')}</h3>

                    <div className="row">

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <div className="flex mb-3">
                          <span
                            className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('name')}:</span>
                          <input
                            className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg rounded-l-none -ml-1 w-4/6 text-black"
                            type="text" value={currentLanguage === 'en' ? values?.nameEn : values?.nameBn} readOnly />
                        </div>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <div className="flex mb-3">
                          <span
                            className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('email')}:</span>
                          <input
                            className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg  rounded-l-none -ml-1 w-4/6 text-black"
                            type="text" value={values?.email} readOnly />
                        </div>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <div className="flex mb-3">
                          <span
                            className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('username')}:</span>
                          <input
                            className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg  rounded-l-none -ml-1 w-4/6 text-black"
                            type="text" value={values?.username} readOnly />
                        </div>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <div className="flex mb-3">
                          <span
                            className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('mobile')}:</span>
                          <input
                            className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg  rounded-l-none -ml-1 w-4/6 text-black"
                            type="text" value={currentLanguage === 'en' ? values?.mobile : toBengaliNumber(values?.mobile)} readOnly />
                        </div>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <div className="flex mb-3">
                          <span
                            className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('userType')}:</span>
                          <input
                            className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg  rounded-l-none -ml-1 w-4/6 text-black"
                            type="text" value={currentLanguage === 'en' ? values?.userTypeNameEn : values?.userTypeNameBn} readOnly />
                        </div>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <div className="flex mb-3">
                          <span
                            className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('designation')}:</span>
                          <input
                            className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg  rounded-l-none -ml-1 w-4/6 text-black"
                            type="text" value={currentLanguage === 'en' ? values?.designationNameEn : values?.designationNameBn} readOnly />
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>

              <Loading loading={loading} loadingText={t('submitting')} />
              <div className="row mt-[24px]">
                <div className="col-md-12">
                  <div className="card px-[24px] pb-[16px] border-none">

                    <Loading loading={loading} loadingText={t('submitting')} />

                    <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('organizationWiseRole')}</h3>

                    {values.userOfficeRoles && values.userOfficeRoles.length > 0 && values.userOfficeRoles.map((item, index) => {

                      return (
                        <div key={index} className="row">

                          <div className="col-sm-12 col-lg-6 col-xl-6">
                            <div className="flex mb-3">
                              <span
                                className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('organization')}:</span>
                              <input
                                className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg  rounded-l-none -ml-1 w-4/6 text-black"
                                type="text" value={currentLanguage === 'en' ? item?.orgNameEn : item?.orgNameBn} readOnly />
                            </div>
                          </div>

                          <div className="col-sm-12 col-lg-6 col-xl-6">
                            <div className="flex mb-3">
                              <span
                                className="text-sm bg-blue-50 font-medium border-1 rounded-l px-4 py-1 w-2/6">{t('role')}:</span>
                              <input
                                className="px-2 border-l-0 cursor-default border-[#dee2e6] bg-[#e9ecef] focus:outline-none rounded-r-lg  rounded-l-none -ml-1 w-4/6 text-black"
                                type="text" value={currentLanguage === 'en' ? item?.roleNameEn : item?.roleNameBn} readOnly />
                            </div>
                          </div>

                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* <div className="row mt-[24px]">
                <div className="col-md-12 text-right">
                  <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{t('save_changes')}</button>
                  <button type='button' onClick={() => getUserProfileInfo()} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('cancel')}</button>
                </div>
              </div> */}

            </FormikForm>
          )
        }}
      </Formik>
    </div>
  );
};

export default withNamespaces()(UserProfile);
