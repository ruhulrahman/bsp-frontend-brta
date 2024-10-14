import Loading from '@/components/common/Loading';
import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import i18n from '@/i18n';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const AddNew = ({ t, show, onHide, onSave, editData, ...props }) => {

    const { activeStatusList, loading, listData, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        nameEn: '',
        nameBn: '',
        parentId: '',
        permissionCode: '',
        type: '',
        pageUrl: '',
        isActive: true,
    })

    const resetValues = {
        nameEn: '',
        nameBn: '',
        parentId: '',
        permissionCode: '',
        type: '',
        pageUrl: '',
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
        nameEn: Yup.string().required('Name in English is required'),
        nameBn: Yup.string().required('Name in Bangla is required'),
        permissionCode: Yup.string().required('Permission Code is required'),
        type: Yup.string().required('Type is required'),
        pageUrl: Yup.string()
            .when('type', {
                is: (type) => type === '1',
                then: schema => schema.required('Page Url is required'),
                otherwise: schema => schema.optional(),
            }),
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
                                        id="type"
                                        name="type"
                                        component={ReactSelect}
                                        options={permissionTypeList}
                                        placeholder={t('selectPermissionType')}
                                        value={values.type}
                                        onChange={(option) => {
                                            setFieldValue('type', option ? option.value : '')
                                        }} // Update Formik value
                                    />
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

                                <Form.Group className="mb-3" controlId="nameBn">
                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                </Form.Group>

                                {values.type == '1' && (
                                    <Form.Group className="mb-3" controlId="pageUrl">
                                        <Form.Label>{t('pageUrl')}</Form.Label>
                                        <Field type="text" name="pageUrl" className="form-control" placeholder="Enter page url" />
                                        <ErrorMessage name="pageUrl" component="div" className="text-danger" />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3" controlId="permissionCode">
                                    <Form.Label>{t('permissionCode')}</Form.Label>
                                    <Field disabled={values.id != null} type="text" name="permissionCode" className="form-control" placeholder="Enter permission code" />
                                    <ErrorMessage name="permissionCode" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="parentId">
                                    <Form.Label>{t('parentPermission')}</Form.Label>
                                    <Field
                                        id="parentId"
                                        name="parentId"
                                        component={ReactSelect}
                                        options={props.parentPermissionList}
                                        placeholder={t('selectParentPermission')}
                                        value={values.parentId}
                                        onChange={(option) => {
                                            setFieldValue('parentId', option ? parseInt(option.value) : '')
                                        }} // Update Formik value
                                    />
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