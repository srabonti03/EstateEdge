import React from 'react';
import "./dashBoard.scss";
import DataOverview from '../dataOverview/dataOverview';
import PropertyType from '../propertyType/propertyType';
import LocationDistribution from '../locationDistribution/locationDistribution';

function DashBoard() {
  return (
    <div className='dashboard'>
      <DataOverview />
      <div className="dashboard-content">
        <PropertyType />
        <LocationDistribution />
      </div>
    </div>
  );
}

export default DashBoard;
