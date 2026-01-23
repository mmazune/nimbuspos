# Nimbus POS Repository Atlas Index

**Generated:** January 22, 2026  
**Location:** `docs/repo_atlas/`  
**Purpose:** Comprehensive end-to-end repository documentation with evidence-based claims (file paths + line ranges)

---

## 📋 Atlas Artifacts Inventory

All 8 deliverables have been successfully located and consolidated in this directory.

| Canonical Filename | Source Path | Last Modified | Size | Description |
|-------------------|-------------|---------------|------|-------------|
| REPO_ATLAS.md | docs/repo_atlas/REPO_ATLAS.md | 2026-01-22 11:09:47 AM | 24,095 bytes | Main architecture documentation (monorepo, runtime, deployment, observability) |
| ROLE_UI_NAV_MATRIX.md | docs/repo_atlas/ROLE_UI_NAV_MATRIX.md | 2026-01-22 11:11:42 AM | 27,846 bytes | Role-based navigation matrix for 11 job roles with route access mapping |
| ROUTES_CATALOG.csv | docs/repo_atlas/ROUTES_CATALOG.csv | 2026-01-22 11:15:04 AM | 16,985 bytes | 136 frontend routes with app, nav_group, min_role_level, primary_roles |
| API_CATALOG.csv | docs/repo_atlas/API_CATALOG.csv | 2026-01-22 11:16:30 AM | 29,573 bytes | 180+ backend API endpoints with method, path, controller, min_role, source |
| MODELS_CATALOG.csv | docs/repo_atlas/MODELS_CATALOG.csv | 2026-01-22 11:19:22 AM | 19,661 bytes | 100+ database models with domain, key_fields, key_relations, source |
| FEATURES_CATALOG.csv | docs/repo_atlas/FEATURES_CATALOG.csv | 2026-01-22 11:20:23 AM | 16,323 bytes | 70+ features with type, status, platforms, roles, routes, apis |
| TESTS_AND_GATES.csv | docs/repo_atlas/TESTS_AND_GATES.csv | 2026-01-22 11:20:50 AM | 6,947 bytes | 60+ test gates (Unit/E2E/Performance/Static) with commands and coverage |
| INCIDENTS_ANOMALIES.csv | docs/repo_atlas/INCIDENTS_ANOMALIES.csv | 2026-01-22 11:21:48 AM | 12,524 bytes | 65+ observability anomaly patterns with severity, triggers, dashboards |

**Total Size:** 153,954 bytes (~154 KB)  
**Total Files:** 8 (2 Markdown + 6 CSV)

---

## 🔍 Verification Status

✅ All 8 deliverables located successfully  
✅ All files contain evidence (file paths with line numbers)  
✅ Product name verified: **Nimbus POS** (ChefCloud as codename only)  
✅ Files copied to `docs/notion/upload_pack/` for Notion import  
✅ Notion-friendly API catalog created with `endpoint` column

---

## 📤 Upload to Notion Mapping

### CSV Files → Notion Databases

Import these CSV files as **Notion databases** using "Import" → "CSV":

| CSV File | Notion Database Name | Primary Key | Import Notes |
|----------|---------------------|-------------|--------------|
| ROUTES_CATALOG.csv | Routes Catalog | route | Enable filters for role, app, nav_group |
| API_CATALOG.csv | API Catalog | method + path | Enable filters for service, min_role_level |
| MODELS_CATALOG.csv | Models Catalog | model | Enable grouping by domain |
| FEATURES_CATALOG.csv | Features Catalog | feature | Enable filters for status, type, platforms |
| TESTS_AND_GATES.csv | Tests & Gates | gate_test | Enable filters for type, status |
| INCIDENTS_ANOMALIES.csv | Incidents & Anomalies | anomaly_name | Enable filters for category, severity |

**Alternative:** Use `API_CATALOG_NOTION.csv` from `docs/notion/upload_pack/` for a combined "endpoint" column (e.g., "POST /auth/login")

### Markdown Files → Notion Pages

