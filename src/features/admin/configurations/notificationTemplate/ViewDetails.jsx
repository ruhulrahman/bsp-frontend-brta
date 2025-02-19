import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ViewDetails = ({ show, onHide, onSave, viewData }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    return (
        <>
            {viewData &&
                <Modal show={show} onHide={onHide} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('title')}: {currentLanguage === 'en' ? viewData.titleEn : viewData.titleBn}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='card mt-3'>
                            <div className='card-body'>
                                <h1 className='font-semibold mb-3'>{t('message')}: </h1>
                                <div dangerouslySetInnerHTML={{ __html: currentLanguage === 'en' ? viewData.messageEn : viewData.messageBn }}/>
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