import React, { useState, useEffect } from 'react';
import { config } from '../config/env';
import { checkApiHealth } from '../services/api';

const DebugInfo = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await checkApiHealth();
        setApiStatus('connected');
        setApiResponse(response);
      } catch (error) {
        setApiStatus('failed');
        setApiResponse(error.message);
      }
    };

    checkAPI();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔧 Debug Info</div>
      
      <div className="mb-2">
        <strong>API URL:</strong> {config.API_BASE_URL}
      </div>
      
      <div className="mb-2">
        <strong>API Status:</strong> 
        <span className={`ml-1 ${
          apiStatus === 'connected' ? 'text-green-400' : 
          apiStatus === 'failed' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {apiStatus === 'connected' ? '✅ Connected' : 
           apiStatus === 'failed' ? '❌ Failed' : '⏳ Checking...'}
        </span>
      </div>
      
      {apiResponse && (
        <div className="mb-2">
          <strong>Response:</strong>
          <div className="text-xs mt-1 bg-gray-800 p-2 rounded overflow-auto max-h-20">
            {typeof apiResponse === 'string' ? apiResponse : JSON.stringify(apiResponse, null, 2)}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-400">
        Environment: {config.ENV}
      </div>
    </div>
  );
};

export default DebugInfo;