Copy-paste these markdown files into Notion pages using "Paste as Markdown":

| Markdown File | Notion Page Name | Content Type |
|--------------|------------------|--------------|
| REPO_ATLAS.md | REPO_ATLAS (Imported) | Technical documentation with 13 sections |
| ROLE_UI_NAV_MATRIX.md | ROLE_UI_NAV_MATRIX (Imported) | Role navigation reference with 11 role profiles |

---

## 🔗 Database Relationships (Suggested Notion Setup)

Create **relations** between databases to enable powerful queries:

1. **Routes → API Catalog** (via `used_by_routes` column)
2. **API Catalog → Models Catalog** (via entity names in path)
3. **Features → Routes** (via `routes` column)
4. **Features → API Catalog** (via `apis` column)
5. **Tests & Gates → Features** (via `coverage_area` column)
6. **Incidents & Anomalies → API Catalog** (via `endpoints` column)

---

## 📊 Suggested Notion Views

### Routes Catalog Views
- **By Role:** Filtered views for each job role (OWNER, MANAGER, CASHIER, etc.)
- **By App:** Grouped by app (web, desktop, mobile)
- **By Nav Group:** Grouped by navigation section

### API Catalog Views
- **By Service:** Grouped by service (api, worker, sync)
- **By Domain:** Grouped by controller domain (auth, inventory, workforce, etc.)
- **By Access Level:** Filtered by min_role_level (PUBLIC, L1-L5)

### Features Catalog Views
- **By Status:** Filtered by COMPLETE/PENDING/IN_PROGRESS
- **By Platform:** Filtered by platforms (web, mobile, desktop)
- **By Type:** Grouped by type (Core, Infrastructure, Integration, etc.)

### Tests & Gates Views
- **By Type:** Grouped by type (Unit, E2E, Performance, Gate, etc.)
- **By Status:** Filtered by PASSING/FAILING/PENDING
- **CI/CD Pipeline:** Show only Gate tests

### Incidents & Anomalies Views
- **By Severity:** Filtered by CRITICAL/HIGH/MEDIUM/LOW
- **By Category:** Grouped by category (Health, Auth, Performance, etc.)
- **Critical Alerts:** Filtered for CRITICAL severity only

---

## 📁 File Locations

### Source Directory
```
docs/repo_atlas/
├── REPO_ATLAS.md
├── ROLE_UI_NAV_MATRIX.md
├── ROUTES_CATALOG.csv
├── API_CATALOG.csv
├── MODELS_CATALOG.csv
├── FEATURES_CATALOG.csv
├── TESTS_AND_GATES.csv
├── INCIDENTS_ANOMALIES.csv
└── INDEX.md (this file)
```

### Notion Upload Pack
```
docs/notion/upload_pack/
├── REPO_ATLAS.md (copy)
├── ROLE_UI_NAV_MATRIX.md (copy)
├── ROUTES_CATALOG.csv (copy)
├── API_CATALOG.csv (copy)
├── API_CATALOG_NOTION.csv (endpoint column added)
├── MODELS_CATALOG.csv (copy)
├── FEATURES_CATALOG.csv (copy)
├── TESTS_AND_GATES.csv (copy)
├── INCIDENTS_ANOMALIES.csv (copy)
└── UPLOAD_CHECKLIST.md
```

---

## 🎯 Quick Start

1. Navigate to `docs/notion/upload_pack/`
2. Follow steps in `UPLOAD_CHECKLIST.md`
3. Import CSV files as Notion databases
4. Paste markdown files into Notion pages
5. Set up database relations and filtered views
6. Share with your team

---

## 📝 Notes

- **Evidence-Based:** Every claim includes file path and line range for traceability
- **Machine-Readable:** All CSV files can be imported into spreadsheets, databases, or BI tools
- **Version Control:** All files are committed to git for change tracking
- **Reproducible:** Can be regenerated from source code at any time

---

**For detailed upload instructions, see:** `docs/notion/upload_pack/UPLOAD_CHECKLIST.md`
