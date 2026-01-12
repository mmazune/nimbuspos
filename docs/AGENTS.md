# Nimbus POS / ChefCloud — Agent Workflow Protocol

**Purpose:** Prevent looping and ensure stable, evidence-based work for all LLM agents (Cursor, ChatGPT, etc.).

---

## Hard Reset Protocol

**Paste this at the start of every new chat session:**

```
I'm working in the Nimbus POS / ChefCloud monorepo.

1. Read: AI_START_HERE.md
2. Read: AI_INDEX.json
3. Read: docs/SESSION_STATE.yml
4. Read: instructions/00_START_HERE.md

Do NOT implement features or change runtime code until you've confirmed understanding of these files.
```

---

## Must-Read Files (In Order)

| Order | File | Purpose |
|-------|------|---------|
| 1 | `AI_START_HERE.md` | Canonical entrypoint, quick links |
| 2 | `AI_INDEX.json` | Machine-readable pointers |
| 3 | `docs/SESSION_STATE.yml` | **Current objective** + gates |
| 4 | `instructions/00_START_HERE.md` | Engineering contract, standards |

**⚠️ DO NOT proceed without reading all four files.**

---

## Gates Are Mandatory

**Do not skip gates. Do not claim success without running them.**

Minimum gates for any work session:

```powershell
# Windows PowerShell (with timeout)
$proc = Start-Process -FilePath "pnpm" -ArgumentList "-C","services/api","lint" -PassThru -NoNewWindow -Wait
if ($proc.ExitCode -ne 0) { Write-Error "API lint FAILED" }

$proc = Start-Process -FilePath "pnpm" -ArgumentList "-C","services/api","build" -PassThru -NoNewWindow -Wait
if ($proc.ExitCode -ne 0) { Write-Error "API build FAILED" }

$proc = Start-Process -FilePath "pnpm" -ArgumentList "-C","apps/web","lint" -PassThru -NoNewWindow -Wait
if ($proc.ExitCode -ne 0) { Write-Error "Web lint FAILED" }

$proc = Start-Process -FilePath "pnpm" -ArgumentList "-C","apps/web","build" -PassThru -NoNewWindow -Wait
if ($proc.ExitCode -ne 0) { Write-Error "Web build FAILED" }
```

```bash
# Linux/Mac
timeout 5m pnpm -C services/api lint
timeout 10m pnpm -C services/api build
timeout 5m pnpm -C apps/web lint
timeout 10m pnpm -C apps/web build
```

---

## Issue Logging and Tracking (MANDATORY)

### When Encountering ANY Issue

1. **Log Immediately** — All issues (pre-existing or new) MUST be logged in `instructions/PRE_EXISTING_ISSUES_LOG.md`
   - Use sequential PRE-### IDs (PRE-001, PRE-002, etc.)
   - Required fields: ID, Category, First Seen, Command, Impact, Status

2. **Determine Issue Type**
   - **Pre-existing (unrelated)**: Existed before, not caused by your changes, not related to current objective → Log only, defer
   - **Pre-existing (related)**: Existed before but related to current work → Fix if directly connected
   - **New/Introduced**: Caused by current work → MUST fix immediately (blocker)

3. **Fixing Strategy**
   - New/Introduced issues: Fix immediately
   - Pre-existing but related: Fix if connected to current work
   - Pre-existing and unrelated: Log only, defer to appropriate owner
   - **Never silently suppress** — All issues must be logged or fixed

4. **When Fixing Issues**
   - Update log entry: Set Status to "✅ RESOLVED", add Resolved Date, document Resolution with verification
   - Add to Resolution History section
   - Update statistics table if present

### Log Entry Format

```markdown
### PRE-###: [Category] Short Description

| Field | Value |
|-------|-------|
| **ID** | PRE-### |
| **Category** | lint-error, test-error, build-error, type-error, security, infra, etc. |
| **First Seen** | YYYY-MM-DD |
| **Command** | Command used to detect (with timeout) |
| **Impact** | Low / Medium / High |
| **Suggested Owner** | Team/milestone bucket |
| **Status** | OPEN / RESOLVED |
| **Resolution** | Notes if/when resolved (with verification) |

**Summary**: Brief description
**Error/Excerpt**: ≤15 lines of representative output
[Affected files, root cause, etc.]
```

### Debugging Requirements

- **Hypothesis-driven**: Generate 3-4 probable causes before fixing
- **Test individually**: Modify one variable at a time, verify each hypothesis
- **Use git reset**: If fix doesn't work, immediately revert with `git reset --hard HEAD`
- **Set timeouts**: All complex commands (E2E tests: 25min max, builds: 10min max)

---

## Required Completion Report Format

Every task must end with a structured completion report:

### 1. Gates Table

| Gate | Command | Result | Duration |
|------|---------|--------|----------|
| API Lint | `pnpm -C services/api lint` | ✅ PASS | 45s |
| API Build | `pnpm -C services/api build` | ✅ PASS | 1m 23s |
| Web Lint | `pnpm -C apps/web lint` | ✅ PASS | 38s |
| Web Build | `pnpm -C apps/web build` | ✅ PASS | 2m 10s |

### 2. Evidence

- Include command output snippets proving pass/fail
- Include error messages if anything failed
- Include workarounds applied

### 3. Files Changed

- Exact list of files created/modified/deleted
- Brief description of each change

### 4. Issues Logged

- **Issues Encountered**: List all PRE-### IDs discovered
- **Issues Logged**: Confirm all issues added to `PRE_EXISTING_ISSUES_LOG.md`
- **Issues Resolved**: List any PRE-### issues fixed during this task
- **Deferred Issues**: List pre-existing issues logged but not fixed (with reasoning)
- Or state "None" if no new issues encountered

### 5. Next Steps

- What should the next session do?
- Update `docs/SESSION_STATE.yml` with the next objective

---

## Anti-Looping Rules

1. **One objective at a time** — `SESSION_STATE.yml` has exactly ONE objective
2. **Gates before claims** — Never say "done" without gate evidence
3. **Log all issues** — Every issue (pre-existing or new) must be logged in PRE_EXISTING_ISSUES_LOG.md
4. **Fix or defer** — New issues: fix immediately. Pre-existing unrelated: log and defer
5. **Update on resolution** — When fixing issues, update log with resolution details and verification
6. **Read before write** — Always read the 4 core files before any edits
7. **Evidence over assertions** — Show command output, not just "it works"

---

## Cursor Context Sets (Recommended)

### Always-On Context (pin these)
- `AI_START_HERE.md`
- `docs/SESSION_STATE.yml`
- `docs/AGENTS.md`

### Backend Verification Context
- `instructions/00_START_HERE.md`
- `instructions/CODEBASE_ARCHITECTURE_MAP.md`
- `services/api/package.json`

### Cleanup Context
- `docs/cleanup/CANDIDATES.md`
- `docs/cleanup/QUARANTINE_RULES.md`
- `instructions/PRE_EXISTING_ISSUES_LOG.md`
