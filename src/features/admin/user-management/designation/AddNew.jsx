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

const AddNew = ({ show = false, onHide = () => {}, onSave = () => {}, editData = null }) => {
const { t } = useTranslation();

    const dispatch = useDispatch();
    const { activeStatusList, loading, listData } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;


    const handleClose = () => setFormOpen(false);
    const handleShow = () => setFormOpen(true);

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        levelNumber: '',
        parentDesignationId: '',
        isActive: true,
    })

    const resetValues = {
        nameBn: '',
        nameEn: '',
        levelNumber: '',
        parentDesignationId: '',
        isActive: true,
    };

    const [parentDesignationList, setParentDesignationList] = useState([]);

    useEffect(() => {
        getAllDesinationList();
        if (editData) {
            setInitialValues(editData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);

    const getAllDesinationList = async () => {

        // dispatch(setListData([]));
        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/designation/all-list')
            // console.log('data', data)
            if (data.success) {
                setParentDesignationList(data.data)
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            // dispatch(setLoading(false));
        }
    }

    // const handleInputChange = (e) => {
    //     console.log('Input changed:', e.target.name, e.target.value);
    //     setInitialValues((prevValues) => ({
    //         ...prevValues,
    //         [e.target.name]: e.target.value,
    //     }));
    // };

    const validationSchema = Yup.object().shape({
        nameBn: Yup.string().required('Name is required'),
        nameEn: Yup.string().required('Name is required'),
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

    const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {
        onSave(values, setSubmitting, resetForm, setErrors);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('designation')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Loading loading={loading} loadingText={t('submitting')} />
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm, setErrors);
                        }}
                    >
                        {({ values, resetForm, setFieldValue }) => (
                            <FormikForm>
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

                                <Form.Group className="mb-3" controlId="levelNumber">
                                    <Form.Label>{t('levelNumber')}</Form.Label>
                                    <Field type="number" min="1" name="levelNumber" className="form-control" placeholder="Enter level number" />
                                    <ErrorMessage name="levelNumber" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="parentDesignationId">
                                    <Form.Label>{t('parentDesingation')}</Form.Label>
                                    {/* <Field
                                        component="select"
                                        id="location"
                                        name="parentDesignationId"
                                        multiple={false}
                                        className="w-full rounded-md border"
                                    >
                                        <option value="">{t('select')}</option>
                                        {parentDesignationList.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {currentLanguage === 'en' ? option.nameEn : option.nameBn}
                                            </option>
                                        ))}
                                    </Field> */}

                                    <Field
                                        name="parentDesignationId"
                                        component={ReactSelect}
                                        options={parentDesignationList}
                                        placeholder={t('select')}
                                        value={values.parentDesignationId}
                                        onChange={(option) => {
                                            setFieldValue('parentDesignationId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="parentDesignationId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="isActive">
                                    <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                    <ErrorMessage name="isActive" component="div" className="text-danger" />
                                </Form.Group>

                                <button type='submit' className='btn btn-success btn-rounded btn-xs'>{editData ? t('save_changes') : t('save')}</button>
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