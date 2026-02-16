// Minimal bootstrap - uses ts-node to load the API
const path = require('path');
console.log('[BOOT] Starting...');
console.log('[BOOT] CWD:', process.cwd());
process.chdir(__dirname);
console.log('[BOOT] CWD now:', process.cwd());

try {
  require('ts-node').register({
    transpileOnly: true,
    project: path.join(__dirname, 'tsconfig.json'),
    compilerOptions: {
      module: 'commonjs',
      target: 'ES2021',
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
  });
  console.log('[BOOT] ts-node registered');
} catch (e) {
  console.error('[BOOT] ts-node register FAILED:', e.message);
  process.exit(1);
}

try {
  console.log('[BOOT] Loading src/main...');
  require('./src/main');
  console.log('[BOOT] src/main loaded');
} catch (e) {
  console.error('[BOOT] require(main) FAILED:', e.message);
  console.error(e.stack);
  process.exit(1);
}
