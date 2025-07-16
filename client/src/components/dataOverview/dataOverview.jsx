import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserTie, FaClipboardList, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './dataOverview.scss';

const DataOverview = () => {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalAgents: 0,
    totalListings: 0,
    totalPending: 0,
  });

  const fetchData = async () => {
    try {
      const config = {
        withCredentials: true,
      };

      const [
        customersRes,
        agentsRes,
        approvedPostsRes,
        pendingPostsRes,
      ] = await Promise.all([
        axios.get('http://localhost:3000/api/user/count', config),
        axios.get('http://localhost:3000/api/agent/count', config),
        axios.get('http://localhost:3000/api/post/approved/count', config),
        axios.get('http://localhost:3000/api/post/pending/count', config),
      ]);

      setData({
        totalCustomers: customersRes.data.totalCustomers,
        totalAgents: agentsRes.data.totalAgents,
        totalListings: approvedPostsRes.data.approvedCount,
        totalPending: pendingPostsRes.data.pendingCount,
      });
    } catch (err) {
      console.error("Failed to fetch overview data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="data-overview">
      <div className="overview-box">
        <div className="icon-container" style={{ backgroundColor: '#36A2EB' }}>
          <FaUsers size={40} color="white" />
        </div>
        <div className="info">
          <h3>Total Customers</h3>
          <p>{data.totalCustomers}</p>
        </div>
      </div>

      <div className="overview-box">
        <div className="icon-container" style={{ backgroundColor: '#FF6347' }}>
          <FaUserTie size={40} color="white" />
        </div>
        <div className="info">
          <h3>Total Agents</h3>
          <p>{data.totalAgents}</p>
        </div>
      </div>

      <div className="overview-box">
        <div className="icon-container" style={{ backgroundColor: '#32CD32' }}>
          <FaClipboardList size={40} color="white" />
        </div>
        <div className="info">
          <h3>Total Listings</h3>
          <p>{data.totalListings}</p>
        </div>
      </div>

      <div className="overview-box">
        <div className="icon-container" style={{ backgroundColor: '#FFD700' }}>
          <FaSpinner size={40} color="white" />
        </div>
        <div className="info">
          <h3>Total Pending</h3>
          <p>{data.totalPending}</p>
        </div>
      </div>
    </div>
  );
};

export default DataOverview;
