import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toBengaliNumber } from 'bengali-number';

const ViewDetails = ({ show, onHide, onSave, viewData }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    return (
        <>
            {viewData &&
                <Modal show={show} onHide={onHide} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('childServices')}</Modal.Title>
                        {/* <Modal.Title>{t('name')}: {currentLanguage === 'en' ? viewData.nameEn : viewData.nameBn}</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                        <div className=' mt-3'>
                            <div className='card-body'>
                                {/* <h1 className='font-semibold mb-3'>{t('message')}: </h1> */}
                                <h1 className='font-semibold mb-3'>{t('service')}: {currentLanguage === 'en' ? viewData.nameEn : viewData.nameBn}</h1>

                                <table className="mt-2 text-left table table-responsive">
                                    <thead>
                                        <tr>
                                            <th>{t('sl')}</th>
                                            <th>{t('name') + ` (${t('en')})`}</th>
                                            <th>{t('name') + ` (${t('bn')})`}</th>
                                            <th>{t('serviceCode')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {viewData.childServices && viewData.childServices.map((item, index) => (
                                            <tr key={item.id} className='text-slate-500 text-sm'>
                                                <td>{currentLanguage === 'en' ? index + 1 : toBengaliNumber(index + 1)}.</td>
                                                <td>{item.nameEn}</td>
                                                <td>{item.nameBn}</td>
                                                <td>
                                                    <span className='badge bg-secondary'>
                                                        {item.serviceCode}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
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