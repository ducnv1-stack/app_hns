import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600">Nếu bạn thấy trang này, React đang hoạt động!</p>
        <div className="mt-4">
          <a href="/login" className="text-primary-600 hover:text-primary-700">Go to Login</a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
