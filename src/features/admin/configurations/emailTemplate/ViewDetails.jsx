import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ViewDetails = ({ show = false, onHide = () => {}, onSave = () => {}, editData = null }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    return (
        <>
            {editData &&
                <Modal show={show} onHide={onHide} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('templateName')}: {editData.templateName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h1 className='font-semibold'>{t('subject')}: {currentLanguage === 'en' ? editData.subjectEn : editData.subjectBn}</h1>
                        <div className='card mt-3'>
                            <div className='card-body'>
                                <h1 className='font-semibold mb-3'>{t('emailBody')}: </h1>
                                <div dangerouslySetInnerHTML={{ __html: currentLanguage === 'en' ? editData.messageEn : editData.messageBn }}/>
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

export default (ViewDetails);