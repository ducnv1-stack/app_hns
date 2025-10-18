import React, { useState, useEffect } from 'react';
import { tourService } from '../services/tourService';

const ApiTest = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        console.log('🔍 Testing API directly from component...');

        // Test direct API call first
        const directResponse = await fetch('http://localhost:5000/api/tours?page=1&limit=5');
        const directData = await directResponse.json();
        console.log('📡 Direct API response:', directData);

        if (directData.success && directData.data && directData.data.tours) {
          console.log('✅ Direct API working, tours count:', directData.data.tours.length);
        }

        // Test tourService
        const data = await tourService.getTours({ page: 1, limit: 5 });
        console.log('📦 tourService response:', data);
        console.log('📦 tourService response type:', typeof data);
        console.log('📦 tourService response keys:', data ? Object.keys(data) : 'No data');

        if (data && data.tours) {
          setTours(data.tours);
          console.log('✅ tourService working, tours loaded:', data.tours.length);
        } else {
          console.error('❌ tourService response missing tours');
          console.error('❌ tourService data:', data);
          setError('No tours in tourService response');
        }
      } catch (err) {
        console.error('❌ API test failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) return <div className="p-4">Loading API test...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">API Test Results</h3>

      {tours.length > 0 ? (
        <>
          <p className="text-green-600">✅ Tours loaded: {tours.length}</p>
          <div className="mt-4">
            <p>First tour: {tours[0].name}</p>
            <p>Price: {tours[0].min_price} - {tours[0].max_price}</p>
            <p>Country: {tours[0].country}</p>
            <p>Duration: {tours[0].duration_days} days</p>
          </div>
        </>
      ) : (
        <div className="text-red-600">
          <p>❌ No tours loaded</p>
          <p>This confirms the issue is in the frontend data flow</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold mb-2">Debugging Steps:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser console (F12)</li>
          <li>Navigate to Tours page</li>
          <li>Look for logs from useTours hook</li>
          <li>Check if API calls are made and responses received</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiTest;
