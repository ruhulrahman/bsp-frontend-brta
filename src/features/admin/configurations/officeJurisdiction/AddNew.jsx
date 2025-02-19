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

const AddNew = ({ show = false, onHide = () => { }, onSave = () => { }, editData = null }) => {
    const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        orgId: '',
        divisionId: '',
        districtId: '',
        thanaIds: [],
        isActive: true,
    })

    const resetValues = {
        orgId: '',
        divisionId: '',
        districtId: '',
        thanaIds: [],
        isActive: true,
    };

    const validationSchema = Yup.object().shape({
        orgId: Yup.string().required('Organization is required'),
        divisionId: Yup.string().required('Division is required'),
        districtId: Yup.string().required('District is required'),
        thanaIds: Yup.array().min(1, 'At least one thana is required'),
        isActive: Yup.string().required('Is active is required'),
    });

    useEffect(() => {
        if (editData) {
            console.log('editData', editData)
            setInitialValues(editData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);

    const [allServiceList, setAllServiceList] = useState([]);

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {
        onSave(values, setSubmitting, resetForm, setErrors);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('officeJurisdiction')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
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
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => {
                            const { t } = useTranslation();

                            const getSelectedServices = (options, selectedIds) => {
                                const selectedOptions = options.filter((option) => selectedIds.includes(option.value));
                                console.log('selectedOptions', selectedOptions)
                                return selectedOptions.map((option) => option.label).join(', ');
                            }

                            const [districtList, setDistrictList] = useState([]);
                            const [thanaList, setThanaList] = useState([]);

                            useEffect(() => {
                                if (values.divisionId) {
                                    getLocationListByParentId(values.divisionId, 'district');
                                }
                            }, [values.divisionId]);

                            useEffect(() => {
                                if (values.districtId) {
                                    getLocationListByParentId(values.districtId, 'thana');
                                }
                            }, [values.districtId]);


                            const getLocationListByParentId = async (parentId, locationType = 'district') => {

                                try {
                                    const { data } = await RestApi.get(`api/v1/admin/common/get-locations-by-parent-location-id/${parentId}`)
                                    if (locationType == 'district') {
                                        setDistrictList(data.locationList);
                                    } else if (locationType == 'thana') {
                                        setThanaList(data.locationList);
                                    }
                                } catch (error) {
                                    console.log('error', error)
                                }
                            }

                            const [checkedAll, setCheckedAll] = useState(false);


                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <Form.Group className="mb-3" controlId="orgId">
                                        <Form.Label>{t('office')}</Form.Label>
                                        <Field
                                            name="orgId"
                                            component={ReactSelect}
                                            options={dropdowns.orgList}
                                            placeholder={t('pleaseSelectOrganization')}
                                            value={values.orgId}
                                            onChange={(option) => {
                                                setFieldValue('orgId', option ? option.value : '')
                                            }}
                                        />
                                        <ErrorMessage name="orgId" component="div" className="text-danger" />
                                    </Form.Group>


                                    <div className="col-sm-12">
                                        <Form.Group className="mb-3" controlId="divisionId">
                                            <Form.Label>{t('division')} <span className='text-red-500'>*</span></Form.Label>
                                            <Field
                                                name="divisionId"
                                                component={ReactSelect}
                                                options={dropdowns.divisionList}
                                                placeholder={t('pleaseSelectDivision')}
                                                value={values.divisionId}
                                                onChange={(option) => {
                                                    const selectedValue = option ? option.value : '';
                                                    setFieldValue('divisionId', selectedValue);
                                                    if (!selectedValue) {
                                                        setDistrictListPermanent([])
                                                    }
                                                }}
                                            />
                                            <ErrorMessage name="divisionId" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12">
                                        <Form.Group className="mb-3" controlId="districtId">
                                            <Form.Label>{t('district')} <span className='text-red-500'>*</span></Form.Label>
                                            <Field
                                                name="districtId"
                                                component={ReactSelect}
                                                options={districtList}
                                                placeholder={t('pleaseSelectDistrict')}
                                                value={values.districtId}
                                                onChange={(option) => {
                                                    const selectedValue = option ? option.value : '';
                                                    setFieldValue('districtId', selectedValue);
                                                    if (!selectedValue) {
                                                        setThanaList([])
                                                    }
                                                }}
                                            />
                                            <ErrorMessage name="districtId" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <Form.Group className="mb-3" controlId="thanaIds">
                                        <Form.Label className='d-flex justify-content-between'>
                                            <span>{t('thana')} <span className='text-red-500'>*</span></span>
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
                                                                'thanaIds',
                                                                thanaList ? thanaList.map((item) => item.id) : []
                                                            );
                                                        } else {
                                                            setFieldValue(
                                                                'thanaIds',
                                                                []
                                                            );
                                                        }
                                                    }} /> <label htmlFor="checkedAll">{t('selectAll')}</label>
                                            </div>

                                        </Form.Label>

                                        <Field
                                            isMulti={true}
                                            name="thanaIds"
                                            component={ReactSelect}
                                            options={thanaList}
                                            placeholder={t('pleaseSelectThana')}
                                            value={values.thanaIds}
                                            onChange={(selectedOptions) => {
                                                setFieldValue(
                                                    'thanaIds',
                                                    selectedOptions ? selectedOptions.map((option) => option.value) : []
                                                );
                                            }}
                                        />
                                        <ErrorMessage name="thanaIds" component="div" className="text-danger" />
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

export default (AddNew);