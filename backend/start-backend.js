const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting HNS Backend Server...');

// Start the server
const server = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`📊 Server process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
});

console.log('✅ Backend server started successfully!');
console.log('📊 Server should be running on http://localhost:5000');
console.log('🔗 API available at http://localhost:5000/api');
console.log('\nPress Ctrl+C to stop the server');
