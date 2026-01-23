# Hard Timeouts Rule — Process Deadline Enforcement

**Purpose:** Prevent indefinite hangs in E2E tests, audits, and long-running commands. Every potentially blocking command MUST have a hard outer deadline that kills the process tree and returns deterministic exit codes.

---

## 1. Core Rule

**NEVER run Playwright, Jest E2E, or long-running Node commands without a deadline wrapper.**

### Bad (hangs possible):
```powershell
npx playwright test e2e/role-audit/audit.spec.ts
```

### Good (hard deadline enforced):
```powershell
node scripts/run-with-deadline.mjs 900000 "npx playwright test e2e/role-audit/audit.spec.ts"
```

---

## 2. Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Command succeeded |
| 1-123 | Command failed (child exit code) |
| 124 | **TIMEOUT** - Process killed by deadline wrapper |

---

## 3. Log Requirements

Every deadline-wrapped command MUST produce:
- Timestamped log file with stdout/stderr interleaved
- Start/end timestamps
- Duration in milliseconds
- Exit code (actual vs timeout)
- Process tree kill confirmation on Windows

**Log path format:**
```
apps/web/audit-results/_logs/<command-name>-<timestamp>.log
```

---

## 4. Platform Compatibility

### Windows (PowerShell):
- Kill process tree: `taskkill /PID <pid> /T /F`
- Spawns must use `.cmd` suffix for pnpm/npm
- Log paths use backslashes

### Unix (Linux/Mac):
- Kill process tree: `process.kill(-pid, 'SIGKILL')` (negative PID for group)
- Uses standard `pnpm` without suffix
- Log paths use forward slashes

---

## 5. Hang Forensics — Root Cause Hypotheses

When audits/tests hang, investigate these causes in order:

### H1: Open Handles (Most Common)
**Symptoms:**
- Jest shows "A worker process has failed to exit gracefully"
- `--detectOpenHandles` lists timers, DB connections, sockets

**Fixes:**
- Add `afterAll()` cleanup in every spec file
- Close Prisma connections: `await app.get(PrismaService).$disconnect()`
- Clear intervals/timeouts: `clearInterval(id)`, `clearTimeout(id)`
- Close event emitters, SSE streams, WebSocket connections

### H2: Playwright Browser Not Closing
**Symptoms:**
- Browser/chromium processes remain after test completion
- No error in logs, just hangs at end

**Fixes:**
- Ensure `await browser.close()` in Playwright `afterAll`
- Use `--workers=1` to avoid worker process leaks
- Check for unclosed pages: `await page.close()`

### H3: Process Spawn Without Cleanup
**Symptoms:**
- Child processes spawned but not tracked/killed
- `ps aux` or Task Manager shows orphaned node/chromium processes

**Fixes:**
- Track spawned processes in array, kill on SIGINT/SIGTERM
- Use `child.kill('SIGTERM')` or `taskkill` on Windows
- Register cleanup handlers: `process.on('exit', cleanup)`

### H4: Deadlock in Async Code
**Symptoms:**
- Progress stops mid-test without errors
- Last log message suggests waiting on a promise

**Fixes:**
- Wrap all potentially blocking awaits with `withTimeout()`
- Add trace logging: `console.log('[TRACE] Starting operation X')`
- Check for circular waits or missing resolves

### H5: External Service Unresponsive
**Symptoms:**
- API/database calls never return
- Logs show API request sent but no response

**Fixes:**
- Verify services running: `GET http://localhost:3001/api/health`
- Add request timeouts: `axios.get(url, { timeout: 5000 })`
- Use retry logic with max attempts

---

## 6. Standard Timeouts by Command Type

| Command Type | Timeout | Rationale |
|--------------|---------|-----------|
| Lint | 5 min | Fast, predictable |
| Build | 10 min | TypeScript compilation |
| Unit Tests | 10 min | Fast, isolated |
| E2E API Tests | 15 min | Database + module bootstrap |
| Playwright Subset (4 roles) | 12-15 min | ~3 min per role |
| Playwright Full (19 roles) | 45 min | ~2.5 min per role |
| Full Test Suite | 30 min | All tests combined |

---

## 7. Wrapper Implementation Contract

Any deadline wrapper script MUST:
1. Accept: `<timeout_ms> <command> [args...]`
2. Spawn command with stdio piped to log file
3. Start deadline timer
4. On timeout:
   - Kill process tree (Windows: `taskkill /T`, Unix: `kill -SIGKILL -<pid>`)
   - Write "[TIMEOUT] Killed process after Xms" to log
   - Exit with code 124
5. On natural completion:
   - Flush logs
   - Exit with child exit code

---

## 8. Integration with Package Scripts

**Before (hangs possible):**
```json
{
  "ui:audit": "playwright test e2e/role-audit/audit.spec.ts"
}
```

**After (hard deadline enforced):**
```json
{
  "ui:audit": "node ../../scripts/run-with-deadline.mjs 900000 \"npx playwright test e2e/role-audit/audit.spec.ts --workers=1 --reporter=line\""
}
```

---

## 9. Performance Optimizations (M30)

### Resource Blocking

Role audits block non-essential browser resources to improve page load times:

**Blocked:** `image`, `media`, `font`  
**Allowed:** `document`, `stylesheet`, `script`, `xhr`, `fetch`, `websocket`

**Why this is safe:**
- Role audits verify DOM structure, API calls, and click behavior
- Images/media/fonts do not affect route discovery, control detection, or network monitoring
- CSS is preserved to ensure layout-dependent elements (dropdowns, modals) work correctly
- Scripts and fetch/xhr are essential for SPA functionality and API monitoring
- Reduces network bandwidth by ~40-60% per page load

### Storage State Caching

Auth tokens are cached to `audit-results/_auth/{org}_{role}.json`:
- Avoids repeated login API calls (saves ~2-3s per role)
- Reduces API server load during extended audit runs
- Auto-expires after 24 hours
- Falls back to fresh login if cache is invalid

---

## 10. Verification Checklist

Before considering M12 complete:
- [ ] Wrapper script exists at `scripts/run-with-deadline.mjs`
- [ ] Wrapper enforces timeout and kills process tree
- [ ] Wrapper exits 124 on timeout, child code otherwise
- [ ] Logs written to `audit-results/_logs/` with timestamp
- [ ] Package scripts wired to use wrapper
- [ ] 4-role subset audit completes without manual intervention
- [ ] Artifacts produced: 4 JSON + 4 MD + 1 log file

---

## 11. Example Usage

```powershell
# Run subset audit with 15-minute hard deadline
cd apps/web
pnpm ui:audit

# Expected behavior:
# - Starts audit at 10:00:00
# - Runs up to 15 minutes (900000ms)
# - If not done by 10:15:00, kills process tree
# - Exits 124 if timeout, 0 if success, 1+ if test failed
# - Log file: audit-results/_logs/ui-audit-20260119-100000.log
```

---

**Last Updated:** 2026-01-21  
**Milestone:** M12 — Hard Timeout Enforcement, M30 — Speed + Stability Upgrade
