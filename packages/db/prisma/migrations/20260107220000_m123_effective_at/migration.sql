-- M12.3: Add effectiveAt field to InventoryLedgerEntry
-- This field represents the business event date (when the transaction occurred)
-- Separate from createdAt (when the record was created in the system)

-- Only run if table exists (may be created in a later migration)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_ledger_entries') THEN
        -- Add effectiveAt column with default to createdAt
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_ledger_entries' AND column_name = 'effectiveAt') THEN
            ALTER TABLE "inventory_ledger_entries" ADD COLUMN "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();
            -- Backfill existing records: effectiveAt = createdAt
            UPDATE "inventory_ledger_entries" SET "effectiveAt" = "createdAt";
        END IF;
        
        -- Add indexes (idempotent)
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'inventory_ledger_entries_effectiveAt_idx') THEN
            CREATE INDEX "inventory_ledger_entries_effectiveAt_idx" ON "inventory_ledger_entries"("effectiveAt");
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'inventory_ledger_entries_branchId_effectiveAt_idx') THEN
            CREATE INDEX "inventory_ledger_entries_branchId_effectiveAt_idx" ON "inventory_ledger_entries"("branchId", "effectiveAt");
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'inventory_ledger_entries_orgId_branchId_effectiveAt_idx') THEN
            CREATE INDEX "inventory_ledger_entries_orgId_branchId_effectiveAt_idx" ON "inventory_ledger_entries"("orgId", "branchId", "effectiveAt");
        END IF;
    END IF;
END $$;
