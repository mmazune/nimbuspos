-- M11.4: Recipes/BOM + POS Depletion

-- Create RecipeTargetType enum
DO $$ BEGIN
    CREATE TYPE "RecipeTargetType" AS ENUM ('MENU_ITEM', 'INVENTORY_ITEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create DepletionStatus enum
DO $$ BEGIN
    CREATE TYPE "DepletionStatus" AS ENUM ('PENDING', 'POSTED', 'FAILED', 'SKIPPED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add locationType to inventory_locations for depletion resolution
DO $$ BEGIN
    ALTER TABLE "inventory_locations" ADD COLUMN "locationType" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add depletionLocationId to branches for default depletion location
DO $$ BEGIN
    ALTER TABLE "branches" ADD COLUMN "depletionLocationId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create Recipe table
CREATE TABLE IF NOT EXISTS "recipes" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetType" "RecipeTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "outputQtyBase" DECIMAL(12,4) NOT NULL DEFAULT 1,
    "outputUomId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- Create RecipeLine table
CREATE TABLE IF NOT EXISTS "recipe_lines" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "qtyInput" DECIMAL(12,4) NOT NULL,
    "inputUomId" TEXT NOT NULL,
    "qtyBase" DECIMAL(12,4) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_lines_pkey" PRIMARY KEY ("id")
);

-- Create OrderInventoryDepletion table (idempotency record)
CREATE TABLE IF NOT EXISTS "order_inventory_depletions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "status" "DepletionStatus" NOT NULL DEFAULT 'PENDING',
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "ledgerEntryCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postedAt" TIMESTAMP(3),

    CONSTRAINT "order_inventory_depletions_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint for Recipe (one recipe per target)
CREATE UNIQUE INDEX IF NOT EXISTS "recipes_orgId_targetType_targetId_key" ON "recipes"("orgId", "targetType", "targetId");

-- Add indexes for Recipe
CREATE INDEX IF NOT EXISTS "recipes_orgId_idx" ON "recipes"("orgId");
CREATE INDEX IF NOT EXISTS "recipes_targetType_targetId_idx" ON "recipes"("targetType", "targetId");

-- Add indexes for RecipeLine
CREATE INDEX IF NOT EXISTS "recipe_lines_recipeId_idx" ON "recipe_lines"("recipeId");
CREATE INDEX IF NOT EXISTS "recipe_lines_inventoryItemId_idx" ON "recipe_lines"("inventoryItemId");

-- Add unique constraint for OrderInventoryDepletion (one depletion per order)
CREATE UNIQUE INDEX IF NOT EXISTS "order_inventory_depletions_orderId_key" ON "order_inventory_depletions"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "order_inventory_depletions_orgId_orderId_key" ON "order_inventory_depletions"("orgId", "orderId");

-- Add indexes for OrderInventoryDepletion
CREATE INDEX IF NOT EXISTS "order_inventory_depletions_orderId_idx" ON "order_inventory_depletions"("orderId");
CREATE INDEX IF NOT EXISTS "order_inventory_depletions_branchId_status_idx" ON "order_inventory_depletions"("branchId", "status");

-- Add foreign key constraints for branches.depletionLocationId
DO $$ BEGIN
    ALTER TABLE "branches" ADD CONSTRAINT "branches_depletionLocationId_fkey" FOREIGN KEY ("depletionLocationId") REFERENCES "inventory_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for recipes
DO $$ BEGIN
    ALTER TABLE "recipes" ADD CONSTRAINT "recipes_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "recipes" ADD CONSTRAINT "recipes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "recipes" ADD CONSTRAINT "recipes_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "recipes" ADD CONSTRAINT "recipes_outputUomId_fkey" FOREIGN KEY ("outputUomId") REFERENCES "units_of_measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add foreign key constraints for recipe_lines
DO $$ BEGIN
    ALTER TABLE "recipe_lines" ADD CONSTRAINT "recipe_lines_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "recipe_lines" ADD CONSTRAINT "recipe_lines_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "recipe_lines" ADD CONSTRAINT "recipe_lines_inputUomId_fkey" FOREIGN KEY ("inputUomId") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add foreign key constraints for order_inventory_depletions
DO $$ BEGIN
    ALTER TABLE "order_inventory_depletions" ADD CONSTRAINT "order_inventory_depletions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "order_inventory_depletions" ADD CONSTRAINT "order_inventory_depletions_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "order_inventory_depletions" ADD CONSTRAINT "order_inventory_depletions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
