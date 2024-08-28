import React from "react";
import { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Collapse from 'react-bootstrap/Collapse';

const DashboardPage = () => {
  
  const [open, setOpen] = useState(false);

  return (
    <div className="container-fluid p-2">
      <h1>Welcome to the Dashboard</h1>
      <p>Your main content goes here.</p>

      {/* <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          click
        </Button>
        <Collapse in={open}>
          <div id="example-collapse-text">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
            terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
            labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </Collapse> */}
    </div>
  );
};

export default DashboardPage;
