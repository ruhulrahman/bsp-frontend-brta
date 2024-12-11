import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toBengaliNumber } from 'bengali-number';
import helpers from '../../../../utils/helpers';

const ViewDetails = ({ t, show, onHide, onSave, viewData }) => {

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    return (
        <>
            {viewData &&
                <Modal show={show} onHide={onHide} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('details')}</Modal.Title>
                        {/* <Modal.Title>{t('name')}: {currentLanguage === 'en' ? viewData.nameEn : viewData.nameBn}</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                        <div className=' mt-3'>
                            <div className='card-body'>
                                {viewData.vehicleTypes && viewData.vehicleTypes.length > 0 && (
                                    <>
                                        <h1 className='font-semibold mb-3'>{t('vehicleTypes')}:</h1>

                                        <table className="mt-2 text-left table table-responsive">
                                            <thead>
                                                <tr>
                                                    <th>{t('sl')}</th>
                                                    <th>{t('name') + ` (${t('en')})`}</th>
                                                    <th>{t('name') + ` (${t('bn')})`}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {viewData.vehicleTypes && viewData.vehicleTypes.map((item, index) => (
                                                    <tr key={item.id} className='text-slate-500 text-sm'>
                                                        <td>{currentLanguage === 'en' ? index + 1 : toBengaliNumber(index + 1)}.</td>
                                                        <td>{item.nameEn}</td>
                                                        <td>{item.nameBn}</td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    </>
                                )}

                                <h1 className='font-semibold mb-3 text-center mt-[24px]'>{t('otherFields')}:</h1>

                                <table className="mt-2 text-left table table-normal w-auto min-w-[300px] max-w-[600px] mx-auto">
                                    <tbody>
                                        <tr>
                                            <th className='text-right'>{t('airConditioner')}</th>
                                            <td className='min-w-[100px] w-auto'>
                                                <span className={`badge ${viewData.isAirCondition ? 'bg-success' : 'bg-danger'} rounded-full`}> {viewData.isAirCondition ? t('yes') : t('no')}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('hire')}</th>
                                            <td className='min-w-[100px] w-auto'>
                                                <span className={`badge ${viewData.isHire ? 'bg-success' : 'bg-danger'} rounded-full`}> {viewData.isHire ? t('yes') : t('no')}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('ccMin')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.ccMin}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('ccMax')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.ccMax}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('seatMin')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.seatMin}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('seatMax')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.seatMax}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('weightMin')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.weightMin}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('weightMax')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.weightMax}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('kwMin')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.kwMin}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('kwMax')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.kwMax}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('mainFee')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.mainFee}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('effectiveStartDate')}</th>
                                            <td className='min-w-[100px] w-auto'>{helpers.dDate(viewData.effectiveStartDate)}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('effectiveEndDate')}</th>
                                            <td className='min-w-[100px] w-auto'>{helpers.dDate(viewData.effectiveEndDate)}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('active')}</th>
                                            <td className='min-w-[100px] w-auto'>
                                                <span className={`badge ${viewData.isActive ? 'bg-success' : 'bg-danger'} rounded-full`}> {viewData.isActive ? t('yes') : t('no')}</span>
                                            </td>
                                        </tr>
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

export default withNamespaces()(ViewDetails);