import { api } from './api';
import { tourService } from './tourService';

// Utilities to map backend values to UI-friendly text
const categoryMap = {
  TOUR: 'Tour du lịch',
  HOTEL: 'Khách sạn',
  FLIGHT: 'Vé máy bay',
  COMBO: 'Combo'
};

const toVnCategory = (serviceType) => categoryMap[serviceType] || serviceType || 'Khác';
const toUiStatus = (status) => {
  const s = (status || '').toUpperCase();
  return s === 'ACTIVE' ? 'active' : s === 'INACTIVE' ? 'inactive' : 'draft';
};

export const adminTourService = {
  // Fetch admin tours with optional filters
  async getTours(params = {}) {
    const { page = 1, limit = 20, search, category, status, country, minPrice, maxPrice } = params;
    const query = {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(country ? { country } : {}),
      ...(minPrice ? { minPrice } : {}),
      ...(maxPrice ? { maxPrice } : {}),
    };

    // Helper mapping to UI tour object
    const mapRow = (t) => ({
      id: t.id,
      title: t.name || t.title || 'Không tên',
      category: toVnCategory(t.service_type || t.category),
      country: t.country || t?.std?.country || 'Việt Nam',
      duration: t.duration_days ? `${t.duration_days} ngày` : (t.duration || ''),
      price: { adult: Number(t.min_price || t.price || 0) },
      status: toUiStatus(t.status || t?.is_active ? 'ACTIVE' : ''),
      bookings: t.booking_count || t.bookings || 0,
      revenue: t.revenue || 0,
      image: t.image_url || (Array.isArray(t.images) && t.images.find(i=>i.is_primary)?.image_url) || '/hero/halong.jpg',
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    });

    try {
      const res = await api.get('/admin/tours', query);
      if (!res?.success) throw new Error(res?.error || 'Failed to fetch admin tours');
      const tours = (res.data || []).map(mapRow);
      return { tours, pagination: res.pagination };
    } catch (err) {
      console.warn('Admin tours API failed, falling back to public /tours:', err?.message || err);
      // Fallback to public tours endpoint used by the client site
      const pub = await tourService.getTours(query);
      const tours = (pub?.tours || pub?.data?.tours || []).map(mapRow);
      const pagination = pub?.pagination || pub?.data?.pagination || { page, limit, total: tours.length, pages: 1 };
      return { tours, pagination };
    }
  },

  // Delete a tour (soft delete)
  async deleteTour(id) {
    const res = await api.delete(`/admin/tours/${id}`);
    if (!res?.success) throw new Error(res?.error || 'Failed to delete tour');
    return res;
  },

  // Permanently delete a tour
  async hardDeleteTour(id) {
    const res = await api.delete(`/admin/tours/${id}/hard`);
    if (!res?.success) throw new Error(res?.error || 'Failed to permanently delete tour');
    return res;
  },

  // Fetch full editable content for a tour
  async getTourContent(id) {
    const res = await api.get(`/admin/tours/${id}/content`);
    if (!res?.success) throw new Error(res?.error || 'Failed to fetch tour content');
    return res.data;
  },

  // Create new tour
  async createTour(payload) {
    const res = await api.post('/admin/tours', payload);
    if (!res?.success) throw new Error(res?.error || 'Failed to create tour');
    return res;
  },

  // Update basic info and details (use main update endpoint for multi-table support)
  async updateBasic(id, payload) {
    const res = await api.put(`/admin/tours/${id}`, payload);
    if (!res?.success) throw new Error(res?.error || 'Failed to update tour');
    return res;
  },

  // Get variants for a service
  async getVariants(serviceId) {
    const res = await api.get(`/admin/variants/${serviceId}`);
    if (!res?.success) throw new Error(res?.error || 'Failed to fetch variants');
    return res.data;
  },

  // Update variant attributes
  async updateVariantAttributes(variantId, attributes) {
    const res = await api.put(`/admin/variants/${variantId}/attributes`, { attributes });
    if (!res?.success) throw new Error(res?.error || 'Failed to update variant attributes');
    return res.data;
  },

  // Bulk update variants
  async bulkUpdateVariants(serviceId, variants) {
    const res = await api.post(`/admin/variants/${serviceId}/bulk-update`, { variants });
    if (!res?.success) throw new Error(res?.error || 'Failed to bulk update variants');
    return res.data;
  },

  // Query variants by attributes
  async queryVariants(serviceId, filters = {}) {
    const res = await api.get(`/admin/variants/${serviceId}/query`, filters);
    if (!res?.success) throw new Error(res?.error || 'Failed to query variants');
    return res.data;
  },

  // Update type-specific details
  async updateTypeDetails(id, serviceType, details) {
    const res = await api.put(`/admin/tours/${id}/type-details`, { service_type: serviceType, details });
    if (!res?.success) throw new Error(res?.error || 'Failed to update type details');
    return res;
  },

  // Update itinerary (array or string)
  async updateItinerary(id, itinerary) {
    const res = await api.put(`/admin/tours/${id}/itinerary`, { itinerary });
    if (!res?.success) throw new Error(res?.error || 'Failed to update itinerary');
    return res;
  },

  // Upload images (uses plain fetch to send FormData)
  async uploadImages(id, files) {
    const form = new FormData();
    const list = Array.from(files || []);
    list.forEach(f => form.append('images', f));

    const token = localStorage.getItem('hns_auth_token');
    const base = (await import('../config/env')).config.API_BASE_URL;
    const res = await fetch(`${base}/admin/tours/${id}/images`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) throw new Error(data?.error || `HTTP ${res.status}`);
    return data.data || [];
  },

  async deleteImage(id, imageId) {
    const res = await api.delete(`/admin/tours/${id}/images/${imageId}`);
    if (!res?.success) throw new Error(res?.error || 'Failed to delete image');
    return res.data;
  }
};

export default adminTourService;
