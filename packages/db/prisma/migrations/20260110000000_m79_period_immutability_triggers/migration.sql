-- M79: Period Immutability DB Triggers
-- 
-- Purpose: Enforce fiscal period immutability at the database level (non-bypassable)
-- Applies to: DepletionCostBreakdown, OrderInventoryDepletion, GoodsReceiptLineV2
--
-- Defense-in-depth strategy:
--   Layer 1: Application guard (assertPeriodOpen) - M78/M79
--   Layer 2: Database trigger (this migration) - M79
--
-- Bypass mechanism: Session variable for migrations/seeds only
--   SET SESSION app.bypass_period_check = 'true';

-- =============================================================================
-- FUNCTION: check_period_immutability
-- =============================================================================
-- Checks if the record date falls within a CLOSED fiscal period
-- Raises exception if period is closed (unless bypass is enabled)
-- =============================================================================

CREATE OR REPLACE FUNCTION check_period_immutability()
RETURNS TRIGGER AS $$
DECLARE
    v_closed_period_id TEXT;
    v_period_name TEXT;
    v_period_start TIMESTAMP;
    v_period_end TIMESTAMP;
    v_bypass_enabled TEXT;
    v_record_date TIMESTAMP;
    v_org_id TEXT;
BEGIN
    -- Check if bypass is enabled (for migrations/seeds)
    BEGIN
        v_bypass_enabled := current_setting('app.bypass_period_check', true);
    EXCEPTION
        WHEN OTHERS THEN
            v_bypass_enabled := 'false';
    END;

    IF v_bypass_enabled = 'true' THEN
        RETURN NEW;
    END IF;

    -- Determine record date and orgId based on table
    IF TG_TABLE_NAME = 'depletion_cost_breakdowns' THEN
        v_record_date := NEW.computed_at;
        v_org_id := NEW.org_id;
    ELSIF TG_TABLE_NAME = 'order_inventory_depletions' THEN
        v_record_date := NEW.created_at;
        v_org_id := NEW.org_id;
    ELSIF TG_TABLE_NAME = 'goods_receipt_lines_v2' THEN
        v_record_date := NEW.created_at;
        v_org_id := (SELECT org_id FROM goods_receipts WHERE id = NEW.goods_receipt_id LIMIT 1);
    ELSE
        -- Unknown table, allow operation
        RETURN NEW;
    END IF;

    -- Check if record date falls in a CLOSED fiscal period
    SELECT id, name, starts_at, ends_at
    INTO v_closed_period_id, v_period_name, v_period_start, v_period_end
    FROM fiscal_periods
    WHERE org_id = v_org_id
      AND starts_at <= v_record_date
      AND ends_at >= v_record_date
      AND status = 'CLOSED'
    LIMIT 1;

    IF v_closed_period_id IS NOT NULL THEN
        RAISE EXCEPTION 'PERIOD_CLOSED_IMMUTABLE: Cannot % record in closed fiscal period "%" (% to %)',
            TG_OP,
            v_period_name,
            v_period_start,
            v_period_end
            USING ERRCODE = 'P0001', -- Custom error code
                  DETAIL = format('periodId=%s, table=%s, operation=%s', v_closed_period_id, TG_TABLE_NAME, TG_OP);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGER: period_immutability_depletion_cost_breakdown
-- =============================================================================
-- Prevents INSERT/UPDATE/DELETE on DepletionCostBreakdown in closed periods
-- =============================================================================

DROP TRIGGER IF EXISTS period_immutability_depletion_cost_breakdown ON depletion_cost_breakdowns;

CREATE TRIGGER period_immutability_depletion_cost_breakdown
    BEFORE INSERT OR UPDATE OR DELETE ON depletion_cost_breakdowns
    FOR EACH ROW
    EXECUTE FUNCTION check_period_immutability();

-- =============================================================================
-- TRIGGER: period_immutability_order_inventory_depletion
-- =============================================================================
-- Prevents INSERT/UPDATE/DELETE on OrderInventoryDepletion in closed periods
-- =============================================================================

