import React, { useEffect, useState } from 'react';
import "./locationDistribution.scss";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00b894', '#6c5ce7', '#fd79a8', '#0984e3', '#fab1a0', '#e17055'];

function LocationDistribution() {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchLocationDistribution = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/post/distribution/location', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch location distribution');
        const data = await response.json();
        setPieData(data);
      } catch (error) {
        console.error('Error fetching location distribution:', error);
      }
    };

    fetchLocationDistribution();
  }, []);

  return (
    <div className='location-distribution'>
      <h2>Property Locations</h2>
      {pieData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#888', fontSize: '1.2rem' }}>
          No data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1e1e1e", border: "none", color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{
                padding: '10px',
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default LocationDistribution;
