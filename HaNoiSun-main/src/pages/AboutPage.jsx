import React from 'react';
import CompanyOverview from '../components/about/CompanyOverview';
import CompanyHistory from '../components/about/CompanyHistory';
import Leadership from '../components/about/Leadership';
import OfficeNetwork from '../components/about/OfficeNetwork';
import CompanyStats from '../components/about/CompanyStats';
import CoreValues from '../components/about/CoreValues';
import Certifications from '../components/about/Certifications';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Về Hà Nội Sun Travel
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Hơn 12 năm kinh nghiệm trong lĩnh vực du lịch, chúng tôi tự hào là đối tác tin cậy 
              đồng hành cùng hàng nghìn khách hàng khám phá thế giới
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '#/tours'}
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Khám Phá Tours
              </button>
              <button 
                onClick={() => window.location.href = '#/contact'}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Liên Hệ Chúng Tôi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <CompanyOverview />
        <CompanyHistory />
        <Leadership />
        <CompanyStats />
        <CoreValues />
        <OfficeNetwork />
        <Certifications />
      </div>
    </div>
  );
};

export default AboutPage;