import Loading from '@/components/common/Loading';
import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const AddNew = ({ t, show, onHide, onSave, editData }) => {

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        routePermitTypeId: '',
        minDistrict: '',
        maxDistrict: '',
        isActive: true,
    })

    const resetValues = {
        nameBn: '',
        nameEn: '',
        routePermitTypeId: '',
        minDistrict: '',
        maxDistrict: '',
        isActive: true,
    };

    const [statusGroupList, setStatusGroupList] = useState([]);

    useEffect(() => {

        // getStatusGroupList();
        if (editData) {
            const updatedData = {
                ...editData,
                routePermitTypeId: editData?.routePermitTypeId,
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
        nameBn: Yup.string().required('Route Name is required'),
        nameEn: Yup.string().required('Route Name is required'),
        routePermitTypeId: Yup.string().required('Route Permit Type is required'),
        minDistrict: Yup.number().required('Minimum District is required'),
        maxDistrict: Yup.number().required('Maximum District is required'),
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
        values.routePermitTypeId = parseInt(values.routePermitTypeId)

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
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('vehicleRoute')}</Offcanvas.Title>
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

                                <Form.Group className="mb-3" controlId="routePermitTypeId">
                                    <Form.Label>{t('routePermitType')}</Form.Label>
                                    <Field
                                        name="routePermitTypeId"
                                        component={ReactSelect}
                                        options={dropdowns.routePermitTypes}
                                        placeholder={t('selectRoutePermitType')}
                                        value={values.routePermitTypeId}
                                        onChange={(option) => {
                                            setFieldValue('routePermitTypeId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="routePermitTypeId" component="div" className="text-danger" />
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

                                <Form.Group className="mb-3" controlId="minDistrict">
                                    <Form.Label>{t('minDistrict')}</Form.Label>
                                    <Field type="number" min="1" name="minDistrict" className="form-control" placeholder="Enter status group code" />
                                    <ErrorMessage name="minDistrict" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="maxDistrict">
                                    <Form.Label>{t('maxDistrict')}</Form.Label>
                                    <Field type="number" min="1" name="maxDistrict" className="form-control" placeholder="Enter status group code" />
                                    <ErrorMessage name="maxDistrict" component="div" className="text-danger" />
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