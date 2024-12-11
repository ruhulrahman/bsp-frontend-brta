import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
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
import helpers from '../../../../utils/helpers';

const AddNew = ({ t, show, onHide, onSave, editData }) => {

    const { activeStatusList, loading, listData } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        serviceCode: '',
        parentServiceId: '',
        childServiceIds: [],
        priority: '',
        serviceEconomicCodeId: '',
        isActive: true,
    })

    const resetValues = {
        nameBn: '',
        nameEn: '',
        serviceCode: '',
        parentServiceId: '',
        childServiceIds: [],
        priority: '',
        serviceEconomicCodeId: '',
        isActive: true,
    };

    const validationSchema = Yup.object().shape({
        nameBn: Yup.string().required('Name is required'),
        nameEn: Yup.string().required('Name is required'),
        // serviceCode: Yup.string().required('Service Code is required'),
        isActive: Yup.string().required('Is active is required'),
    });

    useEffect(() => {
        getAllServiceList()
        getServiceEconomicCodeList()
        if (editData) {
            setInitialValues(editData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);


    const [allServiceList, setAllServiceList] = useState([]);
    const [allServiceEconomicCodeList, setAllServiceEconomicCodeList] = useState([]);
    
    const getAllServiceList = async () => {

        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/service/all-list')
            if (data.success) {
                setAllServiceList(data.data)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const getServiceEconomicCodeList = async () => {

        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/service-economic-code-list')
            if (data.success) {
                if (data.data.length > 0) {
                    const mappedData = data.data.map(item => {
                        item.nameEn = `${item.economicDescriptionEn} (${item.economicCode})`
                        item.nameBn = `${item.economicDescriptionBn} (${item.economicCode})`
                        return Object.assign({}, item)
                    })
                    setAllServiceEconomicCodeList(mappedData)
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    const onSubmit = async (values, setSubmitting, resetForm) => {
        onSave(values, setSubmitting, resetForm);
    };

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
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm);
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
                                    <Form.Group className="mb-3" controlId="nameEn">
                                        <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                        <Field type="text" name="nameEn" onChange={(e) => {
                                            handleChange(e); // This updates Formik's state
                                            const nameField = e.target.value.trim();
                                            // Replace hyphens, slashes, and spaces with underscores
                                            // const sanitizedValue = nameField.replace(/[-\/\s]/g, "_");
                                            const sanitizedValue = helpers.replaceRegularExpression(nameField);
                                            console.log("sanitizedValue", sanitizedValue); // Custom logic here
                                            if (!values.id) {
                                                setFieldValue('serviceCode', sanitizedValue.toLowerCase());
                                            }
                                        }} className="form-control" placeholder="Enter name" />
                                        <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="nameBn">
                                        <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                        <Field type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                        <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="serviceCode">
                                        <Form.Label>{t('serviceCode')}</Form.Label>
                                        <Field disabled={values.id != null} type="text" name="serviceCode" className="form-control" placeholder="Enter service code" />
                                        <ErrorMessage name="serviceCode" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="parentServiceId">
                                        <Form.Label>{t('parentService')}</Form.Label>
                                        <Field
                                            name="parentServiceId"
                                            component={ReactSelect}
                                            options={allServiceList}
                                            placeholder={t('selectStatusGroup')}
                                            value={values.parentServiceId}
                                            onChange={(option) => {
                                                setFieldValue('parentServiceId', option ? option.value : '')
                                            }} // Update Formik value
                                        />
                                        <ErrorMessage name="parentServiceId" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="childServiceIds">
                                        <Form.Label>{t('childServices')}</Form.Label>
                                        <Field
                                            isMulti={true}
                                            name="childServiceIds"
                                            component={ReactSelect}
                                            options={allServiceList}
                                            placeholder={t('selectStatusGroup')}
                                            value={values.childServiceIds}
                                            onChange={(selectedOptions) => {
                                                setFieldValue(
                                                    'childServiceIds',
                                                    selectedOptions ? selectedOptions.map((option) => option.value) : []
                                                );
                                            }}
                                        />
                                        <ErrorMessage name="childServiceIds" component="div" className="text-danger" />
                                    </Form.Group>

                                    

                                    <Form.Group className="mb-3" controlId="serviceEconomicCodeId">
                                        <Form.Label>{t('Economic Type')}</Form.Label>
                                        <Field
                                            name="serviceEconomicCodeId"
                                            component={ReactSelect}
                                            options={allServiceEconomicCodeList}
                                            placeholder={t('selectStatusGroup')}
                                            value={values.serviceEconomicCodeId}
                                            onChange={(option) => {
                                                setFieldValue('serviceEconomicCodeId', option ? option.value : '')
                                            }} // Update Formik value
                                        />
                                        <ErrorMessage name="serviceEconomicCodeId" component="div" className="text-danger" />
                                    </Form.Group>


                                    <Form.Group className="mb-3" controlId="priority">
                                        <Form.Label>{t('priority')}</Form.Label>
                                        <Field type="number" min="1" name="priority" className="form-control" placeholder="Enter priority number" />
                                        <ErrorMessage name="priority" component="div" className="text-danger" />
                                    </Form.Group>

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

export default withNamespaces()(AddNew);