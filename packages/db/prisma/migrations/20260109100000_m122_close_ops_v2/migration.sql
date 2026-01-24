-- M12.2: Inventory Close Ops v2 Migration
-- Adds period event tracking + snapshot revision support

-- CreateEnum: InventoryPeriodEventType
DO $$ BEGIN
    CREATE TYPE "InventoryPeriodEventType" AS ENUM ('CREATED', 'CLOSED', 'REOPENED', 'OVERRIDE_USED', 'EXPORT_GENERATED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateTable: inventory_period_events
CREATE TABLE IF NOT EXISTS "inventory_period_events" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "type" "InventoryPeriodEventType" NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "metadataJson" JSONB,

    CONSTRAINT "inventory_period_events_pkey" PRIMARY KEY ("id")
);

-- Add revision column to inventory_valuation_snapshots (only if table exists)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_valuation_snapshots') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_valuation_snapshots' AND column_name = 'revision') THEN
            ALTER TABLE "inventory_valuation_snapshots" ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;
        END IF;
    END IF;
END $$;

-- Add revision column to inventory_period_movement_summaries (only if table exists)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_period_movement_summaries') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_period_movement_summaries' AND column_name = 'revision') THEN
            ALTER TABLE "inventory_period_movement_summaries" ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;
        END IF;
    END IF;
END $$;

-- CreateIndex: inventory_period_events org+branch
CREATE INDEX IF NOT EXISTS "inventory_period_events_orgId_branchId_idx" ON "inventory_period_events"("orgId", "branchId");

-- CreateIndex: inventory_period_events periodId
CREATE INDEX IF NOT EXISTS "inventory_period_events_periodId_idx" ON "inventory_period_events"("periodId");

-- Drop existing unique constraints if they exist (to recreate with revision)
-- Note: These may not exist in all environments, so we use IF EXISTS pattern via DO block
DO $$ 
BEGIN
    -- Drop old unique constraint on valuation snapshots
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventory_valuation_snapshots_periodId_itemId_locationId_key') THEN
        ALTER TABLE "inventory_valuation_snapshots" DROP CONSTRAINT "inventory_valuation_snapshots_periodId_itemId_locationId_key";
    END IF;
    
    -- Drop old unique constraint on movement summaries
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventory_period_movement_summaries_periodId_itemId_key') THEN
        ALTER TABLE "inventory_period_movement_summaries" DROP CONSTRAINT "inventory_period_movement_summaries_periodId_itemId_key";
    END IF;
END $$;

-- Create new unique constraints with revision (only if tables exist)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_valuation_snapshots') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'inventory_valuation_snapshots_periodId_itemId_locationId_revis_key') THEN
            CREATE UNIQUE INDEX "inventory_valuation_snapshots_periodId_itemId_locationId_revis_key" 
            ON "inventory_valuation_snapshots"("periodId", "itemId", "locationId", "revision");
        END IF;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_period_movement_summaries') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'inventory_period_movement_summaries_periodId_itemId_revision_key') THEN
            CREATE UNIQUE INDEX "inventory_period_movement_summaries_periodId_itemId_revision_key" 
            ON "inventory_period_movement_summaries"("periodId", "itemId", "revision");
        END IF;
    END IF;
END $$;

-- AddForeignKey: inventory_period_events -> organizations (use orgs not organizations)
DO $$ BEGIN
    ALTER TABLE "inventory_period_events" 
    ADD CONSTRAINT "inventory_period_events_orgId_fkey" 
    FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AddForeignKey: inventory_period_events -> branches
DO $$ BEGIN
    ALTER TABLE "inventory_period_events" 
    ADD CONSTRAINT "inventory_period_events_branchId_fkey" 
    FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AddForeignKey: inventory_period_events -> inventory_periods (only if table exists)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_periods') THEN
        ALTER TABLE "inventory_period_events" 
        ADD CONSTRAINT "inventory_period_events_periodId_fkey" 
        FOREIGN KEY ("periodId") REFERENCES "inventory_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AddForeignKey: inventory_period_events -> users
DO $$ BEGIN
    ALTER TABLE "inventory_period_events" 
    ADD CONSTRAINT "inventory_period_events_actorUserId_fkey" 
    FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
