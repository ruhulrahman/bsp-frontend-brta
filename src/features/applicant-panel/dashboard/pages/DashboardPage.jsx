import React from "react";
import { useState } from 'react';
import { Card } from "react-bootstrap";
// import Button from 'react-bootstrap/Button';
// import Collapse from 'react-bootstrap/Collapse';

const DashboardPage = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="">

      <Card className="text-slate-700">
        <Card.Body>
          <div className='row m-1'>
            <div className="col-md-8 col-sm-12">
              <h1>Welcome to the Dashboard</h1>
              <p>Your main content goes here.</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardPage;
