import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { api } from '../../services/api';

const TourSchedule = ({ tourId }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tour details which includes availabilities
        const response = await api.get(`/tours/${tourId}`);
        const tourData = response.data;

        if (tourData && tourData.availabilities) {
          setSchedules(tourData.availabilities);
        } else {
          setSchedules([]);
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchSchedules();
    }
  }, [tourId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải lịch trình...</div>;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 mb-3">Lịch trình khả dụng</h4>

      {schedules.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Chưa có lịch trình nào</p>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(schedule.start_datetime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(schedule.start_datetime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(schedule.end_datetime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  schedule.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {schedule.status === 'AVAILABLE' ? 'Khả dụng' : 'Đã đặt'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>
                      {schedule.booked_capacity || 0}/{schedule.total_capacity || 25} đã đặt
                    </span>
                  </div>
                  <div className="flex items-center text-primary-600 font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{formatPrice(schedule.price)}</span>
                  </div>
                </div>

                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    schedule.status === 'AVAILABLE'
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={schedule.status !== 'AVAILABLE'}
                >
                  {schedule.status === 'AVAILABLE' ? 'Đặt ngay' : 'Đã đầy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourSchedule;
