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

const ApplicantProfile = ({ t }) => {

  const dispatch = useDispatch();
  const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
  const currentLanguage = i18n.language;

  const { authUser } = useSelector((state) => state.auth) || {};
  const [isViewable, setIsViewable] = useState(false)

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
      const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-profile-info`)
      console.log('data', data)
      setInitialValues(resetValues)
      setInitialValues(data);
      console.log('initialValues', initialValues)
    } catch (error) {
      console.log('error', error)
    } finally {
      dispatch(setLoading(false));
    }
  }

  const [userUploadImage, setUserUploadImage] = useState(null);

  useEffect(() => {
    getUserProfilePhoto()
},[])

const getUserProfilePhoto = async () => {

    try {
        const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-profile-photo`,{
            responseType: "text", // Use "arraybuffer" for PDFs and "text" for Base64
        })
        const userPhoto = `data:image/jpeg;base64,${data}`
        setUserUploadImage(userPhoto)
    } catch (error) {
        console.log('error', error)
    }
}

  const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {
    console.log('values', values)
    dispatch(setLoading(true));
    try {
      let result = await RestApi.post('api/v1/admin/user-management/user/update-profile-info', values)

      console.log('result', result)
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

  const [districtListPermanent, setDistrictListPermanent] = useState([]);
  const [thanaListPermanent, setThanaListPermanent] = useState([]);

  const [districtListPresent, setDistrictListPresent] = useState([]);
  const [thanaListPresent, setThanaListPresent] = useState([]);

  const getLocationListByParentId = async (parentId, addressType = 'permanent', locationType = 'district') => {

    try {
      const { data } = await RestApi.get(`api/v1/admin/common/get-locations-by-parent-location-id/${parentId}`)
      if (addressType == 'permanent') {
        if (locationType == 'district') {
          setDistrictListPermanent(data.locationList);
        } else if (locationType == 'thana') {
          setThanaListPermanent(data.locationList);
        }
      } else if (addressType == 'present') {
        if (locationType == 'district') {
          setDistrictListPresent(data.locationList);
        } else if (locationType == 'thana') {
          setThanaListPresent(data.locationList);
        }
      }
      // setDistrictList(data.locationList);
    } catch (error) {
      console.log('error', error)
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




          useEffect(() => {
            if (values.userDetails?.permanentAddress?.divisionId) {
              getLocationListByParentId(values.userDetails?.permanentAddress?.divisionId, 'permanent', 'district');
            }
          }, [values.userDetails?.permanentAddress?.divisionId]);

          useEffect(() => {
            if (values.userDetails?.permanentAddress?.districtId) {
              getLocationListByParentId(values.userDetails?.permanentAddress?.districtId, 'permanent', 'thana');
            }
          }, [values.userDetails?.permanentAddress?.districtId]);

          useEffect(() => {
            if (values.userDetails?.presentAddress?.divisionId) {
              getLocationListByParentId(values.userDetails?.presentAddress?.divisionId, 'present', 'district');
            }
          }, [values.userDetails?.presentAddress?.divisionId]);

          useEffect(() => {
            if (values.userDetails?.presentAddress?.districtId) {
              getLocationListByParentId(values.userDetails?.presentAddress?.districtId, 'present', 'thana');
            }
          }, [values.userDetails?.presentAddress?.districtId]);

          const [isEditEmail, setIsEditEmail] = useState(false);
          const [isEditMobile, setIsEditMobile] = useState(false);

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
                            {userUploadImage && (
                                <img src={userUploadImage} alt="" className="w-[133px] h-[133px] border-3 border-white rounded-full" />
                            )}
                            {!userUploadImage && (
                                <img src={manPhoto} alt="" className="w-[133px] h-[133px] border-3 border-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 my-auto max-w-[700px] mx-[16px]">
                            <h3 className="text-[22px] xs:text-[16px]">{currentLanguage === 'bn' ? authUser?.nameBn : authUser?.nameEn}</h3>
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
                    <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('personalInformation')}</h3>

                    <div className="row">

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('nationalIdentityNo')}</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.nidNumber" className="form-control" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('date_of_birth')}</Form.Label>
                          <Field disabled={true} type="date" name="userDetails.dob" className="form-control" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('name')} ({t('en')})</Form.Label>
                          <Field disabled={true} type="text" name="nameEn" className="form-control" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                          <Field disabled={true} type="text" name="nameBn" className="form-control" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('fatherHusbandName')} ({t('bn')})</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.fatherOrHusbandNameBn" className="form-control" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('motherName')} ({t('bn')})</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.motherNameBn" className="form-control" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('fatherHusbandName')} ({t('en')}) <span className='text-red-500'>*</span></Form.Label>
                          <Field disabled={isViewable} type="text" name="userDetails.fatherOrHusbandNameEn" className="form-control" placeholder={t('enterSomething')} />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('motherName')} ({t('en')}) <span className='text-red-500'>*</span></Form.Label>
                          <Field disabled={isViewable} type="text" name="userDetails.motherNameEn" className="form-control" placeholder={t('enterSomething')} />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3 mt-3">
                          <Form.Label>{t('gender')}</Form.Label>
                          {dropdowns.genderList && dropdowns.genderList.map((item, index) => (
                            <>
                              <button key={item.id} disabled className='btn btn-sm btn-outline-secondary ml-2'>
                                <Field disabled={isViewable} type="radio" name="userDetails.genderId" value={item.id} id={`gender-${item.id}`} className="form-check-input" />
                                <span className='ml-1 mr-4'>{currentLanguage === 'bn' ? item.nameBn : item.nameEn}</span>
                              </button>
                            </>
                          ))}
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3" controlId="userDetails.bloodGroupId">
                          <Form.Label>{t('bloodGroup')} <span className='text-red-500'>*</span></Form.Label>
                          <Field
                            disabled={isViewable}
                            name="userDetails.bloodGroupId"
                            component={ReactSelect}
                            options={dropdowns.bloodList}
                            placeholder={t('pleaseSelectOne')}
                            value={values.userDetails?.bloodGroupId}
                            onChange={(option) => {
                              setFieldValue('userDetails.bloodGroupId', option ? option.value : '')
                            }}
                          />
                          <ErrorMessage name="nationalityId" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                    </div>

                  </div>
                </div>
              </div>

              <div className="row mt-[24px]">

                <div className="col-md-6">
                  <div className="card px-[24px] border-none">
                    <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('presentAddress')}</h3>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-[24px]" controlId="userDetails.presentAddress.holdingHouseVillage">
                          <Form.Label>{t('holdingNoVillageHouse')} ({t('bn')})</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.presentAddress.holdingHouseVillage" className="form-control" placeholder={t('enterSomething')} />
                          <ErrorMessage name="userDetails.presentAddress.holdingHouseVillage" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-[24px]" controlId="userDetails.presentAddress.roadBlockSectorColony">
                          <Form.Label>{t('roadBlockSectorColony')} ({t('bn')})</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.presentAddress.roadBlockSectorColony" className="form-control" placeholder={t('enterSomething')} />
                          <ErrorMessage name="userDetails.presentAddress.roadBlockSectorColony" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-3" controlId="userDetails.permanentAddress.divisionId">
                          <Form.Label>{t('division')} <span className='text-red-500'>*</span></Form.Label>
                          <Field
                            disabled={true}
                            name="userDetails.permanentAddress.divisionId"
                            component={ReactSelect}
                            options={dropdowns.divisionList}
                            placeholder={t('pleaseSelectOne')}
                            value={values.userDetails?.permanentAddress?.divisionId}
                            onChange={(option) => {
                              const selectedValue = option ? option.value : '';
                              setFieldValue('userDetails.permanentAddress.divisionId', selectedValue);
                              if (!selectedValue) {
                                setDistrictListPermanent([])
                              }
                            }}
                          />
                          <ErrorMessage name="userDetails.permanentAddress.divisionId" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-3" controlId="userDetails.permanentAddress.districtId">
                          <Form.Label>{t('district')} <span className='text-red-500'>*</span></Form.Label>
                          <Field
                            disabled={true}
                            name="userDetails.permanentAddress.districtId"
                            component={ReactSelect}
                            options={districtListPermanent}
                            placeholder={t('pleaseSelectOne')}
                            value={values.userDetails?.permanentAddress?.districtId}
                            onChange={(option) => {
                              const selectedValue = option ? option.value : '';
                              setFieldValue('userDetails.permanentAddress.districtId', selectedValue);
                              if (!selectedValue) {
                                setThanaListPermanent([])
                              }
                            }}
                          />
                          <ErrorMessage name="userDetails.permanentAddress.districtId" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-3" controlId="userDetails.permanentAddress.locationId">
                          <Form.Label>{t('thana')} <span className='text-red-500'>*</span></Form.Label>
                          <Field
                            disabled={true}
                            name="userDetails.permanentAddress.locationId"
                            component={ReactSelect}
                            options={thanaListPermanent}
                            placeholder={t('pleaseSelectOne')}
                            value={values.userDetails?.permanentAddress?.locationId}
                            onChange={(option) => {
                              setFieldValue('userDetails.permanentAddress.locationId', option ? option.value : '')
                            }}
                          />
                          <ErrorMessage name="userDetails.permanentAddress.locationId" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-[24px]" controlId="userDetails.presentAddress.postCode">
                          <Form.Label>{t('postCode')}</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.presentAddress.postCode" className="form-control" placeholder={t('enterSomething')} />
                          <ErrorMessage name="userDetails.presentAddress.postCode" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card px-[24px] border-none">
                    <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('permanentAddress')}</h3>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-[24px]" controlId="userDetails.permanentAddress.holdingHouseVillage">
                          <Form.Label>{t('holdingNoVillageHouse')} ({t('bn')})</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.permanentAddress.holdingHouseVillage" className="form-control" placeholder={t('enterSomething')} />
                          <ErrorMessage name="userDetails.permanentAddress.holdingHouseVillage" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-[24px]" controlId="userDetails.permanentAddress.roadBlockSectorColony">
                          <Form.Label>{t('roadBlockSectorColony')} ({t('bn')})</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.permanentAddress.roadBlockSectorColony" className="form-control" placeholder={t('enterSomething')} />
                          <ErrorMessage name="userDetails.permanentAddress.roadBlockSectorColony" component="div" className="text-danger" />
                        </Form.Group>
                      </div>


                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-3" controlId="userDetails.permanentAddress.divisionId">
                          <Form.Label>{t('division')} <span className='text-red-500'>*</span></Form.Label>
                          <Field
                            disabled={true}
                            name="userDetails.permanentAddress.divisionId"
                            component={ReactSelect}
                            options={dropdowns.divisionList}
                            placeholder={t('pleaseSelectOne')}
                            value={values.userDetails?.permanentAddress?.divisionId}
                            onChange={(option) => {
                              const selectedValue = option ? option.value : '';
                              setFieldValue('userDetails.permanentAddress.divisionId', selectedValue);
                              if (!selectedValue) {
                                setDistrictListPermanent([])
                              }
                            }}
                          />
                          <ErrorMessage name="userDetails.permanentAddress.divisionId" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-3" controlId="userDetails.permanentAddress.districtId">
                          <Form.Label>{t('district')} <span className='text-red-500'>*</span></Form.Label>
                          <Field
                            disabled={true}
                            name="userDetails.permanentAddress.districtId"
                            component={ReactSelect}
                            options={districtListPermanent}
                            placeholder={t('pleaseSelectOne')}
                            value={values.userDetails?.permanentAddress?.districtId}
                            onChange={(option) => {
                              const selectedValue = option ? option.value : '';
                              setFieldValue('userDetails.permanentAddress.districtId', selectedValue);
                              if (!selectedValue) {
                                setThanaListPermanent([])
                              }
                            }}
                          />
                          <ErrorMessage name="userDetails.permanentAddress.districtId" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-3" controlId="userDetails.permanentAddress.locationId">
                          <Form.Label>{t('thana')} <span className='text-red-500'>*</span></Form.Label>
                          <Field
                            disabled={true}
                            name="userDetails.permanentAddress.locationId"
                            component={ReactSelect}
                            options={thanaListPermanent}
                            placeholder={t('pleaseSelectOne')}
                            value={values.userDetails?.permanentAddress?.locationId}
                            onChange={(option) => {
                              setFieldValue('userDetails.permanentAddress.locationId', option ? option.value : '')
                            }}
                          />
                          <ErrorMessage name="userDetails.permanentAddress.locationId" component="div" className="text-danger" />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-md-12 col-xl-6 col-xxl-6">
                        <Form.Group className="mb-[24px]" controlId="userDetails.permanentAddress.postCode">
                          <Form.Label>{t('postCode')}</Form.Label>
                          <Field disabled={true} type="text" name="userDetails.permanentAddress.postCode" className="form-control" placeholder={t('enterSomething')} />
                          <ErrorMessage name="userDetails.permanentAddress.postCode" component="div" className="text-danger" />
                        </Form.Group>
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

                    <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('otherInformation')}</h3>

                    <div className="row">

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-1">
                          <Form.Label>{t('email')} <span className='text-red-500'>*</span></Form.Label>
                          <Field disabled={!isEditEmail} type="text" name="email" className="form-control" placeholder={t('enterSomething')} />
                        </Form.Group>
                        <div className='mb-3'>
                          <Field
                            type="checkbox"
                            id={`email`}
                            name="isEditEmail"
                            value={isEditEmail}
                            checked={isEditEmail}
                            onChange={() => {
                              setIsEditEmail(!isEditEmail)
                            }}
                            className="form-check-input" />
                          <span className='ml-1 mr-4 text-[14px]'>{t('changeEmail')}</span>
                        </div>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-1">
                          <Form.Label>{t('mobile')} ({t('en')}) <span className='text-red-500'>*</span></Form.Label>
                          <Field disabled={!isEditMobile} type="text" name="mobile" className="form-control" placeholder={t('enterSomething')} />
                        </Form.Group>
                        <div className='mb-3'>
                          <Field
                            type="checkbox"
                            id={`mobile`}
                            name="isEditMobile"
                            value={isEditMobile}
                            checked={isEditMobile}
                            onChange={() => {
                              setIsEditMobile(!isEditMobile)
                            }}
                            className="form-check-input" />
                          <span className='ml-1 mr-4 text-[14px]'>{t('changeMobile')}</span>
                        </div>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('passportNumber')} ({t('en')})</Form.Label>
                          <Field disabled={false} type="text" name="userDetails.passportNumber" className="form-control" placeholder={t('enterSomething')} />
                        </Form.Group>
                      </div>

                      <div className="col-sm-12 col-lg-6 col-xl-6">
                        <Form.Group className="mb-3">
                          <Form.Label>{t('birthRegNumber')} ({t('en')})</Form.Label>
                          <Field disabled={false} type="text" name="userDetails.birthRegNumber" className="form-control" placeholder={t('enterSomething')} />
                        </Form.Group>
                      </div>

                    </div>

                  </div>
                </div>
              </div>

              <div className="row mt-[24px]">
                <div className="col-md-12 text-right">
                  <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{t('save_changes')}</button>
                  <button type='button' onClick={() => getUserProfileInfo()} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('cancel')}</button>
                </div>
              </div>

            </FormikForm>
          )
        }}
      </Formik>
    </div>
  );
};

export default withNamespaces()(ApplicantProfile);
