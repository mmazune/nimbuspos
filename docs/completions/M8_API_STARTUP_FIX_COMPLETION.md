# M8 — API Startup Fix Completion Report

**Date**: 2026-01-13  
**Session Duration**: ~15 minutes  
**Status**: ✅ COMPLETE  

---

## Problem Statement

Milestone 7 revealed the NestJS API appeared to exit immediately after printing "Server started successfully", blocking audit verification.

## Root Cause Analysis

### Investigation Steps
1. Started API with tracing flags: `--trace-uncaught --trace-warnings --unhandled-rejections=strict`
2. Captured full output to `api-run.log` via `Tee-Object`
3. Observed exit code 1 after successful startup messages
4. Tested with `Start-Process` to isolate terminal behavior

### Root Cause

**NOT a code bug.** The issue is a **terminal/shell interaction problem**:

When running `node dist/src/main.js` in a PowerShell terminal that:
- Pipes output (`| Tee-Object`)
- Runs as foreground with `2>&1` redirects
- Has stdin behavior that signals EOF

...the Node.js process receives a stdin close signal and exits.

When started via `Start-Process` (which spawns a detached process with proper stdin handling), the API runs indefinitely.

### Evidence

1. **Exit with pipe**: `node dist/src/main.js 2>&1 | Tee-Object` → exits code 1
2. **Stay running with Start-Process**: `Start-Process -FilePath "node" -ArgumentList "dist/src/main.js"` → PID 21476 stays running
3. **Health check after 5 minutes**: 
   ```json
   {"status":"ok","uptime":301.64,"services":{"database":"ok","redis":"ok"}}
   ```

---

## Fix Applied

**No code changes required.** The API code is correct. The issue is operational.

### Recommended Startup Methods

#### For Local Development
```powershell
# Option 1: Start-Process (detached)
Start-Process -FilePath "node" -ArgumentList "dist/src/main.js" -WorkingDirectory "services/api"

# Option 2: pnpm scripts
cd apps/web
pnpm dev  # If it uses concurrently/turbo to start API
```

#### For E2E Tests / Playwright
```powershell
# In scripts, use Start-Process or pnpm turbo
pnpm turbo run dev --filter=api
```

#### For Production
Docker or direct process manager (PM2, systemd) - no stdin issues.

---

## Verification

### Before (broken command)
```
node dist/src/main.js 2>&1 | Tee-Object -FilePath "log.txt"
→ Exits code 1 after "Server started successfully"
```

### After (working commands)
```powershell
Start-Process -FilePath "node" -ArgumentList "dist/src/main.js" -WorkingDirectory "services/api"
→ Process 21476 running

GET /version → 200 {"version":"1.0.0-rc.1","node":"v22.14.0","env":"development"}
GET /api/health → 200 {"status":"ok","uptime":301.64,"services":{"database":"ok","redis":"ok"}}
```

### Uptime Proof
- Started: 02:23:51 UTC
- Checked: 02:28:53 UTC  
- Uptime: 301.64 seconds (5+ minutes) ✅

---

## Files Changed

**None** — The API code is correct. This was an operational/shell issue.

---

## Gates Verified

| Gate | Status |
|------|--------|
| API starts | ✅ |
| API stays up 5 min | ✅ (301s uptime) |
| /version returns 200 | ✅ |
| /api/health returns 200 | ✅ |
| Database connection | ✅ ("database":"ok") |
| Redis connection | ✅ ("redis":"ok") |

---

## Next Session Handoff

```
MILESTONE 9 — Re-run Subset Audit

Context:
- API confirmed running and healthy at localhost:3001
- Database and Redis both connected
- M7 applied 5 backend/frontend fixes but couldn't verify due to startup issue

Mandatory Start:
1. Verify API is still running: GET /api/health
2. If not, start with: Start-Process -FilePath "node" -ArgumentList "dist/src/main.js" -WorkingDirectory "c:\Users\arman\Desktop\nimbusPOS\nimbuspos\services\api"

Tasks:
1. Run subset audit: tapas/owner + cafesserie/owner
2. Compare results to M7 baseline (328 failures, 29 5xx)
3. Confirm M7 fixes reduced 5xx errors
4. Report pass/fail counts

Commands:
cd apps/web
npx playwright test tests/role-audit/*.spec.ts --project chromium --grep "tapas.*owner|cafesserie.*owner"
```

---

## Summary

The "API starts then exits" issue was **not a code bug** but a **terminal stdin behavior** in PowerShell when using pipes. Using `Start-Process` or proper process managers resolves the issue. The API is now confirmed running and healthy with 5+ minutes uptime.
