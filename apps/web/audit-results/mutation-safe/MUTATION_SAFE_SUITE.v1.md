# Mutation-Safe Micro-Suite Results

**Generated:** 2026-01-23T10:38:08.468Z

---

## Summary

| Status | Count |
|--------|-------|
| ✅ Passed | 0 |
| ❌ Failed | 10 |
| 🚫 Blocked (Total) | 0 |
| ⚠️ Expected Blocked (RBAC) | 0 |
| 🔴 Unexpected Blocked | 0 |
| ⏭️ Skipped | 0 |
| **Total** | **10** |

**Pass Rate:** 0%
**Issues (Fail + Unexpected Block):** 10

---

## Test Results

| Test | Status | Duration | BlockReason | Evidence |
|------|--------|----------|-------------|----------|
| MS-1: PO Create Form | ❌ FAIL | 31ms | - | Login failed: apiRequestContext.pos |
| MS-2: Transfer Create Form | ❌ FAIL | 8ms | - | [2mexpect([22m[31mreceived[39m |
| MS-3: Waste Create Form | ❌ FAIL | 6ms | - | [2mexpect([22m[31mreceived[39m |
| MS-4: Receipt Create Form | ❌ FAIL | 8ms | - | [2mexpect([22m[31mreceived[39m |
| MS-5: Inventory Items List | ❌ FAIL | 7ms | - | [2mexpect([22m[31mreceived[39m |
| MS-6: Suppliers List | ❌ FAIL | 6ms | - | [2mexpect([22m[31mreceived[39m |
| MS-7: Purchase Orders List | ❌ FAIL | 6ms | - | [2mexpect([22m[31mreceived[39m |
| MS-8: Stock Levels | ❌ FAIL | 7ms | - | [2mexpect([22m[31mreceived[39m |
| MS-9: Dashboard KPIs | ❌ FAIL | 7ms | - | [2mexpect([22m[31mreceived[39m |
| MS-10: Reports Page | ❌ FAIL | 7ms | - | [2mexpect([22m[31mreceived[39m |

---

## Notes

- This suite exercises mutation-risk controls **safely**
- Create forms are opened but **not submitted**
- No data was modified or created during these tests
- ⚠️ Expected blocked = RBAC restriction or missing precondition (warning, not failure)
- 🔴 Unexpected blocked = harness issue that needs fixing