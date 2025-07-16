import React, { useState, useEffect } from 'react';
import "./propertyType.scss";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const PropertyType = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/post/distribution/location-prices", {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching location prices:', error);
      }
    };

    fetchData();
  }, []);

  const handleBarClick = (data, index) => {
    setActiveIndex(index);
  };

  const barFillColor = activeIndex === null ? '#7986cb' : '#3f51b5';

  return (
    <div className='property-type dark-theme'>
      <h2>Average Rent Price by City</h2>
      {data.length === 0 ? (
        <div className="no-data">No data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#444" strokeDasharray="3 3" />
            <XAxis 
              dataKey="city" 
              stroke="#bbb" 
              tick={{ fill: '#bbb', fontSize: 14, fontWeight: 500 }}
              axisLine={{ stroke: '#555' }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}৳`} 
              stroke="#bbb"
              tick={{ fill: '#bbb', fontSize: 14, fontWeight: 500 }}
              axisLine={{ stroke: '#555' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#222',
                border: 'none',
                boxShadow: 'none',
                color: '#eee',
              }}
              cursor={{ fill: 'rgba(61, 73, 142, 0.2)' }}
              itemStyle={{ color: '#eee', fontWeight: 'bold' }}
              formatter={(value) => [`${value} BDT`, 'Price']}
            />
            <Bar
              dataKey="averagePrice"
              fill={barFillColor}
              radius={[10, 10, 0, 0]}
              onClick={handleBarClick}
              className={activeIndex !== null ? 'active' : ''}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PropertyType;
