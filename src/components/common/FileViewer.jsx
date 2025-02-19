import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Loading from '@/components/common/Loading';
import ReactSelect from '@/components/ui/ReactSelect';
import * as Yup from 'yup';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import RestApi, { baseURL } from '@/utils/RestApi';
import useCommonFunctions from '@/hooks/useCommonFunctions';
import helpers, { toaster } from '@/utils/helpers.js';


const FileViewer = ({ show, onHide, data }) => {
const { t } = useTranslation();

    console.log('show', show)
    console.log('data', data)

    const { hasPermission } = useCommonFunctions();

    const [fileUrl, setFileUrl] = useState(null);
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        setFileUrl(data?.fileUrl);
        setFileName(data?.fileName);
    }, [data]);

    return (
        <>
            {(fileUrl) &&
                <Modal show={show} onHide={onHide} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>{fileName ? fileName : t('File Viewer')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row px-3">
                            <div className="card pt-[10px] border-none">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {fileUrl && (
                                                <div>
                                                    {fileName.endsWith(".pdf") ? (
                                                        <iframe
                                                            src={fileUrl}
                                                            width="100%"
                                                            height="500px"
                                                            title="PDF Viewer"
                                                        />
                                                    ) : (
                                                        <img src={fileUrl} alt="File Preview" className='w-full' />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>{t('close')}</Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
};

export default (FileViewer);
