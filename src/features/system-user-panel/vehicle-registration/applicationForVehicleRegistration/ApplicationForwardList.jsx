import { withNamespaces } from 'react-i18next';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import ApplicationForward from './ApplicationForward';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const ApplicationForwardList = ({ t }) => {

    

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    

    const handleOpenViewDetailsModal = () => {
        setEditData({});
        setModalOpen(true);
    };    

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditData(null); // Reset edit data
    };


    const handleSave = async (values, setSubmitting, resetForm) => {

        
    };

    return(
        <div>
            <div>
                <CardHeader>
                    <CardTitle className='mb-2'>{t('applicationForward')}</CardTitle>            
                </CardHeader>
                <div>                    

                    <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                        <button onClick={() => handleOpenViewDetailsModal()} className='btn btn-sm text-[12px] btn-outline-dark mr-1'>
                            <i className="fa fa-eye"></i>
                        </button>                        
                    </OverlayTrigger>
                    <ApplicationForward
                            show={modalOpen}
                            onHide={handleCloseModal}
                            onSave={handleSave}
                            editData={editData}
                        />
                    
                  
                </div>
                
                
            </div>
        </div>
    )
}

export default withNamespaces()(ApplicationForwardList);