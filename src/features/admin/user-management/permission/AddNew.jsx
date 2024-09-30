import Checkbox from '@/components/ui/Checkbox';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';

const AddNew = ({ t, show, onHide, onSave, editData, ...props }) => {

    const { activeStatusList, loading, listData, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        // nameBn: '',
        nameEn: '',
        parentId: '',
        permissionCode: '',
        type: '',
        isActive: true,
    })

    const resetValues = {
        // nameBn: '',
        nameEn: '',
        parentId: '',
        permissionCode: '',
        type: '',
        isActive: true,
    };

    useEffect(() => {

        if (editData) {
            const updatedData = {
                ...editData
            }
            setInitialValues(updatedData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);


    const validationSchema = Yup.object().shape({
        // nameBn: Yup.string().required('Name is required'),
        nameEn: Yup.string().required('Name is required'),
        permissionCode: Yup.string().required('Permission Code is required'),
        type: Yup.string().required('Type is required'),
        isActive: Yup.string().required('Is active is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    useEffect(() => {
        // console.log('initialValues', initialValues)
    }, []);

    const onSubmit = async (values, setSubmitting, resetForm) => {
        values.parentId = parseInt(values.parentId)
        // values.type = parseInt(values.type)
        onSave(values, setSubmitting, resetForm);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('permission')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Formik
                        initialValues={initialValues}
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

                                <Form.Group className="mb-3" controlId="type">
                                    <Form.Label>{t('permissionType')}</Form.Label>
                                    <Field
                                        component="select"
                                        id="type"
                                        name="type"
                                        value={values.type} onChange={(e) => {
                                            handleChange(e); // This updates Formik's state
                                            setFieldValue('type', parseInt(e.target.value));
                                        }}
                                        multiple={false}
                                        className="w-full rounded-md border"
                                    >
                                        <option value="">{t('select')}</option>
                                        {permissionTypeList && permissionTypeList.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {currentLanguage === 'en' ? option.nameEn : option.nameBn}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="type" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nameEn">
                                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                    <Field type="text" name="nameEn" value={values.nameEn} onChange={(e) => {
                                        handleChange(e); // This updates Formik's state
                                        const nameField = e.target.value.trim()
                                        const nameSplit = nameField.split(' ')
                                        let result = nameSplit.join("_");
                                        if (!values.id) {
                                            setFieldValue('permissionCode', result.toLowerCase());
                                        }
                                    }} className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="permissionCode">
                                    <Form.Label>{t('permissionCode')}</Form.Label>
                                    <Field disabled={values.id != null} type="text" name="permissionCode" className="form-control" placeholder="Enter permission code" />
                                    <ErrorMessage name="permissionCode" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="parentId">
                                    <Form.Label>{t('parentPermission')}</Form.Label>
                                    <Field
                                        component="select"
                                        id="parentId"
                                        name="parentId"
                                        value={values.parentId} onChange={(e) => {
                                            handleChange(e); // This updates Formik's state
                                            setFieldValue('parentId', parseInt(e.target.value));
                                        }}
                                        multiple={false}
                                        className="w-full rounded-md border"
                                    >
                                        <option value="">{t('select')}</option>
                                        {props.parentPermissionList && props.parentPermissionList.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {currentLanguage === 'en' ? option.nameEn : option.nameEn}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="parentId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="isActive">
                                    <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                    <ErrorMessage name="isActive" component="div" className="text-danger" />
                                </Form.Group>

                                <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{editData ? t('save_changes') : t('save')}</button>
                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                            </FormikForm>
                        )}
                    </Formik>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default withNamespaces()(AddNew);