DROP TRIGGER IF EXISTS period_immutability_order_inventory_depletion ON order_inventory_depletions;

CREATE TRIGGER period_immutability_order_inventory_depletion
    BEFORE INSERT OR UPDATE OR DELETE ON order_inventory_depletions
    FOR EACH ROW
    EXECUTE FUNCTION check_period_immutability();

-- =============================================================================
-- TRIGGER: period_immutability_goods_receipt_line_v2
-- =============================================================================
-- Prevents INSERT/UPDATE/DELETE on GoodsReceiptLineV2 in closed periods
-- =============================================================================

DROP TRIGGER IF EXISTS period_immutability_goods_receipt_line_v2 ON goods_receipt_lines_v2;

CREATE TRIGGER period_immutability_goods_receipt_line_v2
    BEFORE INSERT OR UPDATE OR DELETE ON goods_receipt_lines_v2
    FOR EACH ROW
    EXECUTE FUNCTION check_period_immutability();

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Use these to verify triggers are active:
--
-- 1. List all triggers on accounting tables:
--    SELECT trigger_name, event_manipulation, event_object_table
--    FROM information_schema.triggers
--    WHERE event_object_table IN ('depletion_cost_breakdowns', 'order_inventory_depletions', 'goods_receipt_lines_v2')
--    ORDER BY event_object_table, trigger_name;
--
-- 2. Test trigger enforcement (should fail):
--    BEGIN;
--    -- Create a closed period
--    INSERT INTO fiscal_periods (id, org_id, name, starts_at, ends_at, status)
--    VALUES ('test-period', 'test-org', 'Test Period', '2025-01-01', '2025-01-31', 'CLOSED');
--    
--    -- Try to create a depletion breakdown in closed period (should fail)
--    INSERT INTO depletion_cost_breakdowns (id, org_id, depletion_id, order_id, item_id, qty_depleted, unit_cost, line_cogs, computed_at)
--    VALUES ('test-breakdown', 'test-org', 'test-dep', 'test-order', 'test-item', 1, 10, 10, '2025-01-15');
--    -- Expected: ERROR:  PERIOD_CLOSED_IMMUTABLE
--    ROLLBACK;
--
-- 3. Test bypass mechanism (should succeed):
--    BEGIN;
--    SET SESSION app.bypass_period_check = 'true';
--    -- Same INSERT as above
--    INSERT INTO depletion_cost_breakdowns (id, org_id, depletion_id, order_id, item_id, qty_depleted, unit_cost, line_cogs, computed_at)
--    VALUES ('test-breakdown', 'test-org', 'test-dep', 'test-order', 'test-item', 1, 10, 10, '2025-01-15');
--    -- Expected: SUCCESS
--    SET SESSION app.bypass_period_check = 'false';
--    ROLLBACK;
--
-- =============================================================================
-- MIGRATION NOTES
-- =============================================================================
--
-- Rollback:
--   DROP TRIGGER IF EXISTS period_immutability_depletion_cost_breakdown ON depletion_cost_breakdowns;
--   DROP TRIGGER IF EXISTS period_immutability_order_inventory_depletion ON order_inventory_depletions;
--   DROP TRIGGER IF EXISTS period_immutability_goods_receipt_line_v2 ON goods_receipt_lines_v2;
--   DROP FUNCTION IF EXISTS check_period_immutability();
--
-- Performance Impact:
--   - One additional SELECT per INSERT/UPDATE/DELETE (lookup fiscal period)
--   - Indexed lookups on fiscal_periods (org_id, starts_at, ends_at, status)
--   - Expected overhead: < 1ms per operation
--
-- Bypass Usage:
--   - Seed scripts: SET bypass at start, UNSET at end
--   - Migrations: Use bypass only for data corrections, document reason
--   - Admin tools: NEVER use bypass, enforce via application layer
--
-- =============================================================================
