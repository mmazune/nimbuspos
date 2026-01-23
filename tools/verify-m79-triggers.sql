-- M79: Verify DB triggers are active

SELECT 
    trigger_name, 
    event_manipulation AS event, 
    event_object_table AS table
FROM information_schema.triggers
WHERE event_object_table IN ('depletion_cost_breakdowns', 'order_inventory_depletions', 'goods_receipt_lines_v2')
ORDER BY event_object_table, trigger_name;
