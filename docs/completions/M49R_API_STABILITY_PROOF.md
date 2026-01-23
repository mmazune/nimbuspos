# M49R — API Stability Proof Pack

**Date:** 2026-01-22  
**Objective:** Fix Windows API startup reliability and resume Print/Export audit

---

## 1. Root Cause Analysis

### Problem Identified
The API server was crashing/hanging on Windows due to the use of `nest start --watch` in the supervisor scripts.

### Evidence
- `services/api/scripts/api-supervisor.mjs` (lines 69-70) uses `pnpm start:dev` 
- `start:dev` script runs `nest start --watch`
- M31 documented that `--watch` mode hangs on Windows (confirmed in HARD_TIMEOUTS.md)
- When VS Code terminal lifecycle ends or parent process disconnects, watch mode hangs indefinitely

### Root Cause
The NestJS `--watch` flag uses webpack/chokidar file watchers that don't properly handle Windows terminal lifecycle events, causing indefinite hangs.

---

## 2. Fix Applied

### File Changes

#### `services/api/scripts/api-stable.mjs` (NEW)
A new Windows-stable API startup script that:
- Runs pre-built API directly via `node dist/src/main.js`
- NO `--watch` flag, NO webpack compilation
- Logs to `audit-results/_logs/api-stable-<timestamp>.log`
- Writes PID file for process management
- Proper SIGINT/SIGTERM handlers with Windows taskkill support

#### `services/api/package.json`
Added new script:
```json
"start:stable": "node scripts/api-stable.mjs"
```

---

## 3. Stable Boot Command

```powershell
# From repo root:
$apiPath = "c:\Users\arman\Desktop\nimbusPOS\nimbuspos\services\api"
Start-Process -FilePath "node" -ArgumentList "scripts/api-stable.mjs" -WorkingDirectory $apiPath -WindowStyle Hidden -PassThru
```

### Pre-requisites
- API must be pre-built: `pnpm -C services/api build`
- Dist file exists: `services/api/dist/src/main.js`

---

## 4. Health Poll Results (20/20)

| Poll | Time         | Status | Result | Duration (s) |
|------|--------------|--------|--------|--------------|
| 1    | 15:07:39.985 | 200    | OK     | 0.195998     |
| 2    | 15:07:43.310 | 200    | OK     | 0.009528     |
| 3    | 15:07:46.351 | 200    | OK     | 0.008636     |
| 4    | 15:07:49.389 | 200    | OK     | 0.008375     |
| 5    | 15:07:52.425 | 200    | OK     | 0.022387     |
| 6    | 15:07:55.519 | 200    | OK     | 0.014996     |
| 7    | 15:07:58.572 | 200    | OK     | 0.016658     |
| 8    | 15:08:01.631 | 200    | OK     | 0.017309     |
| 9    | 15:08:04.679 | 200    | OK     | 0.008555     |
| 10   | 15:08:07.713 | 200    | OK     | 0.007754     |
| 11   | 15:08:10.746 | 200    | OK     | 0.019289     |
| 12   | 15:08:13.794 | 200    | OK     | 0.011526     |
| 13   | 15:08:16.837 | 200    | OK     | 0.020516     |
| 14   | 15:08:19.949 | 200    | OK     | 0.011145     |
| 15   | 15:08:23.016 | 200    | OK     | 0.007662     |
| 16   | 15:08:26.049 | 200    | OK     | 0.022923     |
| 17   | 15:08:29.108 | 200    | OK     | 0.011606     |
| 18   | 15:08:32.158 | 200    | OK     | 0.011540     |
| 19   | 15:08:35.206 | 200    | OK     | 0.006143     |
| 20   | 15:08:38.247 | 200    | OK     | 0.007979     |

**Success Rate: 20/20 (100%)**

---

## 5. Log File Paths

| Log Type | Path |
|----------|------|
| API Stable Log | `services/api/audit-results/_logs/api-stable-2026-01-22T*.log` |
| API PID File | `services/api/audit-results/_logs/api-stable-2026-01-22T*.pid` |

---

## 6. Before/After Comparison

### Before (Broken)
```
pnpm -C services/api start:dev
→ nest start --watch
→ Webpack compilation starts
→ Server starts
→ Terminal lifecycle ends / Parent disconnects
→ Watch mode hangs indefinitely (Windows-specific)
→ API appears "running" but stops responding
→ Health checks fail after ~30-60s
```

### After (Fixed)
```
node scripts/api-stable.mjs
→ node dist/src/main.js (pre-built, no watch)
→ Server starts in <1s
→ No file watchers, no webpack
→ Proper signal handlers with taskkill
→ 20/20 health checks pass over 60s window
→ API remains stable for audit runs
```

---

## 7. Recommendations for Future Audits

1. **Always use `start:stable`** for Windows audit runs
2. **Always use `Start-Process -WindowStyle Hidden`** to detach from VS Code terminal
3. **Pre-build API** before running audits: `pnpm -C services/api build`
4. **Never use `--watch` mode** during automated audits on Windows
5. **Check health** before starting audits: `curl.exe -s http://127.0.0.1:3001/api/health`

---

## 8. GOAL A Status: ✅ COMPLETE

API is now stable and ready for GOAL B (Print/Export audit).
