import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import TextEditor from '@/components/ui/TextEditor';
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const AddOrUpdateUser = ({ t }) => {

    let { id, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const findItem = listData?.find((item) => item.id == id)

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        username: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        userTypeId: '',
        designationId: '',
        isActive: true,
        userOrgRoles: [
            { orgId: '', roleId: '' }
        ]
    })


    const resetValues = {
        nameBn: '',
        nameEn: '',
        username: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        userTypeId: '',
        designationId: '',
        isActive: true,
        userOrgRoles: [
            {
                orgId: '',
                roleId: ''
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
        userOrgRoles: Yup.array().of(
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


    const [officeList, setOfficeLis] = useState([]);

    useEffect(() => {
        getOfficeList();
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
            setOfficeLis(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getUserById = async (id) => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/${id}`)
            setInitialValues(data);

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
                    <CardTitle className='mb-2'>{id ? t('edit') : t('add_new')} {t('user')}</CardTitle>
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
                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="nameEn">
                                                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                                    <Field type="text" name="nameEn" className="form-control" placeholder="Enter name" />
                                                    <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="nameBn">
                                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                                    <Field type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                                    <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="username">
                                                    <Form.Label>{t('username')}</Form.Label>
                                                    <Field type="text" name="username" className="form-control" placeholder="Enter username" />
                                                    <ErrorMessage name="username" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="mobile">
                                                    <Form.Label>{t('mobile')}</Form.Label>
                                                    <Field type="text" name="mobile" className="form-control" placeholder="Enter mobile" />
                                                    <ErrorMessage name="mobile" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="email">
                                                    <Form.Label>{t('email')}</Form.Label>
                                                    <Field type="text" name="email" className="form-control" placeholder="Enter email" />
                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            {!values.id &&
                                                <div className="col-md-4 col-lg-3">
                                                    <Form.Group className="mb-3" controlId="password">
                                                        <Form.Label>{t('password')}</Form.Label>
                                                        <Field type="password" name="password" className="form-control" placeholder="Enter password" />
                                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>
                                            }

                                            {!values.id &&
                                                <div className="col-md-4 col-lg-3">
                                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                                        <Form.Label>{t('confirmPassword')}</Form.Label>
                                                        <Field type="password" name="confirmPassword" className="form-control" placeholder="Enter confirm password" />
                                                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>
                                            }

                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="userTypeId">
                                                    <Form.Label>{t('userType')}</Form.Label>
                                                    <Field
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
                                                    <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
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
                                                <hr />

                                                {/* <div className="row ml-[10px] mb-2">
                                                    <div className="col-md-5 col-lg-5 col-sm-12">
                                                        <Form.Group className="mb-3" controlId="userTypeId">
                                                            <Form.Label>{t('userType')}</Form.Label>
                                                            <Field
                                                                name="userTypeId"
                                                                component={ReactSelect}
                                                                options={dropdowns.userTypeList}
                                                                placeholder={t('selectUserType')}
                                                                value={values.userTypeId}
                                                                onChange={(option) => {
                                                                    setFieldValue('userTypeId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="userTypeId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-5 col-lg-5 col-sm-12">
                                                        <Form.Group className="mb-3" controlId="designationId">
                                                            <Form.Label>{t('designation')}</Form.Label>
                                                            <Field
                                                                name="designationId"
                                                                component={ReactSelect}
                                                                options={dropdowns.designationList}
                                                                placeholder={t('selectDesignation')}
                                                                value={values.designationId}
                                                                onChange={(option) => {
                                                                    setFieldValue('designationId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="designationId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-2">
                                                        <OverlayTrigger overlay={<Tooltip>{t('add')}</Tooltip>}>
                                                            <button onClick={() => addNewOfficeRole()} className='btn btn-sm text-[12px] btn-outline-success mt-[33px]'>
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>{t('remove')}</Tooltip>}>
                                                            <button onClick={() => removeOfficeRole()} className='btn btn-sm text-[12px] btn-outline-danger ml-2 mt-[33px]'>
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div> */}

                                                <FieldArray name="userOrgRoles">
                                                    {({ insert, remove, push }) => (
                                                        <div>
                                                            {values.userOrgRoles && values.userOrgRoles.length > 0 &&
                                                                values.userOrgRoles.map((friend, index) => (
                                                                    <div className="row ml-[10px] mb-2" key={index}>

                                                                        <div className="col-md-5 col-lg-5 col-sm-12">
                                                                            <Form.Group className="mb-3" controlId={`userOrgRoles.${index}.orgId`}>
                                                                                <Form.Label htmlFor={`userOrgRoles.${index}.orgId`}>{t('organization')}</Form.Label>
                                                                                <Field
                                                                                    name={`userOrgRoles.${index}.orgId`}
                                                                                    component={ReactSelect}
                                                                                    options={dropdowns.userTypeList}
                                                                                    placeholder={t('selectOrganization')}
                                                                                    value={`userOrgRoles.${index}.orgId`}
                                                                                    onChange={(option) => {
                                                                                        setFieldValue(`userOrgRoles.${index}.orgId`, option ? option.value : '')
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name="userTypeId" component="div" className="text-danger" />
                                                                            </Form.Group>
                                                                        </div>

                                                                        <div className="col-md-5 col-lg-5 col-sm-12">
                                                                            <Form.Group className="mb-3" controlId={`userOrgRoles.${index}.roleId`}>
                                                                                <Form.Label htmlFor={`userOrgRoles.${index}.roleId`}>{t('role')}</Form.Label>
                                                                                <Field
                                                                                    name={`userOrgRoles.${index}.roleId`}
                                                                                    component={ReactSelect}
                                                                                    options={dropdowns.userTypeList}
                                                                                    placeholder={t('selectRole')}
                                                                                    value={`userOrgRoles.${index}.roleId`}
                                                                                    onChange={(option) => {
                                                                                        setFieldValue(`userOrgRoles.${index}.roleId`, option ? option.value : '')
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name="userTypeId" component="div" className="text-danger" />
                                                                            </Form.Group>
                                                                        </div>


                                                                        <div className="col-md-2">
                                                                            <OverlayTrigger overlay={<Tooltip>{t('add')}</Tooltip>}>
                                                                                <button onClick={() => push({ orgId: '', roleId: '' })} className='btn btn-sm text-[12px] btn-outline-success mt-[33px]'>
                                                                                    <i className="fa fa-plus"></i>
                                                                                </button>
                                                                            </OverlayTrigger>
                                                                            <OverlayTrigger overlay={<Tooltip>{t('remove')}</Tooltip>}>
                                                                                <button onClick={() => remove(index)} className='btn btn-sm text-[12px] btn-outline-danger ml-2 mt-[33px]'>
                                                                                    <i className="fa fa-minus"></i>
                                                                                </button>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                            <button
                                                                type="button"
                                                                className="secondary"
                                                                onClick={() => push({ orgId: '', roleId: '' })}
                                                            >
                                                                Add Friend
                                                            </button>
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{id ? t('save_changes') : t('save')}</button>
                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default withNamespaces()(AddOrUpdateUser);