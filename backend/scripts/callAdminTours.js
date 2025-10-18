(async () => {
  const base = 'http://localhost:5000/api';
  try {
    const loginRes = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hanoisuntravel.com', password: 'admin123' })
    });
    const loginBody = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed:', loginBody);
      process.exit(1);
    }
    const token = loginBody.data.token;

    const url = base + '/admin/tours?page=1&limit=10';
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const text = await res.text();
    console.log('Status:', res.status, res.statusText);
    console.log('Body:', text);
  } catch (e) {
    console.error('Request error:', e.message);
  }
})();
