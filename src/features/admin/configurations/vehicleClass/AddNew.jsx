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
        vehicleTypeId: '',
        nameBn: '',
        nameEn: '',
        vehicleClassCode: '',
        symbolEn: '',
        symbolBn: '',
        startNumber: '',
        endNumber: '',
        remarksEn: '',
        remarksBn: '',
        isActive: true,
    })

    const resetValues = {
        vehicleTypeId: '',
        nameBn: '',
        nameEn: '',
        vehicleClassCode: '',
        symbolEn: '',
        symbolBn: '',
        startNumber: '',
        endNumber: '',
        remarksEn: '',
        remarksBn: '',
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
        vehicleTypeId: Yup.string().required('Vehicle Type is required'),
        nameEn: Yup.string().required('Name (En) is required'),
        nameBn: Yup.string().required('Name (Bn) is required'),
        vehicleClassCode: Yup.string().required('Vehicle Class Code is required'),
        symbolEn: Yup.string().required('Symbol (En) is required'),
        symbolBn: Yup.string().required('Symbol (Bn) is required'),
        startNumber: Yup.number().required('Start Number is required'),
        endNumber: Yup.number().required('End Number is required'),
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

                                <Form.Group className="mb-3" controlId="symbolEn">
                                    <Form.Label>{t('symbol')} ({t('en')})</Form.Label>
                                    <Field type="text" min="1" name="symbolEn" className="form-control" placeholder="Enter symbol" />
                                    <ErrorMessage name="symbolEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="symbolBn">
                                    <Form.Label>{t('symbol')} ({t('bn')})</Form.Label>
                                    <Field type="text" min="1" name="symbolBn" className="form-control" placeholder="Enter symbol" />
                                    <ErrorMessage name="symbolBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="startNumber">
                                    <Form.Label>{t('startNumber')}</Form.Label>
                                    <Field type="number" min="1" name="startNumber" className="form-control" placeholder="Enter Start Number" />
                                    <ErrorMessage name="startNumber" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="endNumber">
                                    <Form.Label>{t('endNumber')}</Form.Label>
                                    <Field type="number" min="1" name="endNumber" className="form-control" placeholder="Enter End Number" />
                                    <ErrorMessage name="endNumber" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="remarksEn">
                                    <Form.Label>{t('remarks')} ({t('en')})</Form.Label>
                                    <Field type="text" min="1" name="remarksEn" className="form-control" placeholder="Enter remarks" />
                                    <ErrorMessage name="remarksEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="remarksBn">
                                    <Form.Label>{t('remarks')} ({t('bn')})</Form.Label>
                                    <Field type="text" min="1" name="remarksBn" className="form-control" placeholder="Enter remarks" />
                                    <ErrorMessage name="remarksBn" component="div" className="text-danger" />
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