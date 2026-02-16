const { execSync } = require('child_process');

// Set clean env vars without newlines
const vars = {
  NEXT_PUBLIC_API_URL: 'https://api-production-5ffe.up.railway.app',
  NEXT_PUBLIC_API_BASE_URL: 'https://api-production-5ffe.up.railway.app',
};

for (const [key, value] of Object.entries(vars)) {
  console.log(`Setting ${key}=${value}`);
  
  // Use spawn to pipe value without newlines
  const { spawnSync } = require('child_process');
  const result = spawnSync('vercel', ['env', 'add', key, 'production'], {
    input: value,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true,
  });
  
  console.log('stdout:', result.stdout);
  console.log('stderr:', result.stderr);
  console.log('---');
}
