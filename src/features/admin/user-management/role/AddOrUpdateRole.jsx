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

    const { id } = useParams()
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const findItem = listData?.find((item) => item.id == id)

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        roleCode: '',
        permissionIds: [4,6],
        isActive: true,
    })

    const resetValues = {
        nameBn: '',
        nameEn: '',
        roleCode: '',
        permissionIds: [4,6],
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

    const [statusGroupList, setStatusGroupList] = useState([]);

    useEffect(() => {
        if (findItem) {
            const updatedData = { ...findItem }
            setInitialValues(updatedData);
            getRoleById(id);
        } else {
            setInitialValues(resetValues);
        }
    }, [findItem]);

    // New useEffect to monitor state changes
    useEffect(() => {
        console.log('initialValues after update:', initialValues); // Will log the updated values after state change
    }, [initialValues]);

    const getRoleById = async (id) => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/configurations/role/${id}`)
            if (data.success) {
                setInitialValues(data.data);
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        // console.log('initialValues', initialValues)
    }, []);

    const onSubmit = async (values, setSubmitting, resetForm) => {
        handleSave(values, setSubmitting, resetForm);
    };

    const handleSave = async (values, setSubmitting, resetForm) => {

        try {
            let result = ''
            if (values.id) {
                values.permissionIds = [4,6]
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

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{id ? t('edit') : t('add_new')} {t('emailTemplate')}</CardTitle>
                </CardHeader>
                <CardBody>
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

                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <Form.Group className="mb-3" controlId="nameEn">
                                            <Form.Label>{t('roleName')} ({t('en')})</Form.Label>
                                            <Field type="text" name="nameEn" onChange={(e) => {
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
                                    <div className="col-md-3">
                                        <Form.Group className="mb-3" controlId="nameBn">
                                            <Form.Label>{t('roleName')} ({t('bn')})</Form.Label>
                                            <Field type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                            <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3">
                                        <Form.Group className="mb-3" controlId="roleCode">
                                            <Form.Label>{t('roleCode')}</Form.Label>
                                            <Field disabled={values.id != null} type="text" name="roleCode" className="form-control" placeholder="Enter role code" />
                                            <ErrorMessage name="roleCode" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3">
                                        <Form.Group controlId="isActive">
                                            <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                            <ErrorMessage name="isActive" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>



                                <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{id ? t('save_changes') : t('save')}</button>
                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                            </FormikForm>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </div>
    );
};

export default withNamespaces()(AddOrUpdateRole);