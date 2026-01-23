import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkReceipts() {
  try {
    const grCount = await prisma.goodsReceipt.count();
    console.log(`📦 GoodsReceipt table count: ${grCount}`);

    const poCount = await prisma.purchaseOrderV2.count();
    console.log(`📋 PurchaseOrderV2 table count: ${poCount}`);

    if (grCount > 0) {
      const sampleGR = await prisma.goodsReceipt.findFirst({
        include: {
          lines: true,
        }
      });
      console.log('\nSample GoodsReceipt:');
      console.log(JSON.stringify(sampleGR, null, 2));
    }

    if (poCount > 0) {
      const samplePO = await prisma.purchaseOrderV2.findFirst();
      console.log('\nSample PurchaseOrderV2:');
      console.log(JSON.stringify(samplePO, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkReceipts();
