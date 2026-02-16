import { prisma } from '@chefcloud/db';
import { FranchiseRankingCycle } from '@prisma/client';

const ORG_CAFESSERIE_ID = '00000000-0000-4000-8000-000000000002';

async function seedFranchiseRankings() {
  console.log('Seeding franchise rankings...');
  
  const branches = [
    { id: '00000000-0000-4000-8000-000000000201', name: 'Village Mall', rev: 156000000 },
    { id: '00000000-0000-4000-8000-000000000202', name: 'Acacia Mall', rev: 132000000 },
    { id: '00000000-0000-4000-8000-000000000203', name: 'Arena Mall', rev: 98000000 },
    { id: '00000000-0000-4000-8000-000000000204', name: 'Mombasa', rev: 78000000 },
  ];
  
  const now = new Date();
  const periods = [
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
    new Date(now.getFullYear(), now.getMonth() - 2, 1),
  ];
  
  for (const period of periods) {
    for (let rank = 1; rank <= branches.length; rank++) {
      const branch = branches[rank - 1];
      const score = 10 - rank * 0.5 + Math.random() * 0.5;
      const margin = branch.rev * (0.28 + Math.random() * 0.12);
      const waste = 2 + Math.random() * 3;
      const sla = 92 + Math.random() * 6;
      
      const id = 'rank-'+branch.id.slice(-4)+'-'+period.toISOString().slice(0,7);
      
      await prisma.franchiseRank.upsert({
        where: { id },
        update: {
          score,
          rank,
          meta: { revenue: branch.rev, margin: Math.round(margin), waste, sla, marginPercent: (margin/branch.rev*100), wastePercent: waste },
        },
        create: {
          id,
          orgId: ORG_CAFESSERIE_ID,
          branchId: branch.id,
          cycle: 'MONTHLY' as FranchiseRankingCycle,
          period,
          score,
          rank,
          meta: { revenue: branch.rev, margin: Math.round(margin), waste, sla, marginPercent: (margin/branch.rev*100), wastePercent: waste },
        },
      });
      console.log('  Rank '+rank+': '+branch.name+' rev='+branch.rev);
    }
  }
  console.log('Done!');
  process.exit(0);
}

seedFranchiseRankings();
