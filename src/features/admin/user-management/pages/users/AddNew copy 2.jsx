import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { withTranslation, useTranslation } from 'react-i18next';

const AddNew = ({ ...props }) => {
const { t } = useTranslation();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>

            <button className='btn-black-rounded' onClick={handleShow}>{t('add_new')}</button>

            <Offcanvas size="sm" show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add New User</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Button type="submit">Save</Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default (AddNew)
