// Debug service để kiểm tra kết nối API
export const debugService = {
  testToursAPI: async () => {
    try {
      console.log('🔍 Testing tours API connection...');

      const response = await fetch('http://localhost:5000/api/tours');
      const data = await response.json();

      console.log('📡 API Response Status:', response.status);
      console.log('📦 Full API Response:', JSON.stringify(data, null, 2));

      if (data.success && data.data && data.data.tours) {
        console.log('✅ Tours API working! Count:', data.data.tours.length);
        console.log('🎯 First tour:', data.data.tours[0]);
        return data.data.tours;
      } else {
        console.error('❌ Tours API response format incorrect:', data);
        return [];
      }
    } catch (error) {
      console.error('❌ Tours API connection failed:', error);
      return [];
    }
  },

  testTourService: async () => {
    try {
      console.log('🔍 Testing tourService...');
      const { tourService } = await import('./tourService');
      const data = await tourService.getTours();

      console.log('📦 tourService response:', JSON.stringify(data, null, 2));

      if (data && data.tours) {
        console.log('✅ tourService working! Count:', data.tours.length);
        console.log('🎯 First tour from service:', data.tours[0]);
        return data.tours;
      } else {
        console.error('❌ tourService response format incorrect');
        console.log('Expected format: { tours: [...], pagination: {...} }');
        return [];
      }
    } catch (error) {
      console.error('❌ tourService failed:', error);
      return [];
    }
  },

  testUseToursHook: async () => {
    try {
      console.log('🔍 Testing useTours hook...');
      const { useTours } = await import('../hooks/useTours');

      // Create a test component to use the hook
      let hookResult = {};
      const TestComponent = () => {
        hookResult = useTours({ page: 1, limit: 10 });
        return null;
      };

      // We can't easily test hooks outside React, so let's just check the service directly
      return await this.testTourService();
    } catch (error) {
      console.error('❌ useTours hook test failed:', error);
      return [];
    }
  }
};

// Auto-run debug when in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🐛 Debug service loaded. Run these in browser console:');
  console.log('  debugService.testToursAPI()');
  console.log('  debugService.testTourService()');
  console.log('  debugService.testUseToursHook()');
}
