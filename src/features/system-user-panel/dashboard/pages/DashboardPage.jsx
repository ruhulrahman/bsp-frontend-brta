import React, { useEffect } from "react";
import { useState } from 'react';
import { Card } from "react-bootstrap";
// import Button from 'react-bootstrap/Button';
// import Collapse from 'react-bootstrap/Collapse';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import helpers, { toaster } from '@/utils/helpers.js';
import Loading from '@/components/common/Loading';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {

  const [searchValues, setSearchValues] = useState({
    orgId: '',
    licenseTypeId: '',
    applicationDate: '',
  });

  const resetSearchValues = {
    orgId: '',
    licenseTypeId: '',
    applicationDate: '',
  };


  const resetReportData = {
    drivingLicenseOnProcess: 0,
    drivingLicenseIssued: 0,
    vehicleRegistrationOnProcess: 0,
    vehicleRegistrationIssued: 0,
  }

  const [drivingLicenseData, setDrivingLicenseData] = useState({
    drivingLicenseOnProcess: 0,
    drivingLicenseIssued: 0,
  })

  const [vechicleData, setVehicleData] = useState({
    vehicleRegistrationOnProcess: 0,
    vehicleRegistrationIssued: 0,
  })

  const getListData = async (values = searchValues) => {
    const params = Object.assign(values);
    // dispatch(setLoading(true));
    setDrivingLicenseData(resetReportData)
    try {
      const { data } = await RestApi.get('api/v1/driving-license/dashboard-report', { params })
      setDrivingLicenseData(data)
      // console.log('data', data);
    } catch (error) {
      console.log('error', error)
    } finally {
      // dispatch(setLoading(false));
    }
  }

  const getVehiceData = async (values = searchValues) => {
    const params = Object.assign(values);
    // dispatch(setLoading(true));
    setVehicleData(resetReportData)
    try {
      const { data } = await RestApi.get('api/reg/applications/v1/vehicles/registration-dashboard-report', { params })
      setVehicleData(data)
      console.log('data', data);
    } catch (error) {
      console.log('error', error)
    } finally {
      // dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    getListData();
    getVehiceData();
  }, []);

  return (
    <div className="">

      {/* <Card className="text-slate-700 shadow-none border-none mb-3">
        <Card.Body>
          <div className='row m-1'>
            <div className="col-md-8 col-sm-12">
              <h1>Welcome to the Dashboard</h1>
            </div>
          </div>
        </Card.Body>
      </Card> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
        <div className="bg-white shadow-md rounded-xl p-6">
          <span className="text-md font-semibold text-info">Driving License On Process</span>
          <span className="text-4xl font-semibold text-slate-700 block mt-2">{drivingLicenseData.drivingLicenseOnProcess}</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <span className="text-md font-semibold text-success">Driving License Issued</span>
          <span className="text-4xl font-semibold text-slate-700 block mt-2">{drivingLicenseData.drivingLicenseIssued}</span>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <span className="text-md font-semibold text-info">Vehicle Registration On Process</span>
          <span className="text-4xl font-semibold text-slate-700 block mt-2">{vechicleData.vehicleRegistrationOnProcess}</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <span className="text-md font-semibold text-success">Vehicle Registration Issued</span>
          <span className="text-4xl font-semibold text-slate-700 block mt-2">{vechicleData.vehicleRegistrationIssued}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
