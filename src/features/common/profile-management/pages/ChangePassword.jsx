import Form from 'react-bootstrap/Form';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react'
import { withNamespaces } from 'react-i18next';
import Loading from '@/components/common/Loading';
import RestApi from '@/utils/RestApi';
import helper, { toaster } from '@/utils/helpers.js';
import i18n from '@/i18n';
import { useSelector } from 'react-redux';

const ChangePassword = ({ t }) => {

  const currentLanguage = i18n.language;

  const authStore = useSelector((state) => state.auth)
  console.log('authStore==========', authStore)

  const [loading, setLoading] = useState(false)

  const [initialValues, setInitialValues] = useState({
    // name: currentLanguage === 'en' ? authUser?.nameEn : authUser?.nameBn,
    name: currentLanguage === 'en' ? helper.cn(authStore, 'authUser.nameEn') : helper.cn(authStore, 'authUser.nameBn'),
    current_password: '',
    new_password: '',
    confirmPassword: '',
  })

  const validationSchema = Yup.object().shape({
    current_password: Yup.string().required('Current password is required'),
    new_password: Yup.string().required('New password is required')
      .min(8, 'Must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z]).+$/,
        'Must contain at least one uppercase letter and one lowercase letter'
      )
      .matches(
        /^(?=.*\d)/,
        'Must contain at least one number'
      )
      .matches(
        /^(?=.*[@$!%*?&]).+$/,
        'Must contain at least one special character'
      ),
    confirmPassword: Yup.string().label('Confirm Password').required().oneOf([Yup.ref('new_password')], 'Confirm password does not match with new password'),
  });

  const resetValues = {
    // name: currentLanguage === 'en' ? authUser?.nameEn : authUser?.nameBn,
    current_password: '',
    new_password: '',
    confirmPassword: '',
  };

  const handleReset = (resetForm) => {
    resetForm({
      values: resetValues, // Reset to initial values
    });
  };

  const onSubmit = async (values) => {
    console.log('Form submitted:', values);
    setLoading(true);
    try {
      const result = await RestApi.post('api/v1/auth/change-password', values)
      if (result.status == 200) {
        toaster('Your password has been changed successfully')
      }

    } catch (error) {
      console.log('error', error)
      // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className=" text-slate-700 card bg-white shadow-md rounded-xl card-body">
      <div className="container">
        <div className="row">
          <div className="row">
            <div className="col">
              <h5 className='text-dark font-semibold'>{t('change_password')}</h5>
            </div>
          </div>
          <div className="col-md-6 offset-md-3">
            <Loading loading={loading} />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                onSubmit(values);
              }}
            >
              {({ values, resetForm }) => (
                <FormikForm>
                  <Form.Group className="mb-3" controlId="name_en">
                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                    <Field type="text" disabled={true} name="name" className="form-control" placeholder="Enter name" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>{t('current_password')}</Form.Label>
                    <Field type="password" name="current_password" className="form-control" placeholder="Enter current password" />
                    <ErrorMessage name="current_password" component="div" className="text-danger" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>{t('new_password')}</Form.Label>
                    <Field type="password" name="new_password" className="form-control" placeholder="Enter current password" />
                    <ErrorMessage name="new_password" component="div" className="text-danger" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>{t('confirmPassword')}</Form.Label>
                    <Field type="password" name="confirmPassword" className="form-control" placeholder="Enter confirm Password" />
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                  </Form.Group>
                  <button type='submit' className='btn btn-success btn-rounded btn-xs'>{t('save_changes')}</button>
                  <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('clear')}</button>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </div>

    </div>
  )
}

export default withNamespaces()(ChangePassword)
