import Checkbox from '@/components/ui/Checkbox';
import TextEditor from '@/components/ui/TextEditor';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
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

const AddOrUpdateRole = ({ t }) => {

    const { id, isViewable } = useParams()
    console.log('isViewable', isViewable)
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const findItem = listData?.find((item) => item.id == id)

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        roleCode: '',
        permissionIds: [],
        isActive: true,
    })

    const resetValues = {
        nameBn: '',
        nameEn: '',
        roleCode: '',
        permissionIds: [],
        isActive: true,
    };

    const validationSchema = Yup.object().shape({
        nameBn: Yup.string().required('Role Name is required'),
        nameEn: Yup.string().required('Role Name is required'),
        roleCode: Yup.string().required('Role Code is required'),
        isActive: Yup.string().required('Is active is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };


    const [parentChildPermissionList, setParentChildPermissionList] = useState([]);

    useEffect(() => {
        getPermissionParentChildList();
    }, []);

    // Fetch the role by id after the parent-child list is ready
    useEffect(() => {
        if (id && parentChildPermissionList.length > 0) {
            getRoleById(id);
        } else if (!id) {
            setInitialValues(resetValues);
        }
    }, [id, parentChildPermissionList]);


    const getPermissionParentChildList = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/permission/parent-child-list`)
            setParentChildPermissionList(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getRoleById = async (id) => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/configurations/role/${id}`)
            setInitialValues(data);

            // console.log('parentChildPermissionList =====', parentChildPermissionList)

            // Make sure parentChildPermissionList is available
            parentChildPermissionList.map((item) => {
                let newIds = [];
                let checkedIds = [];

                // Collect item IDs
                newIds.push(item.id);
                item.pageList.forEach((page) => newIds.push(page.id));
                item.featureList.forEach((feature) => newIds.push(feature.id));

                // Compare with initialValues.permissionIds
                newIds.forEach((id) => {
                    if (data.permissionIds.includes(id)) {
                        checkedIds.push(id);
                    }
                });

                // Check if all IDs are checked
                if (newIds.length === checkedIds.length) {
                    item.checkedAll = true;
                }

                console.log('newIds:', newIds);
                console.log('checkedIds:', checkedIds);

                // Update item with checked status
                return Object.assign(item);
            });


            console.log('parentChildPermissionList =====', parentChildPermissionList)

        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        console.log('initialValues', initialValues)
    }, [initialValues]);

    const onSubmit = async (values, setSubmitting, resetForm) => {
        handleSave(values, setSubmitting, resetForm);
    };

    const handleSave = async (values, setSubmitting, resetForm) => {

        try {
            let result = ''
            if (values.id) {
                // values.permissionIds = [4, 6]
                result = await RestApi.put(`api/v1/admin/configurations/role/update/${values.id}`, values)
            } else {
                result = await RestApi.post('api/v1/admin/configurations/role/create', values)
            }

            if (result.data.success) {
                toaster(result.data.message)
                navigate('/admin/user-management/role-list')
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false)
        }
    };

    const updatePermissionIds = (e) => {
        const id = item.id
        if (e.target.checked) {
            // Add the checkbox ID to permissionIds array
            setFieldValue('permissionIds', [
                ...values.permissionIds,
                id,
            ]);
        } else {
            // Remove the checkbox ID from permissionIds array
            setFieldValue(
                'permissionIds',
                values.permissionIds.filter(
                    (selectedId) => selectedId !== id
                )
            );
        }
    }

    // Common change handler to update form values
    const handleFieldChange2 = (setFieldValue) => (e) => {
        const { name, value, type, checked } = e.target;
        console.log('name=', name, 'value=', value, 'type=', type, 'checked=', checked)
        const newValue = type === 'checkbox' ? checked : value; // Handle checkbox and other inputs
        setFieldValue(name, newValue); // Update the Formik state
    };

    const handleFieldChange = (setFieldValue, id) => (e, id) => {
        const { name, value, type, checked } = e.target;
        console.log('name=', name, 'value=', value, 'type=', type, 'checked=', checked)
        if (type === 'checkbox') {
            if (checked) {
                // Add the checkbox ID to permissionIds array
                setFieldValue('permissionIds', [
                    ...initialValues.permissionIds,
                    id,
                ]);
            } else {
                // Remove the checkbox ID from permissionIds array
                setFieldValue(
                    'permissionIds',
                    initialValues.permissionIds.filter(
                        (selectedId) => selectedId !== id
                    )
                );
            }
        }
        const newValue = type === 'checkbox' ? checked : value; // Handle checkbox and other inputs
        setFieldValue(name, newValue); // Update the Formik state
    };

    return (
        <div>
            <div>
                <CardHeader>
                    <CardTitle className='mb-2'>{id ? t('edit') : t('add_new')} {t('rolePermission')}</CardTitle>
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
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('submitting')} />

                                <Card className='mb-3'>
                                    <CardBody>
                                        <div className="row mb-3">
                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="nameEn">
                                                    <Form.Label>{t('roleName')} ({t('en')})</Form.Label>
                                                    <Field disabled={isViewable} type="text" name="nameEn" onChange={(e) => {
                                                        handleChange(e); // This updates Formik's state
                                                        const nameField = e.target.value.trim()
                                                        const nameSplit = nameField.split(' ')
                                                        let result = nameSplit.join("_");
                                                        if (!values.id) {
                                                            setFieldValue('roleCode', result.toLowerCase());
                                                        }
                                                    }} className="form-control" placeholder="Enter name" />
                                                    <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="nameBn">
                                                    <Form.Label>{t('roleName')} ({t('bn')})</Form.Label>
                                                    <Field disabled={isViewable} type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                                    <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group className="mb-3" controlId="roleCode">
                                                    <Form.Label>{t('roleCode')}</Form.Label>
                                                    <Field disabled={isViewable || values.id != null} type="text" name="roleCode" className="form-control" placeholder="Enter role code" />
                                                    <ErrorMessage name="roleCode" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4 col-lg-3">
                                                <Form.Group controlId="isActive">
                                                    <Checkbox disabled={isViewable} id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                                    <ErrorMessage name="isActive" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>


                                {parentChildPermissionList.length > 0 && parentChildPermissionList.map((item, index) => (

                                    <Card className='mb-3'>
                                        <CardBody>
                                            <div className="row bg-label-success my-3">
                                                <div className="col">
                                                    {/* <div className="custom-control custom-checkbox">
                                                            <Field type="checkbox" id={`parent-${index}`} name="permissionIds" value={item.id} />
                                                            <label for={`parent-${index}`} className="ml-1.5">
                                                                <span className='font-bold'>{item.nameEn}</span>
                                                            </label>
                                                        </div> */}

                                                    <Form.Group className="mb-3">
                                                        {/* <Field type="checkbox" id={`parent-${index}`} name="permissionIds" value={item.id} /> */}
                                                        <Field
                                                            type="checkbox"
                                                            disabled={isViewable}
                                                            id={`parent-${index}`}
                                                            name="permissionIds"
                                                            value={item.id}
                                                            checked={values.permissionIds.length && values.permissionIds.includes(item.id)}
                                                            onChange={(e) => {
                                                                const id = item.id
                                                                if (e.target.checked) {
                                                                    // Add the checkbox ID to permissionIds array
                                                                    setFieldValue('permissionIds', [
                                                                        ...values.permissionIds,
                                                                        id,
                                                                    ]);
                                                                } else {
                                                                    // Remove the checkbox ID from permissionIds array
                                                                    setFieldValue(
                                                                        'permissionIds',
                                                                        values.permissionIds.filter(
                                                                            (selectedId) => selectedId !== id
                                                                        )
                                                                    );
                                                                }
                                                            }} />
                                                        <Form.Label for={`parent-${index}`} className="ml-1.5">{item.nameEn}</Form.Label>
                                                    </Form.Group>
                                                </div>
                                                <div className="text-right col">
                                                    <div>
                                                        <div className="custom-control custom-checkbox">
                                                            <Field type="checkbox"
                                                                id={`selectAll-${index}`}
                                                                disabled={isViewable}
                                                                value={item.checkedAll}
                                                                checked={item.checkedAll}
                                                                onChange={(e) => {
                                                                    item.checkedAll = !item.checkedAll
                                                                    const id = item.id
                                                                    console.log('e.target.checked', e.target.checked)
                                                                    if (e.target.checked) {
                                                                        // Add the checkbox ID to permissionIds array

                                                                        let newIds = [];

                                                                        // Collect item IDs
                                                                        newIds.push(item.id);
                                                                        item.pageList.forEach((page) => newIds.push(page.id));
                                                                        item.featureList.forEach((feature) => newIds.push(feature.id));
                                                                        console.log('newIds', newIds)

                                                                        setFieldValue('permissionIds', [
                                                                            ...values.permissionIds,
                                                                            ...newIds
                                                                        ]);

                                                                    } else {
                                                                        // Remove the checkbox ID from permissionIds array
                                                                        let newIds = [];

                                                                        // Collect item IDs
                                                                        newIds.push(item.id);
                                                                        item.pageList.forEach((page) => newIds.push(page.id));
                                                                        item.featureList.forEach((feature) => newIds.push(feature.id));
                                                                        console.log('newIds', newIds)

                                                                        setFieldValue(
                                                                            'permissionIds',
                                                                            values.permissionIds.filter(id => !newIds.includes(id))
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            {/* <input id={`selectAll-${index}`} type="checkbox" className="custom-control-input" value="true" /> */}
                                                            <label for={`selectAll-${index}`} className="ml-1.5">{t('selectAll')}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">

                                                    <hr />
                                                    <h4 className="my-2 font-bold text-green-900">{t('pages')}</h4>
                                                    <div className="row ml-[10px] mb-2">
                                                        {item.pageList.length > 0 && item.pageList.map((childItem, pageIndex) => (
                                                            <div className="mt-3 col-sm-3 col-md-3 col-lg-3">
                                                                <div className="custom-control custom-checkbox">
                                                                    <Field type="checkbox"
                                                                        id={`page-${index}-${pageIndex}`}
                                                                        disabled={isViewable}
                                                                        name="permissionIds"
                                                                        value={childItem.id}
                                                                        checked={values.permissionIds.length && values.permissionIds.includes(childItem.id)}
                                                                        onChange={(e) => {
                                                                            const id = childItem.id
                                                                            if (e.target.checked) {
                                                                                // Add the checkbox ID to permissionIds array
                                                                                setFieldValue('permissionIds', [
                                                                                    ...values.permissionIds,
                                                                                    id,
                                                                                ]);
                                                                            } else {
                                                                                // Remove the checkbox ID from permissionIds array
                                                                                setFieldValue(
                                                                                    'permissionIds',
                                                                                    values.permissionIds.filter(
                                                                                        (selectedId) => selectedId !== id
                                                                                    )
                                                                                );
                                                                            }
                                                                        }} />
                                                                    {/* <input id={`page-${index}-${pageIndex}`} type="checkbox" className="custom-control-input" /> */}
                                                                    <label for={`page-${index}-${pageIndex}`} className="ml-1.5"> {childItem.nameEn} </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <hr />
                                                    <h4 className="my-2 font-bold text-blue-900">{t('features')}</h4>
                                                    <div className="row ml-[10px]">
                                                        {item.featureList.length > 0 && item.featureList.map((childItem, featureIndex) => (
                                                            <div className="mt-3 col-sm-3 col-md-3 col-lg-3">
                                                                <div className="custom-control custom-checkbox">
                                                                    <Field type="checkbox"
                                                                        id={`feature-${index}-${featureIndex}`}
                                                                        disabled={isViewable}
                                                                        name="permissionIds"
                                                                        value={childItem.id}
                                                                        checked={values.permissionIds.length && values.permissionIds.includes(childItem.id)}
                                                                        onChange={(e) => {
                                                                            const id = childItem.id
                                                                            if (e.target.checked) {
                                                                                // Add the checkbox ID to permissionIds array
                                                                                setFieldValue('permissionIds', [
                                                                                    ...values.permissionIds,
                                                                                    id,
                                                                                ]);
                                                                            } else {
                                                                                // Remove the checkbox ID from permissionIds array
                                                                                setFieldValue(
                                                                                    'permissionIds',
                                                                                    values.permissionIds.filter(
                                                                                        (selectedId) => selectedId !== id
                                                                                    )
                                                                                );
                                                                            }
                                                                        }} />
                                                                    {/* <input id={`feature-${index}-${featureIndex}`} type="checkbox" className="custom-control-input" /> */}
                                                                    <label for={`feature-${index}-${featureIndex}`} className="ml-1.5"> {childItem.nameEn} </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>

                                ))}


                                {/* <div className="card-body">
                                    <div className="row bg-label-success">
                                        <div className="col">
                                            <div>
                                                <div className="custom-control custom-checkbox">
                                                    <input id="checkbox-11" type="checkbox" className="custom-control-input" value="2" />
                                                    <label for="checkbox-11" className="custom-control-label"><strong>User Management</strong></label>
                                                </div>
                                            </div>
                                            <Form.Group className="mb-3" controlId="userManagement">
                                                <Form.Label>{t('userManagement')}</Form.Label>
                                                <Field type="checkbox" name="permissionIds" className="form-control" placeholder="Enter role code" />
                                            </Form.Group>
                                        </div>
                                        <div className="text-right col">
                                            <div>
                                                <div className="custom-control custom-checkbox"><input id="selectAll-11" type="checkbox" className="custom-control-input" value="true" />
                                                    <label for="selectAll-11" className="custom-control-label"> Select All </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <hr />
                                            <h4 className="header">Page</h4>
                                            <div className="row ml-[10px]">
                                                <div className="mt-3 col-sm-3 col-md-3 col-lg-3">
                                                    <div className="custom-control custom-checkbox"><input id="page-110" type="checkbox" className="custom-control-input" value="13" />
                                                        <label for="page-110" className="custom-control-label"> Permission </label>
                                                    </div>
                                                </div>
                                                <div className="mt-3 col-sm-3 col-md-3 col-lg-3">
                                                    <div className="custom-control custom-checkbox">
                                                        <input id="page-111" type="checkbox" className="custom-control-input" value="14" />
                                                        <label for="page-111" className="custom-control-label"> Role </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <h4 className="header">Operation</h4>
                                            <div className="row ml-[10px]">
                                                <div className="mt-3 col-sm-3 col-md-3 col-lg-3">
                                                    <div className="custom-control custom-checkbox">
                                                        <input id="operation-110" type="checkbox" className="custom-control-input" value="22" />
                                                        <label for="operation-110" className="custom-control-label"> Active Or Deactive Role </label>
                                                    </div>
                                                </div>
                                                <div className="mt-3 col-sm-3 col-md-3 col-lg-3">
                                                    <div className="custom-control custom-checkbox">
                                                        <input id="operation-111" type="checkbox" className="custom-control-input" value="26" />
                                                        <label for="operation-111" className="custom-control-label"> Active Or Deactive User </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}



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

export default withNamespaces()(AddOrUpdateRole);