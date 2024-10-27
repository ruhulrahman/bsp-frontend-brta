import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Container, Card, CardBody, CardHeader, CardTitle, Form, Row, Col } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import helper, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import DLMedicalForm from '@/assets/documents/driving-license/DLMedicalForm.pdf';

const DrivingLicenseApplicationPreRequisites = ({ t }) => {

    let { serviceRequestId, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const prerequisites = [
        {
          text: 'Medical Certificate from a registered doctor (Maximum size 600 KB). To download the Medical Certificate form, click here.',
          link: '#',
        },
        {
          text: 'Scanned copy of National ID (Maximum size 600 KB).',
        },
        {
          text: 'Scanned copy of Utility Bill (Maximum size 600 KB). [If applicant’s present address is not the same as National ID address, attach present address’s Utility Bill.]',
        },
        {
          text: 'Scanned copy of Educational Certificate (Maximum size 600 KB). [Minimum class 8 pass.]',
        },
        {
          text: 'An applicant/user can apply for only one driving license.',
        },
        {
          text: 'The driving license application will be under the purview of the concerned BRTA circle office based on the thana mentioned at the current address of the user.',
        },
        {
          text: 'The applicant/user must fill in the correct information in both Bengali and English in the online application.',
        },
        {
          text: 'Legal action will be taken against those who provide false information while submitting a smart driving license application.',
        },
      ];


    return (
        <>
    <Container className="my-8">
      <Row>
        <Col>
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-2xl font-bold text-center mb-4">Prerequisites for Driving License Application</h2>
              <p className="mb-4">
                Please note that the application process may take some time. To ensure smooth progress, make sure you have the required documents in good condition and within the specified file size limit.
              </p>
              <hr className='mb-3' />
              <ul className="list-decimal pl-5 space-y-4 text-lg text-gray-700">
                {prerequisites.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item.link ? (
                      <a href={item.link} className="text-blue-600 hover:underline">
                        {item.text}
                      </a>
                    ) : (
                      item.text
                    )}
                  </li>
                ))}
              </ul>
              <div className="row">
                <div className="col-md-12 text-right">
                    <button className='btn btn-success mt-5 tex-right' onClick={() => navigate('/applicant-panel/driving-license/new-driving-license/application-page1')}>
                        <i className="fa fa-check"></i> Agree
                    </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
        </>
    );
};

export default withNamespaces()(DrivingLicenseApplicationPreRequisites);