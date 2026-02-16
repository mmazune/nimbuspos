/**
 * Report Data Seeding Module
 *
 * Seeds data specifically needed for restaurant reports:
 * - StockMovement records (for Inventory Movement report)
 * - InventoryWaste + lines (for Wastage & Shrinkage report)
 * - reorderLevel on InventoryItems (for Low Stock Alert report)
 * - KdsTicket + KdsTicketLine records (for Kitchen Performance report)
 * - costPrice metadata on menu items (for Menu Item Profitability)
 */
import { PrismaClient } from '@chefcloud/db';
export declare function seedReportData(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedReportData.d.ts.map