-- Fix migration: Create inventory_locations table
-- This table was missing from migrations but is required by M11.2+ migrations

-- CreateTable: inventory_locations
CREATE TABLE "inventory_locations" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "locationType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_locations_pkey" PRIMARY KEY ("id")
);

-- Unique and indexes
CREATE UNIQUE INDEX "inventory_locations_branchId_code_key" ON "inventory_locations"("branchId", "code");
CREATE INDEX "inventory_locations_orgId_idx" ON "inventory_locations"("orgId");
CREATE INDEX "inventory_locations_branchId_idx" ON "inventory_locations"("branchId");

-- Self-reference FK for parent location
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "inventory_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- FK to branches
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
