# Nimbus POS Notion Sync Master

**Created:** January 25, 2026  
**Purpose:** Single source-of-truth for syncing Repository Atlas to Notion workspace  
**Owner:** Engineering Team

---

## 📁 Canonical File Locations

| Category | Local Path | Description |
|----------|------------|-------------|
| **Atlas Source** | `docs/repo_atlas/` | Master catalog CSVs + reference Markdown |
| **Notion Upload Pack** | `docs/notion/upload_pack/` | Notion-optimized files ready for import |
| **Delta Snapshots** | `docs/notion/.snapshots/` | Hash snapshots for change detection |
| **This File** | `docs/notion/NOTION_SYNC_MASTER_NIMBUS.md` | Sync procedure + delta log |

### Atlas Files Tracked

| File | Purpose | Row Count (approx) |
|------|---------|-------------------|
| `ROUTES_CATALOG.csv` | Frontend routes (web/desktop/mobile) | ~136 |
| `API_CATALOG.csv` | Backend API endpoints | ~220 |
| `MODELS_CATALOG.csv` | Database models/entities | ~100 |
| `FEATURES_CATALOG.csv` | Feature inventory + status | ~77 |
| `TESTS_AND_GATES.csv` | Test gates + coverage | ~60 |
| `INCIDENTS_ANOMALIES.csv` | Observability anomaly patterns | ~63 |
| `REPO_ATLAS.md` | Architecture overview | N/A |
| `ROLE_UI_NAV_MATRIX.md` | Role-based navigation matrix | N/A |

---

## 🏢 Notion Workspace Structure

### Recommended Page Hierarchy

```
📚 Nimbus POS Repository Atlas (Top-Level Page)
│
├── 📊 Atlas Dashboard
│   ├── Routes Catalog (Database)
│   ├── API Catalog (Database)
│   ├── Models Catalog (Database)
│   ├── Features Catalog (Database)
│   ├── Tests & Gates (Database)
│   └── Incidents & Anomalies (Database)
│
├── 📖 Reference Library
│   ├── Repository Atlas (Architecture)
│   ├── Role UI Navigation Matrix
│   └── Upload Checklist
│
├── 🗺️ Roadmap & Milestones
│   ├── Current Sprint
│   ├── Milestone Tracker
│   └── Feature Backlog
│
├── 🎬 Pitch & Demo
│   ├── Demo Credentials Matrix
│   └── Demo Scripts
│
└── 🔄 Sync Log
    └── (Link to Delta Log section below)
```

### Database Views to Create

| Database | Recommended Views |
|----------|-------------------|
| **Routes Catalog** | By Role Level, By App, By Nav Group, OWNER Routes, PUBLIC Routes |
| **API Catalog** | By Service, By Method, By Domain, Public Endpoints, Protected Endpoints |
| **Models Catalog** | By Domain, Core Models, Junction Tables |
| **Features Catalog** | By Status, By Type, By Platform, Complete Features, In-Progress |
| **Tests & Gates** | By Type (Unit/E2E/Perf), By Status, Failed Tests |
| **Incidents & Anomalies** | By Severity, By Category, CRITICAL Only |

---

## 📥 Import Rules

### CSV Files → Notion Databases

