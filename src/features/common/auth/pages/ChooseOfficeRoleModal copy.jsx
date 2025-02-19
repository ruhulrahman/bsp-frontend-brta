import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toBengaliNumber } from 'bengali-number';
import helpers from '../../../../utils/helpers';

const ViewDetails = ({ show, onHide, onSave, viewData, closeButton = false, backdrop = "static", keyboard = false }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const selectOfficeRole = (data) => {
        onSave(data)
        onHide()
    }

    

    return (
        <>
            {viewData &&
                <Modal centered show={show} onHide={onHide} size='md' backdrop={backdrop === "static" ? backdrop : true} keyboard={keyboard}>
                    <Modal.Header closeButton={closeButton}>
                        <Modal.Title>{t('selectOfficeRole')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div>
                                {viewData.userOfficeRoles && viewData.userOfficeRoles.length > 0 && (
                                    <>
                                        {viewData.userOfficeRoles && viewData.userOfficeRoles.map((item, index) => (
                                            <div key={index} className="row mt-2">
                                                <div className="col-md-12">
                                                    <button className='btn bg-[#C5D4CB] hover:bg-[#94a19a] hover:text-white' onClick={() => selectOfficeRole(item)} type='button'>
                                                        {/* <p className='text-justify'>{currentLanguage === 'en' ? `Office: ${item.orgNameEn}, Role: ${item.roleNameEn}` : `Office: ${item.orgNameBn}, Role: ${item.roleNameBn}`}</p> */}
                                                        <p className="text-justify">
                                                            {currentLanguage === 'en' ? (
                                                                <>
                                                                    <strong>{t('office')}:</strong> {item.orgNameEn}, <strong>{t('role')}:</strong> {item.roleNameEn}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <strong>{t('office')}:</strong> {item.orgNameBn}, <strong>{t('role')}:</strong> {item.roleNameBn}
                                                                </>
                                                            )}
                                                        </p>

                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {/* <table className="mt-2 text-left table table-responsive">
                                            <thead>
                                                <tr>
                                                    <th>{t('office')}</th>
                                                    <th>{t('role')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {viewData.userOfficeRoles && viewData.userOfficeRoles.map((item, index) => (
                                                    <tr key={item.id} className='text-slate-500 text-sm'>
                                                        <td>{item.orgNameEn}</td>
                                                        <td>{item.roleNameEn}</td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table> */}
                                    </>
                                )}

                            </div>
                        </div>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>{t('close')}</Button>
                    </Modal.Footer> */}
                </Modal>
            }
        </>
    );
};

export default (ViewDetails);