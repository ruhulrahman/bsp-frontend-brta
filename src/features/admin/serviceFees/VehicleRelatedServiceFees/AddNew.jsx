import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';

const AddNew = ({ show = false, onHide = () => {}, onSave = () => {}, editData = null, serviceIds, allServiceList }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, dropdowns, listData } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        serviceId: '',
        isYearlyFee: true,
        mainFee: '',
        lateFee: 0,
        effectiveStartDate: '',
        effectiveEndDate: '',
        isActive: true,
        ccMin: '',
        ccMax: '',
        seatMin: '',
        seatMax: '',
        weightMin: '',
        weightMax: '',
        kwMin: '',
        kwMax: '',
        isAirCondition: false,
        isHire: false,
        vehicleTypeIds: [],
        isApplicableForMultipleVehicleOwner: false,
        feeForMultipleVehicle: 0,
        isElectricVehicle: false,
    })

    const resetValues = {
        serviceId: '',
        isYearlyFee: true,
        mainFee: '',
        lateFee: 0,
        effectiveStartDate: '',
        effectiveEndDate: '',
        isActive: true,
        ccMin: '',
        ccMax: '',
        seatMin: '',
        seatMax: '',
        weightMin: '',
        weightMax: '',
        kwMin: '',
        kwMax: '',
        isAirCondition: false,
        isHire: false,
        vehicleTypeIds: [],
        isApplicableForMultipleVehicleOwner: false,
        feeForMultipleVehicle: 0,
        isElectricVehicle: false,
    };

    const validationSchema = Yup.object().shape({
        serviceId: Yup.string().required('Service is required'),
        mainFee: Yup.number().required('Main Fee is required'),
        effectiveStartDate: Yup.date().required('Effective Start Date is required'),
        // feeForMultipleVehicle: Yup.number().positive().integer().min(1, 'Min value 1.').required('Fee for multiple vehicle is required'),
        feeForMultipleVehicle: Yup.number()
            .when('isApplicableForMultipleVehicleOwner', {
                is: (isApplicableForMultipleVehicleOwner) => isApplicableForMultipleVehicleOwner,  // When id is not present (new entry)
                then: schema => schema.positive().integer().min(1, 'Min value 1.').required('Fee for multiple vehicle is required'),
                otherwise: schema => schema.optional(),
            }),
        isActive: Yup.boolean().required('Is active is required'),
        // vehicleTypeIds: Yup.array().min(1, 'Minimum one Vehicle Type is required').required('Vehicle Type is required'),
    });

    useEffect(() => {
        // getAllServiceList()
        if (editData) {
            const updatedData = {
                ...editData,
            }
            updatedData.effectiveStartDate = updatedData.effectiveStartDate ? updatedData.effectiveStartDate.split("T")[0] : ""
            updatedData.effectiveEndDate = updatedData.effectiveEndDate ? updatedData.effectiveEndDate.split("T")[0] : ""
            setInitialValues(updatedData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);


    // const [allServiceList, setAllServiceList] = useState([]);
    // const getAllServiceList = async () => {

    //     const parentServiceCode = 'vehicle_related_fees'
    //     try {
    //         const { data } = await RestApi.get(`api/v1/admin/configurations/service/all-active-child-services-with-additional/${parentServiceCode}`)
    //         if (data.success) {
    //             if (data.data.length > 0) {
    //                 console.log('editData', editData)
    //                 setAllServiceList(data.data)
    //                 // if (editData) {
    //                 //     setAllServiceList(data.data)
    //                 // } else {
    //                 //     const filteredData = data.data.filter((item) => !serviceIds.includes(item.id))
    //                 //     setAllServiceList(filteredData)
    //                 // }
    //             }
    //         }
    //     } catch (error) {
    //         console.log('error', error)
    //     }
    // }

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {
        onSave(values, setSubmitting, resetForm, setErrors);
    };

    const [checkedAll, setCheckedAll] = useState(false);

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('service')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            if (values.effectiveStartDate) {
                                values.effectiveStartDate = new Date(values.effectiveStartDate)
                            }
                            if (values.effectiveEndDate) {
                                values.effectiveEndDate = new Date(values.effectiveEndDate)
                            }

                            onSubmit(values, setSubmitting, resetForm, setErrors);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => {

                            const getSelectedServices = (options, selectedIds) => {
                                const selectedOptions = options.filter((option) => selectedIds.includes(option.value));
                                console.log('selectedOptions', selectedOptions)
                                return selectedOptions.map((option) => option.label).join(', ');
                            }

                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <Form.Group className="mb-3" controlId="serviceId">
                                        <Form.Label>{t('service')}</Form.Label>
                                        <Field
                                            name="serviceId"
                                            component={ReactSelect}
                                            options={allServiceList}
                                            placeholder={t('selectService')}
                                            value={values.serviceId}
                                            onChange={(option) => {
                                                setFieldValue('serviceId', option ? option.value : '')
                                            }} // Update Formik value
                                        />
                                        <ErrorMessage name="serviceId" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="vehicleTypeIds">
                                        <Form.Label className='d-flex justify-content-between'>
                                            <span>{t('vehicleTypes')}</span>
                                            <div>
                                                <Field
                                                    type="checkbox"
                                                    id={`checkedAll`}
                                                    className="ml-2"
                                                    value={checkedAll}
                                                    checked={checkedAll}
                                                    onChange={(e) => {
                                                        setCheckedAll(e.target.checked);
                                                        if (e.target.checked) {
                                                            setFieldValue(
                                                                'vehicleTypeIds',
                                                                dropdowns.vehicleTypeList ? dropdowns.vehicleTypeList.map((item) => item.id) : []
                                                            );
                                                        } else {
                                                            setFieldValue(
                                                                'vehicleTypeIds',
                                                                []
                                                            );
                                                        }
                                                    }} /> <label htmlFor="checkedAll">{t('selectAll')}</label>
                                            </div>
                                        </Form.Label>
                                        <Field
                                            isMulti={true}
                                            name="vehicleTypeIds"
                                            component={ReactSelect}
                                            options={dropdowns.vehicleTypeList}
                                            placeholder={t('selectVehicleType')}
                                            value={values.vehicleTypeIds}
                                            onChange={(selectedOptions) => {
                                                setFieldValue(
                                                    'vehicleTypeIds',
                                                    selectedOptions ? selectedOptions.map((option) => option.value) : []
                                                );
                                            }}
                                        />
                                        <ErrorMessage name="vehicleTypeIds" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="isAirCondition">
                                        <Checkbox id="custom-switch" name="isAirCondition" className="" label={values.isAirCondition ? t('Air Conditioned') : t('Not Air Conditioned')} />
                                        <ErrorMessage name="isAirCondition" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="isHire">
                                        <Checkbox id="custom-switch" name="isHire" className="" label={values.isHire ? t('Hire') : t('Not Hire')} />
                                        <ErrorMessage name="isHire" component="div" className="text-danger" />
                                    </Form.Group>

                                    {/* <Form.Group className="mb-3" controlId="isElectricVehicle">
                                        <Checkbox id="custom-switch" name="isElectricVehicle" className="" label={values.isElectricVehicle ? t('electricVehicle') : t('notElectricVehicle')} />
                                        <ErrorMessage name="isElectricVehicle" component="div" className="text-danger" />
                                    </Form.Group> */}

                                    <Form.Group className="mb-3" controlId="ccMin">
                                        <Form.Label>{t('ccMin')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="ccMin" className="form-control" placeholder="Enter cc" />
                                        <ErrorMessage name="ccMin" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="ccMax">
                                        <Form.Label>{t('ccMax')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="ccMax" className="form-control" placeholder="Enter cc" />
                                        <ErrorMessage name="ccMax" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="kwMin">
                                        <Form.Label>{t('kwMin')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="kwMin" className="form-control" placeholder="Enter kw" />
                                        <ErrorMessage name="kwMin" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="kwMax">
                                        <Form.Label>{t('kwMax')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="kwMax" className="form-control" placeholder="Enter kw" />
                                        <ErrorMessage name="kwMax" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="seatMin">
                                        <Form.Label>{t('seatMin')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="seatMin" className="form-control" placeholder="Enter seat" />
                                        <ErrorMessage name="seatMin" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="seatMax">
                                        <Form.Label>{t('seatMax')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="seatMax" className="form-control" placeholder="Enter seat" />
                                        <ErrorMessage name="seatMax" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="weightMin">
                                        <Form.Label>{t('weightMin')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="weightMin" className="form-control" placeholder="Enter weight" />
                                        <ErrorMessage name="weightMin" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="weightMax">
                                        <Form.Label>{t('weightMax')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="weightMax" className="form-control" placeholder="Enter weight" />
                                        <ErrorMessage name="weightMax" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="mainFee">
                                        <Form.Label>{t('mainFee')}</Form.Label>
                                        {/* <Field type="number" min="0" step="0.01" name="mainFee" className="form-control" placeholder="Enter main fee" /> */}
                                        <Field type="number" min="0" name="mainFee" className="form-control" placeholder="Enter main fee" />
                                        <ErrorMessage name="mainFee" component="div" className="text-danger" />
                                    </Form.Group>

                                    {/* <Form.Group className="mb-3" controlId="isYearlyFee">
                                        <Checkbox id="custom-switch" name="isYearlyFee" className="" label={values.isYearlyFee ? t('yes') : t('no')} />
                                        <ErrorMessage name="isYearlyFee" component="div" className="text-danger" />
                                    </Form.Group> */}

                                    {/* <Form.Group className="mb-3" controlId="lateFee">
                                        <Form.Label>{t('lateFee')} ({t('bn')})</Form.Label>
                                        <Field type="text" name="lateFee" className="form-control" placeholder="Enter name" />
                                        <ErrorMessage name="lateFee" component="div" className="text-danger" />
                                    </Form.Group> */}


                                    <Form.Group className="mb-3" controlId="effectiveStartDate">
                                        <Form.Label>{t('effectiveStartDate')}</Form.Label>
                                        <Field type="date" name="effectiveStartDate" className="form-control" placeholder="Enter effectiveStartDate" />
                                        <ErrorMessage name="effectiveStartDate" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="effectiveEndDate">
                                        <Form.Label>{t('effectiveEndDate')}</Form.Label>
                                        <Field type="date" name="effectiveEndDate" className="form-control" placeholder="Enter effectiveEndDate" />
                                        <ErrorMessage name="effectiveEndDate" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="isApplicableForMultipleVehicleOwner">
                                        <Checkbox id="custom-switch" name="isApplicableForMultipleVehicleOwner" className="" label={values.isApplicableForMultipleVehicleOwner ? t('applicableForMultipleVehicleOwner') : t('notApplicableForMultipleVehicleOwner')} />
                                        <ErrorMessage name="isApplicableForMultipleVehicleOwner" component="div" className="text-danger" />
                                    </Form.Group>

                                    {values.isApplicableForMultipleVehicleOwner && (
                                        <Form.Group className="mb-3" controlId="feeForMultipleVehicle">
                                            <Form.Label>{t('feeForMultipleVehicle')}</Form.Label>
                                            <Field type="number" min="0" name="feeForMultipleVehicle" className="form-control" placeholder="Enter fee" />
                                            <ErrorMessage name="feeForMultipleVehicle" component="div" className="text-danger" />
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-3" controlId="isActive">
                                        <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                        <ErrorMessage name="isActive" component="div" className="text-danger" />
                                    </Form.Group>

                                    <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{editData ? t('save_changes') : t('save')}</button>
                                    <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                                </FormikForm>
                            )
                        }}
                    </Formik>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default (AddNew);