1. **Import Method:** Notion Sidebar → Import → CSV
2. **Merge Strategy:** 
   - **First Import:** Create new database
   - **Updates:** Delete existing database, re-import fresh CSV
   - **Alternative:** Use Notion API with [notion-csv-import](https://github.com/notion-csv) for delta updates
3. **Column Type Conversion:**
   - Pipe-separated values (e.g., `web | desktop`) → Multi-select
   - Role levels (L1-L5, PUBLIC, AUTHENTICATED) → Select
   - Methods (GET, POST, PATCH, DELETE) → Select
   - Status values → Select with color coding

### Markdown Files → Notion Pages

1. **Import Method:** Copy raw markdown, paste into Notion page
2. **Toggle "Paste as Markdown"** in paste options
3. **Manual Cleanup:**
   - Adjust table widths
   - Fix code block languages
   - Add page icons/covers

### Notion-Optimized Files

Use files from `docs/notion/upload_pack/` when available:
- `API_CATALOG_NOTION.csv` - Has combined `endpoint` column (e.g., "POST /auth/login")
- Files are pre-validated for Notion compatibility

---

## 🔄 Update Procedure

### Prerequisites

- Node.js 20+ installed
- Access to Notion workspace with edit permissions
- Latest codebase pulled from main branch

### Step-by-Step Update

#### Phase 1: Generate Delta Report

```bash
# From repository root
pnpm notion:delta
```

This will:
1. Compare current `docs/repo_atlas/*.csv` against stored snapshots
2. Generate a delta summary with counts of new/removed/changed items
3. Append summary to the Delta Log section below
4. Update snapshot hashes for next comparison

#### Phase 2: Review Delta Report

1. Open this file and scroll to **Delta Log** section
2. Review the latest delta entry
3. Note which databases need updating in Notion

#### Phase 3: Upload to Notion

For each changed catalog:

1. **Open Notion database**
2. **Delete all existing rows** (or delete entire database)
3. **Re-import CSV:**
   - Click `•••` menu → Import → CSV
   - Select file from `docs/notion/upload_pack/`
4. **Restore views** (if deleted database)
5. **Verify row counts** match delta report

#### Phase 4: Update Markdown Pages

If REPO_ATLAS.md or ROLE_UI_NAV_MATRIX.md changed:

1. Open corresponding Notion page
2. Select all content (Ctrl+A)
3. Delete existing content
4. Copy markdown from `docs/notion/upload_pack/`
5. Paste → Select "Paste as Markdown"

#### Phase 5: Confirm Sync

1. Add a comment to the Notion Atlas Dashboard page with sync date
2. Commit any local changes (snapshot hashes, this file)

---

## 📊 Delta Log

<!-- DELTA_LOG_START - DO NOT REMOVE THIS LINE -->

### 2026-01-25T08:06:50.898Z

| Catalog | Rows | Changed | New | Removed |
|---------|------|---------|-----|---------|
| ROUTES_CATALOG.csv | 135 | ✅ | +1 | -0 |
| API_CATALOG.csv | 220 | ✅ | +1 | -0 |
| MODELS_CATALOG.csv | 109 | — | +0 | -0 |
| FEATURES_CATALOG.csv | 75 | — | +0 | -0 |
| TESTS_AND_GATES.csv | 61 | — | +0 | -0 |
| INCIDENTS_ANOMALIES.csv | 62 | ✅ | +1 | -0 |

#### 📋 Notion Update Checklist

**CSVs to Re-Import:**
- [ ] ROUTES_CATALOG.csv → **Routes** database
- [ ] API_CATALOG.csv → **Api** database
- [ ] INCIDENTS_ANOMALIES.csv → **Incidents Anomalies** database

**Notion Databases to Update:**
- [ ] Routes Catalog: Delete rows → Import → Verify count
- [ ] API Catalog: Delete rows → Import → Verify count
- [ ] Incidents & Anomalies: Delete rows → Import → Verify count

**Views to Verify:**
- [ ] Routes Catalog → "Unmapped Routes" view (1 items)
- [ ] API Catalog → "Special-token APIs" view (32 items)
- [ ] API Catalog → "Missing Links" filter (check used_by_routes column)
- [ ] Incidents & Anomalies → "CRITICAL Only" view (15 items)

#### ⚠️ Risk Notes

- **API Count Changed:** +1 new endpoints, -0 removed
- **Special-token APIs Increased:** +1 (now 32 total) — Review PUBLIC/AUTHENTICATED endpoints
- **Unmapped Routes Increased:** +1 (now 1 total) — Routes need purpose documentation
- **CRITICAL Incidents Changed:** +1 (now 15 total) — Review incident response procedures

**New Routes:**
- `/test/demo-route`

**⚠️ Unmapped Routes:** 1

**New API Endpoints:**
- `GET /test/demo-endpoint`

**Feature Status Distribution:**
- COMPLETE: 75

**New Incidents by Severity:**
- 🔴 CRITICAL: 1

<details>
<summary>Hash References</summary>

| File | Hash |
|------|------|
| ROUTES_CATALOG.csv | `20ef4f5b` |
| API_CATALOG.csv | `63b11ba5` |
| MODELS_CATALOG.csv | `51e55db5` |
| FEATURES_CATALOG.csv | `8bd76256` |
| TESTS_AND_GATES.csv | `974ac573` |
| INCIDENTS_ANOMALIES.csv | `e2712ba0` |

</details>

---


### 2026-01-25T08:06:05.701Z

| Catalog | Rows | Changed | New | Removed |
|---------|------|---------|-----|---------|
| ROUTES_CATALOG.csv | 134 | — | +0 | -0 |
| API_CATALOG.csv | 219 | — | +0 | -0 |
| MODELS_CATALOG.csv | 109 | — | +0 | -0 |
| FEATURES_CATALOG.csv | 75 | — | +0 | -0 |
| TESTS_AND_GATES.csv | 61 | — | +0 | -0 |
| INCIDENTS_ANOMALIES.csv | 61 | — | +0 | -0 |

#### 📋 Notion Update Checklist

✅ No changes detected. Notion is up to date.

**Feature Status Distribution:**
- COMPLETE: 75

<details>
<summary>Hash References</summary>

| File | Hash |
|------|------|
| ROUTES_CATALOG.csv | `6091dc7e` |
| API_CATALOG.csv | `05e96f6d` |
| MODELS_CATALOG.csv | `51e55db5` |
| FEATURES_CATALOG.csv | `8bd76256` |
| TESTS_AND_GATES.csv | `974ac573` |
| INCIDENTS_ANOMALIES.csv | `5afc194e` |

</details>

---


### 2026-01-25T07:51:11.338Z

| Catalog | Rows | Changed | New | Removed |
|---------|------|---------|-----|---------|
| ROUTES_CATALOG.csv | 134 | ✅ | +134 | -0 |
| API_CATALOG.csv | 219 | ✅ | +219 | -0 |
| MODELS_CATALOG.csv | 109 | ✅ | +109 | -0 |
| FEATURES_CATALOG.csv | 75 | ✅ | +75 | -0 |
| TESTS_AND_GATES.csv | 61 | ✅ | +61 | -0 |
| INCIDENTS_ANOMALIES.csv | 61 | ✅ | +61 | -0 |

**New Routes:**
- `/`
- `/dashboard`
- `/analytics`
- `/analytics/franchise/[branchId]`
- `/reports`
- `/reports/subscriptions`
- `/billing`
- `/settings`
- `/security`
- `/login`
- ... and 124 more

**New API Endpoints:**
- `POST /auth/login`
- `POST /auth/pin-login`
- `POST /auth/msr-swipe`
- `POST /auth/enroll-badge`
- `POST /auth/logout`
- `GET /auth/sessions`
- `POST /auth/msr/assign`
- `GET /me`
- `POST /webauthn/registration/options`
- `POST /webauthn/registration/verify`
- ... and 209 more

**Feature Status Distribution:**
- COMPLETE: 75

**New Incidents by Severity:**
- 🔴 CRITICAL: 14
- 🟠 HIGH: 20
- 🟡 MEDIUM: 20
- ⚪ LOW: 7

<details>
<summary>Hash References</summary>

| File | Hash |
|------|------|
| ROUTES_CATALOG.csv | `6091dc7e` |
| API_CATALOG.csv | `05e96f6d` |
| MODELS_CATALOG.csv | `51e55db5` |
| FEATURES_CATALOG.csv | `8bd76256` |
| TESTS_AND_GATES.csv | `974ac573` |
| INCIDENTS_ANOMALIES.csv | `5afc194e` |

</details>

---


### 2026-01-25T00:00:00.000Z — Initial Baseline

**Baseline snapshot created.** First delta will compare against this.

| Catalog | Rows | Hash |
|---------|------|------|
| ROUTES_CATALOG.csv | TBD | TBD |
| API_CATALOG.csv | TBD | TBD |
| MODELS_CATALOG.csv | TBD | TBD |
| FEATURES_CATALOG.csv | TBD | TBD |
| TESTS_AND_GATES.csv | TBD | TBD |
| INCIDENTS_ANOMALIES.csv | TBD | TBD |

---

<!-- DELTA_LOG_END - DO NOT REMOVE THIS LINE -->

---

## 🔗 Quick Links

- **Upload Checklist:** [docs/notion/upload_pack/UPLOAD_CHECKLIST.md](../notion/upload_pack/UPLOAD_CHECKLIST.md)
- **Atlas Index:** [docs/repo_atlas/INDEX.md](../repo_atlas/INDEX.md)
- **Run Delta Script:** `pnpm notion:delta`

---

## 📝 Maintenance Notes

- **Frequency:** Run delta after each milestone completion or major atlas regeneration
- **Responsibility:** Lead engineer or designated atlas maintainer
- **Automation:** Consider GitHub Action to auto-generate delta on `docs/repo_atlas/` changes
