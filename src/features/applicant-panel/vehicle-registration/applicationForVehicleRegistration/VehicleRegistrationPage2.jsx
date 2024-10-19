import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import helper, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'

const VehicleRegistrationPage1 = ({ t }) => {

    let { id, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const findItem = listData?.find((item) => item.id == id)

    const [initialValues, setInitialValues] = useState({
        billOfEntryNumber: '',
        billOfEntryDate: '',
        billOfEntryOfficeCode: '',
        hsCode: '',
        importerId: '',
        makerId: '',
        exporterId: '',
        agent: '',
        productLocation: '',
        productDescription: '',
        invoiceNumber: '',
        invoiceDate: '',
        isElectrictVehicle: '',
        ccOrKw: '',
        manufacturingYear: '',
        vehicleTypeId: '',
        vehicleClassId: '',
        bodyColorId: '',
        bodyColorId: '',
        bodyColorId: '',
        bodyColorId: '',
        bodyColorId: '',
        isActive: true,
    })


    const resetValues = {
        billOfEntryNumber: '',
        billOfEntryDate: '',
        billOfEntryOfficeCode: '',
        hsCode: '',
        importerId: '',
        password: '',
        confirmPassword: '',
        userTypeId: '',
        designationId: '',
        isActive: true,
        userOfficeRoles: [
            {
                orgId: null,
                roleId: null
            }
        ]
    }

    const validationSchema = Yup.object().shape({
        nameBn: Yup.string().required('Name is required'),
        nameEn: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        mobile: Yup.string()
            .matches(/^\d{11}$/, "Mobile number must be exactly 11 digits")
            .required("Mobile number is required"),
        email: Yup.string().email("Invalid email format").required('Email is required'),
        password: Yup.string()
            .when('id', {
                is: (id) => !id,  // When id is not present (new entry)
                then: schema => schema.matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
                ).required('Password is required'),
                // then: schema => schema.required('Password is required')
                //     .matches(
                //         /^(?=.*[A-Z]).+$/,
                //         'Must contain at least one uppercase letter'
                //     )
                //     .matches(
                //         /^(?=.*[a-z]).+$/,
                //         'Must contain at least one lowercase letter'
                //     )
                //     .matches(
                //         /^(?=.*\d)/,
                //         'Must contain at least one number'
                //     )
                //     .matches(
                //         /^(?=.*[@$!%*?&]).+$/,
                //         'Must contain at least one special character'
                //     ).min(8, 'Must be at least 8 characters'),
                otherwise: schema => schema.optional(),
            }),
        confirmPassword: Yup.string()
            .when('id', {
                is: (id) => !id,  // When id is not present (new entry)
                then: schema => schema.oneOf([Yup.ref('password'), null], "Confirm password must match")
                    .required('Confirm password is required'),
                otherwise: schema => schema.optional(),
            }),
        userTypeId: Yup.string().required('User type is required'),
        designationId: Yup.string().required('Designation is required'),
        isActive: Yup.boolean().required('Is active is required'),
        userOfficeRoles: Yup.array().of(
            Yup.object().shape({
                orgId: Yup.string().required('Office is required'),
                roleId: Yup.string().required('Role is required')
            })
        )
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };


    const [parentChildPermissionList, setParentChildPermissionList] = useState([]);


    const [officeList, setOfficeList] = useState([]);
    const [roleList, setRoleLis] = useState([]);

    useEffect(() => {
        getOfficeList();
        getActiveRoleList();
    }, []);

    // Fetch the role by id after the parent-child list is ready
    useEffect(() => {
        if (id) {
            getUserById(id);
        } else {
            setInitialValues(resetValues);
        }
    }, [id, officeList]);

    const getOfficeList = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-active-orgation-list`)
            console.log('data', data)
            setOfficeList(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getActiveRoleList = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/role/active-list`)
            setRoleLis(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getUserById = async (id) => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/${id}`)
            if (data.userOfficeRoles.length == 0) {
                data.userOfficeRoles = [{
                    orgId: null,
                    roleId: null
                }]
            }
            setInitialValues(data);
            console.log('initialValues', initialValues)

            // Make sure parentChildPermissionList is available
            // parentChildPermissionList.map((item) => {
            //     let newIds = [];
            //     let checkedIds = [];

            //     // Collect item IDs
            //     newIds.push(item.id);
            //     item.pageList.forEach((page) => newIds.push(page.id));
            //     item.featureList.forEach((feature) => newIds.push(feature.id));

            //     // Compare with initialValues.permissionIds
            //     newIds.forEach((id) => {
            //         if (data.permissionIds.includes(id)) {
            //             checkedIds.push(id);
            //         }
            //     });

            //     // Check if all IDs are checked
            //     if (newIds.length === checkedIds.length) {
            //         item.checkedAll = true;
            //     }

            //     // Update item with checked status
            //     return Object.assign(item);
            // });

        } catch (error) {
            console.log('error', error)
        }
    }

    const onSubmit = async (values, setSubmitting, resetForm) => {
        handleSave(values, setSubmitting, resetForm);
    };

    const handleSave = async (values, setSubmitting, resetForm) => {

        try {
            let result = ''
            if (values.id) {
                result = await RestApi.put(`api/v1/admin/user-management/user/update/${values.id}`, values)
            } else {
                result = await RestApi.post('api/v1/admin/user-management/user/create', values)
            }

            if (result.data.success) {
                toaster(result.data.message)
                navigate('/admin/user-management/user-list')
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <div>
            <div>
                <CardHeader>
                    {/* <CardTitle className='mb-2'>{id ? t('edit') : t('add_new')} {t('user')}</CardTitle> */}
                    <CardTitle className='mb-2'>{t('applicationForVehicleRegistration')} - {t('page')} - {currentLanguage === 'en' ? 1 : toBengaliNumber(1)}</CardTitle>
                </CardHeader>
                <div>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('submitting')} />

                                <Card className='mb-3'>
                                    <CardBody>
                                        <div className="row mb-3">

                                            <h4 className="my-2 font-bold text-green-900">{t('billOfEntry')}</h4>
                                            <hr className='my-3' />

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="billOfEntryNumber">
                                                    <Form.Label>{t('billOfEntryNumber')}</Form.Label>
                                                    <Field disabled={isViewable} type="text" name="billOfEntryNumber" className="form-control" placeholder="Enter bill Of Entry Number" />
                                                    <ErrorMessage name="billOfEntryNumber" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="billOfEntryDate">
                                                    <Form.Label>{t('billOfEntryDate')}</Form.Label>
                                                    <Field disabled={isViewable} type="date" name="billOfEntryDate" className="form-control" placeholder="Enter bill Of Entry date" />
                                                    <ErrorMessage name="billOfEntryDate" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="username">
                                                    <Form.Label>{t('username')}</Form.Label>
                                                    <Field disabled={isViewable} type="text" name="username" className="form-control" placeholder="Enter username" />
                                                    <ErrorMessage name="username" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="mobile">
                                                    <Form.Label>{t('mobile')}</Form.Label>
                                                    <Field disabled={isViewable} type="text" name="mobile" className="form-control" placeholder="Enter mobile" />
                                                    <ErrorMessage name="mobile" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="email">
                                                    <Form.Label>{t('email')}</Form.Label>
                                                    <Field disabled={isViewable} type="text" name="email" className="form-control" placeholder="Enter email" />
                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            {!values.id &&
                                                <div className="col-md-4 col-lg-3">
                                                    <Form.Group className="mb-3" controlId="password">
                                                        <Form.Label>{t('password')}</Form.Label>
                                                        <Field disabled={isViewable} type="password" name="password" className="form-control" placeholder="Enter password" />
                                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>
                                            }

                                            {!values.id &&
                                                <div className="col-md-4 col-lg-3">
                                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                                        <Form.Label>{t('confirmPassword')}</Form.Label>
                                                        <Field disabled={isViewable} type="password" name="confirmPassword" className="form-control" placeholder="Enter confirm password" />
                                                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>
                                            }

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="userTypeId">
                                                    <Form.Label>{t('userType')}</Form.Label>
                                                    <Field
                                                        disabled={isViewable}
                                                        name="userTypeId"
                                                        component={ReactSelect}
                                                        options={dropdowns.userTypeList}
                                                        placeholder={t('selectUserType')}
                                                        value={values.userTypeId}
                                                        onChange={(option) => {
                                                            setFieldValue('userTypeId', option ? option.value : '')
                                                        }} // Update Formik value
                                                    />
                                                    <ErrorMessage name="userTypeId" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="designationId">
                                                    <Form.Label>{t('designation')}</Form.Label>
                                                    <Field
                                                        disabled={isViewable}
                                                        name="designationId"
                                                        component={ReactSelect}
                                                        options={dropdowns.designationList}
                                                        placeholder={t('selectDesignation')}
                                                        value={values.designationId}
                                                        onChange={(option) => {
                                                            setFieldValue('designationId', option ? option.value : '')
                                                        }} // Update Formik value
                                                    />
                                                    <ErrorMessage name="designationId" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="isActive">
                                                    <Checkbox disabled={isViewable} id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                                    <ErrorMessage name="isActive" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                        </div>
                                    </CardBody>
                                </Card>


                                <Card className='mb-3'>
                                    <CardBody>
                                        <div className="row">
                                            <div className="col">
                                                <h4 className="my-2 font-bold text-green-900">{t('organizationWiseRole')}</h4>
                                                <hr className='my-3' />

                                                <FieldArray name="userOfficeRoles">
                                                    {({ insert, remove, push }) => (
                                                        <div>
                                                            {values.userOfficeRoles && values.userOfficeRoles.length > 0 &&
                                                                values.userOfficeRoles.map((friend, index) => (
                                                                    <div className="row ml-[10px] mb-2" key={index}>

                                                                        <div className="col-md-5 col-lg-5 col-sm-12">
                                                                            <Form.Group className="mb-3">
                                                                                <Form.Label htmlFor={`userOfficeRoles.${index}.orgId`}>{t('organization')}</Form.Label>
                                                                                <Field
                                                                                    disabled={isViewable}
                                                                                    name={`userOfficeRoles.${index}.orgId`}
                                                                                    component={ReactSelect}
                                                                                    options={officeList}
                                                                                    placeholder={t('selectOrganization')}
                                                                                    value={values.userOfficeRoles[index].orgId}
                                                                                    onChange={(option) => {
                                                                                        setFieldValue(`userOfficeRoles.${index}.orgId`, option ? option.value : '')
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name={`userOfficeRoles.${index}.orgId`} component="div" className="text-danger" />
                                                                            </Form.Group>
                                                                        </div>

                                                                        <div className="col-md-5 col-lg-5 col-sm-12">
                                                                            <Form.Group className="mb-3">
                                                                                <Form.Label htmlFor={`userOfficeRoles.${index}.roleId`}>{t('role')}</Form.Label>
                                                                                <Field
                                                                                    disabled={isViewable}
                                                                                    name={`userOfficeRoles.${index}.roleId`}
                                                                                    component={ReactSelect}
                                                                                    options={roleList}
                                                                                    placeholder={t('selectRole')}
                                                                                    value={values.userOfficeRoles[index].roleId}
                                                                                    onChange={(option) => {
                                                                                        setFieldValue(`userOfficeRoles.${index}.roleId`, option ? option.value : '')
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name={`userOfficeRoles.${index}.roleId`} component="div" className="text-danger" />
                                                                            </Form.Group>
                                                                        </div>

                                                                        {!isViewable &&
                                                                            <div className="col-md-2">
                                                                                <OverlayTrigger overlay={<Tooltip>{t('add')}</Tooltip>}>
                                                                                    <button onClick={() => push({ orgId: '', roleId: '' })} className='btn btn-sm text-[12px] btn-outline-success mt-[33px]'>
                                                                                        <i className="fa fa-plus"></i>
                                                                                    </button>
                                                                                </OverlayTrigger>
                                                                                {values.userOfficeRoles && values.userOfficeRoles.length > 1 &&
                                                                                    <OverlayTrigger overlay={<Tooltip>{t('remove')}</Tooltip>}>
                                                                                        <button onClick={() => {
                                                                                            values.userOfficeRoles.splice(index, 1);
                                                                                            setFieldValue('userOfficeRoles', values.userOfficeRoles);
                                                                                        }} className='btn btn-sm text-[12px] btn-outline-danger ml-2 mt-[33px]'>
                                                                                            <i className="fa fa-minus"></i>
                                                                                        </button>
                                                                                    </OverlayTrigger>
                                                                                }
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="row mt-2 mb-6">
                                    <div className="col-md-12 text-right">
                                        {isViewable ? (
                                            <button className='btn btn-secondary btn-rounded btn-xs' onClick={() => navigate(`/admin/user-management/user-list`)}>{t('back')}</button>
                                        ) : (
                                            <>
                                                <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{id ? t('save_changes') : t('save')}</button>
                                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default withNamespaces()(VehicleRegistrationPage1);