import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Result = () => {
  const [results, setResults] = useState([]);
  console.log(results);
  const reversed = results.slice().reverse(); // Reverse the results array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/result`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 md:px-8 py-6">
      
      <div className="space-y-8">
        {reversed.map((item) => (
          <div key={item.id} className="w-full p-8">
            {item.title && (
              <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
            )}
            <img
              src={`${VITE_API_BASE_URL}/uploads/${item.filename}`}
              alt={item.title || "Result Image"}
              className="w-full h-auto rounded-lg shadow"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
