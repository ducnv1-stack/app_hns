import React, { useEffect, useState } from 'react';
import { tourService } from '../services/tourService';
import { config } from '../config/env';

export default function TestImagePage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await tourService.getTours({ limit: 5 });
        console.log('📊 API Response:', response);
        setTours(response.tours || []);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getTourImage = (tour) => {
    if (!tour) return '/placeholder-tour.jpg';
    
    console.log(`🔍 Tour ${tour.id} images:`, tour.images);
    
    if (tour.images && Array.isArray(tour.images)) {
      const primaryImg = tour.images.find(img => img.is_primary);
      if (primaryImg?.image_url) {
        const url = primaryImg.image_url.startsWith('http') 
          ? primaryImg.image_url 
          : `${config.API_BASE_URL.replace(/\/api$/, '')}${primaryImg.image_url}`;
        console.log(`✅ Tour ${tour.id} primary image:`, url);
        return url;
      }
      
      if (tour.images[0]?.image_url) {
        const url = tour.images[0].image_url.startsWith('http') 
          ? tour.images[0].image_url 
          : `${config.API_BASE_URL.replace(/\/api$/, '')}${tour.images[0].image_url}`;
        console.log(`✅ Tour ${tour.id} first image:`, url);
        return url;
      }
    }
    
    console.log(`⚠️ Tour ${tour.id} no images, using fallback`);
    return tour.image || '/placeholder-tour.jpg';
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Image Display</h1>
      <div className="space-y-6">
        {tours.map((tour) => {
          const imageUrl = getTourImage(tour);
          return (
            <div key={tour.id} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Tour ID: {tour.id} - {tour.name}</h3>
              <div className="mb-2">
                <strong>Images array:</strong> {JSON.stringify(tour.images)}
              </div>
              <div className="mb-2">
                <strong>Computed URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{imageUrl}</code>
              </div>
              <div className="border rounded overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={tour.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    console.error(`❌ Failed to load image for tour ${tour.id}:`, imageUrl);
                    e.target.src = '/placeholder-tour.jpg';
                  }}
                  onLoad={() => {
                    console.log(`✅ Successfully loaded image for tour ${tour.id}:`, imageUrl);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
