import Loading from '@/components/common/Loading';
import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withTranslation, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const AddNew = ({ show = false, onHide = () => {}, onSave = () => {}, editData = null }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        vehicleTypeId: '',
        nameBn: '',
        nameEn: '',
        vehicleClassCode: '',
        ccMin: '',
        ccMax: '',
        seatMin: '',
        seatMax: '',
        loadedWeightMinKg: '',
        loadedWeightMaxKg: '',
        motorCapacityMinKw: '',
        motorCapacityMaxKw: '',
        isActive: true,
    })

    const resetValues = {
        vehicleTypeId: '',
        nameBn: '',
        nameEn: '',
        vehicleClassCode: '',
        ccMin: '',
        ccMax: '',
        seatMin: '',
        seatMax: '',
        loadedWeightMinKg: '',
        loadedWeightMaxKg: '',
        motorCapacityMinKw: '',
        motorCapacityMaxKw: '',
        isActive: true,
    };

    const [statusGroupList, setStatusGroupList] = useState([]);

    useEffect(() => {

        // getStatusGroupList();
        if (editData) {
            const updatedData = {
                ...editData
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
        vehicleTypeId: Yup.string().required('Vehicle Type is required'),
        // ccMin: Yup.number().required('CC Minimum is required'),
        // ccMax: Yup.number().required('CC Maximum is required'),
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
        values.vehicleTypeId = parseInt(values.vehicleTypeId)

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
const { t } = useTranslation();
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('submitting')} />

                                <Form.Group className="mb-3" controlId="vehicleTypeId">
                                    <Form.Label>{t('vehicleType')}</Form.Label>
                                    <Field
                                        id="vehicleTypeId"
                                        name="vehicleTypeId"
                                        component={ReactSelect}
                                        options={dropdowns.vehicleTypeList}
                                        placeholder={t('selectVehicleType')}
                                        value={values.vehicleTypeId}
                                        onChange={(option) => {
                                            setFieldValue('vehicleTypeId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="vehicleTypeId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nameEn">
                                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                    <Field type="text" name="nameEn"  onChange={(e) => {
                                        handleChange(e); // This updates Formik's state
                                        const nameField = e.target.value.trim()
                                        const nameSplit = nameField.split(' ')
                                        let result = nameSplit.join("_");
                                        console.log("nameSplit", nameSplit); // Custom logic here
                                        if (!values.id) {
                                            setFieldValue('vehicleClassCode', result.toLowerCase());
                                        }
                                    }} className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nameBn">
                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="vehicleClassCode">
                                    <Form.Label>{t('vehicleClassCode')}</Form.Label>
                                    <Field type="text" name="vehicleClassCode" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="vehicleClassCode" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="ccMin">
                                    <Form.Label>{t('ccMin')}</Form.Label>
                                    <Field type="number" min="1" name="ccMin" className="form-control" placeholder="Enter min cc" />
                                    <ErrorMessage name="ccMin" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="ccMax">
                                    <Form.Label>{t('ccMax')}</Form.Label>
                                    <Field type="number" min="1" name="ccMax" className="form-control" placeholder="Enter max cc" />
                                    <ErrorMessage name="ccMax" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="seatMin">
                                    <Form.Label>{t('seatMin')}</Form.Label>
                                    <Field type="number" min="1" name="seatMin" className="form-control" placeholder="Enter min seat" />
                                    <ErrorMessage name="seatMin" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="seatMax">
                                    <Form.Label>{t('seatMax')}</Form.Label>
                                    <Field type="number" min="1" name="seatMax" className="form-control" placeholder="Enter max seat" />
                                    <ErrorMessage name="seatMax" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="loadedWeightMinKg">
                                    <Form.Label>{t('loadedWeightMinKg')}</Form.Label>
                                    <Field type="number" min="1" name="loadedWeightMinKg" className="form-control" placeholder="Enter loaded weight min (kg)" />
                                    <ErrorMessage name="loadedWeightMinKg" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="loadedWeightMaxKg">
                                    <Form.Label>{t('loadedWeightMaxKg')}</Form.Label>
                                    <Field type="number" min="1" name="loadedWeightMaxKg" className="form-control" placeholder="Enter loaded weight max (kg)" />
                                    <ErrorMessage name="loadedWeightMaxKg" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="motorCapacityMinKw">
                                    <Form.Label>{t('motorCapacityMinKw')}</Form.Label>
                                    <Field type="number" min="1" name="motorCapacityMinKw" className="form-control" placeholder="Enter motor capacity min (kw)" />
                                    <ErrorMessage name="motorCapacityMinKw" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="motorCapacityMaxKw">
                                    <Form.Label>{t('motorCapacityMaxKw')}</Form.Label>
                                    <Field type="number" min="1" name="motorCapacityMaxKw" className="form-control" placeholder="Enter motor capacity max (kw)" />
                                    <ErrorMessage name="motorCapacityMaxKw" component="div" className="text-danger" />
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

export default (AddNew);