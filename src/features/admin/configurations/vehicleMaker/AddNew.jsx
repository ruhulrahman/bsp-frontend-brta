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

const AddNew = ({ t, show, onHide, onSave, editData }) => {

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        countryId: '',
        address: '',
        isActive: true,
    })

    const resetValues = {
        nameBn: '',
        nameEn: '',
        countryId: '',
        address: '',
        isActive: true,
    };

    const [statusGroupList, setStatusGroupList] = useState([]);

    useEffect(() => {

        // getStatusGroupList();
        if (editData) {
            const updatedData = {
                ...editData,
                countryId: editData?.countryId,
            }
            setInitialValues(updatedData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);

    const getStatusGroupList = async () => {

        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/status-group/active-list')
            // console.log('data', data)
            if (data.success) {
                setStatusGroupList(data.data)
            }
        } catch (error) {
            console.log('error', error)
        }
    }


    const validationSchema = Yup.object().shape({
        nameBn: Yup.string().required('Name is required'),
        nameEn: Yup.string().required('Name is required'),
        countryId: Yup.string().required('Country is required'),
        address: Yup.string().required('Address is required'),
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
        values.countryId = parseInt(values.countryId)

        if (values.id) {
            // Remove the statusGroup property
            delete values.statusGroup;
        }

        onSave(values, setSubmitting, resetForm);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('vehicleMaker')}</Offcanvas.Title>
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

                                <Form.Group className="mb-3" controlId="countryId">
                                    <Form.Label>{t('country')}</Form.Label>
                                    <Field
                                        component="select"
                                        id="location"
                                        name="countryId"
                                        multiple={false}
                                        className="w-full rounded-md border"
                                    >
                                        <option value="">{t('select')}</option>
                                        {dropdowns.countryList && dropdowns.countryList.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {currentLanguage === 'en' ? option.nameEn : option.nameBn}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="countryId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nameEn">
                                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                    <Field type="text" name="nameEn" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nameBn">
                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>{t('address')}</Form.Label>
                                    <Field type="text" min="1" name="address" className="form-control" placeholder="Enter status group code" />
                                    <ErrorMessage name="address" component="div" className="text-danger" />
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