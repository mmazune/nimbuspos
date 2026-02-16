import { prisma } from '@chefcloud/db';
import { seedRealisticExpansion } from './prisma/demo/seedRealisticExpansion';
async function main() {
  try {
    console.log('Running seedRealisticExpansion...');
    await seedRealisticExpansion(prisma);
    console.log('Done!');
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit(0);
}
main().catch(e => { console.error('Unhandled:', e); process.exit(1); });
