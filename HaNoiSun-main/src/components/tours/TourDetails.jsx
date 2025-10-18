import React from 'react';
import { Clock, Users, MapPin, Calendar, Package } from 'lucide-react';

const TourDetails = ({ tour }) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-semibold text-gray-900 mb-3">Chi tiết tour</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-primary-600" />
            <span className="font-medium">Thời gian:</span>
            <span className="ml-2">{tour.duration_days || 0} ngày</span>
          </div>

          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-primary-600" />
            <span className="font-medium">Số người:</span>
            <span className="ml-2">{tour.min_participants || 0}-{tour.max_participants || 0} người</span>
          </div>

          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-primary-600" />
            <span className="font-medium">Địa điểm:</span>
            <span className="ml-2">{tour.country || 'Chưa xác định'}</span>
          </div>

          <div className="flex items-center text-sm">
            <Package className="h-4 w-4 mr-2 text-primary-600" />
            <span className="font-medium">Loại hình:</span>
            <span className="ml-2">
              {tour.service_type === 'TOUR' ? 'Tour du lịch' : tour.service_type || 'Chưa xác định'}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-green-600" />
            <span className="font-medium">Lịch trình khả dụng:</span>
            <span className="ml-2 text-green-600 font-medium">
              {tour.availability_count || 0} chuyến
            </span>
          </div>

          {tour.total_capacity && (
            <div className="flex items-center text-sm">
              <Package className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium">Sức chứa:</span>
              <span className="ml-2 text-blue-600">{tour.total_capacity} người</span>
            </div>
          )}

          {tour.itinerary && (
            <div className="text-sm">
              <span className="font-medium text-purple-600">Hành trình:</span>
              <div className="mt-1 p-2 bg-purple-50 rounded text-xs text-purple-700 max-h-20 overflow-y-auto">
                {typeof tour.itinerary === 'string'
                  ? tour.itinerary
                  : 'Chi tiết hành trình có sẵn'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
