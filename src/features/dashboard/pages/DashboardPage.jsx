import React from "react";
import { Button } from "react-bootstrap";

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-green-500">
        Hello, React Bootstrap with Tailwind!
      </h1>
      <Button variant="primary">React Bootstrap Button</Button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
        Tailwind Button
      </button>
    </div>
  );
};

export default DashboardPage;
