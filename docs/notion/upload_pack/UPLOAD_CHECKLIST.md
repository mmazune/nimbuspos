# Nimbus POS Atlas → Notion Upload Checklist

**Generated:** January 22, 2026  
**Total Files:** 9 (8 originals + 1 Notion-optimized)  
**Estimated Upload Time:** 15-20 minutes

---

## 📋 Pre-Upload Setup

### Step 0: Notion Workspace Preparation

- [ ] Create a new Notion page titled: **"Nimbus POS Repository Atlas"**
- [ ] Set page icon to 🗺️ or 📚
- [ ] Add a brief description at the top of the page
- [ ] Create two main sections:
  - **"📊 Data Catalogs"** (for CSV databases)
  - **"📖 Reference Documentation"** (for Markdown pages)

---

## 📊 Part 1: Import CSV Files as Notion Databases

### Database 1: Routes Catalog

**File:** `ROUTES_CATALOG.csv` (136 routes)

- [ ] In Notion, click **"Import"** from the sidebar or page menu
- [ ] Select **"CSV"**
- [ ] Upload: `docs/notion/upload_pack/ROUTES_CATALOG.csv`
- [ ] Notion will create a new database page
- [ ] Rename the database to: **"Routes Catalog"**
- [ ] Verify columns imported correctly:
  - `route` (text) - Primary identifier
  - `app` (select/multi-select) - web | desktop | mobile
  - `nav_group` (select) - Dashboard, POS, Inventory, Finance, etc.
  - `min_role_level` (select) - L1, L2, L3, L4, L5
  - `primary_roles` (text) - Comma-separated role list
  - `purpose` (text) - Route description
  - `source_file` (text) - File path with line numbers
- [ ] **Convert column types:**
  - `app` → Multi-select (split by " | ")
  - `nav_group` → Select
  - `min_role_level` → Select
- [ ] **Create filtered views:**
  - [ ] "By Role" (grouped by min_role_level)
  - [ ] "By App" (grouped by app)
  - [ ] "By Nav Group" (grouped by nav_group)
  - [ ] "OWNER Routes" (filtered: min_role_level = L5)
  - [ ] "CASHIER Routes" (filtered: min_role_level ≤ L1)
- [ ] Move database into **"📊 Data Catalogs"** section

---

### Database 2: API Catalog

**File:** `API_CATALOG_NOTION.csv` (180+ endpoints) ← **Use this one for better Notion UX**

**Alternative:** Use `API_CATALOG.csv` if you prefer separate method/path columns

- [ ] In Notion, click **"Import"** → **"CSV"**
- [ ] Upload: `docs/notion/upload_pack/API_CATALOG_NOTION.csv`
- [ ] Rename the database to: **"API Catalog"**
- [ ] Verify columns imported correctly:
  - `endpoint` (text) - **Primary identifier** (e.g., "POST /auth/login")
  - `method` (select) - GET, POST, PATCH, DELETE
  - `path` (text) - API path
  - `service` (select) - api, worker, sync
  - `controller` (text) - Controller filename
  - `min_role_level` (select) - PUBLIC, AUTHENTICATED, L1-L5
  - `used_by_routes` (text) - Frontend routes using this API
  - `source_file` (text) - File path with line numbers
- [ ] **Convert column types:**
  - `method` → Select
  - `service` → Select
  - `min_role_level` → Select
- [ ] **Create filtered views:**
  - [ ] "By Service" (grouped by service)
  - [ ] "By Method" (grouped by method)
  - [ ] "By Domain" (use formula to extract domain from path)
  - [ ] "Public APIs" (filtered: min_role_level = PUBLIC)
  - [ ] "Auth Endpoints" (filtered: path contains "/auth")
  - [ ] "Inventory APIs" (filtered: path contains "/inventory")
  - [ ] "Workforce APIs" (filtered: path contains "/workforce")
- [ ] Move database into **"📊 Data Catalogs"** section

---

### Database 3: Models Catalog

**File:** `MODELS_CATALOG.csv` (100+ models)

- [ ] In Notion, click **"Import"** → **"CSV"**
- [ ] Upload: `docs/notion/upload_pack/MODELS_CATALOG.csv`
- [ ] Rename the database to: **"Models Catalog"**
- [ ] Verify columns imported correctly:
  - `model` (text) - Primary identifier (e.g., "Order", "User")
  - `domain` (select) - Multi-Tenancy, Auth, POS, Inventory, Workforce, etc.
  - `key_fields` (text) - Important fields (pipe-separated)
  - `key_relations` (text) - Related models (pipe-separated)
  - `source_file` (text) - schema.prisma line range
- [ ] **Convert column types:**
  - `domain` → Select
- [ ] **Create filtered views:**
  - [ ] "By Domain" (grouped by domain)
  - [ ] "POS Models" (filtered: domain = POS)
  - [ ] "Inventory Models" (filtered: domain = Inventory)
  - [ ] "Workforce Models" (filtered: domain = Workforce)
  - [ ] "Accounting Models" (filtered: domain = Accounting)
- [ ] Move database into **"📊 Data Catalogs"** section

---

### Database 4: Features Catalog

**File:** `FEATURES_CATALOG.csv` (70+ features)

- [ ] In Notion, click **"Import"** → **"CSV"**
- [ ] Upload: `docs/notion/upload_pack/FEATURES_CATALOG.csv`
- [ ] Rename the database to: **"Features Catalog"**
- [ ] Verify columns imported correctly:
  - `feature` (text) - Primary identifier
  - `type` (select) - Core, Infrastructure, Integration, etc.
  - `status` (select) - COMPLETE, PENDING, IN_PROGRESS
  - `platforms` (text) - web | desktop | mobile
  - `roles` (text) - Applicable roles (pipe-separated)
  - `routes` (text) - Associated routes
  - `apis` (text) - Associated API endpoints
  - `source_file` (text) - Documentation reference
- [ ] **Convert column types:**
  - `type` → Select
  - `status` → Select (color code: COMPLETE=green, PENDING=yellow)
  - `platforms` → Multi-select (split by " | ")
- [ ] **Create filtered views:**
  - [ ] "By Status" (grouped by status)
  - [ ] "By Type" (grouped by type)
  - [ ] "Complete Features" (filtered: status = COMPLETE)
  - [ ] "Core Features" (filtered: type = Core)
  - [ ] "Mobile Features" (filtered: platforms contains "mobile")
- [ ] Move database into **"📊 Data Catalogs"** section

---

### Database 5: Tests & Gates Catalog

**File:** `TESTS_AND_GATES.csv` (60+ test gates)

- [ ] In Notion, click **"Import"** → **"CSV"**
- [ ] Upload: `docs/notion/upload_pack/TESTS_AND_GATES.csv`
- [ ] Rename the database to: **"Tests & Gates"**
- [ ] Verify columns imported correctly:
  - `gate_test` (text) - Primary identifier
  - `type` (select) - Unit, E2E, Performance, Gate, Static, etc.
  - `command` (text) - Command to run test
  - `status` (select) - PASSING, FAILING, PENDING
  - `coverage_area` (text) - What is tested
  - `source_file` (text) - package.json or workflow file reference
- [ ] **Convert column types:**
  - `type` → Select
  - `status` → Select (color code: PASSING=green, FAILING=red, PENDING=yellow)
- [ ] **Create filtered views:**
  - [ ] "By Type" (grouped by type)
  - [ ] "By Status" (grouped by status)
  - [ ] "Gate Tests Only" (filtered: type = Gate)
  - [ ] "E2E Tests" (filtered: type = E2E)
  - [ ] "Failing Tests" (filtered: status = FAILING)
  - [ ] "CI Pipeline" (filtered: type = CI or type = Gate)
- [ ] Move database into **"📊 Data Catalogs"** section

---

### Database 6: Incidents & Anomalies Catalog

**File:** `INCIDENTS_ANOMALIES.csv` (65+ anomaly patterns)

- [ ] In Notion, click **"Import"** → **"CSV"**
- [ ] Upload: `docs/notion/upload_pack/INCIDENTS_ANOMALIES.csv`
- [ ] Rename the database to: **"Incidents & Anomalies"**
- [ ] Verify columns imported correctly:
  - `anomaly_name` (text) - Primary identifier
  - `category` (select) - Health, Auth, Performance, Database, etc.
  - `severity` (select) - CRITICAL, HIGH, MEDIUM, LOW
  - `trigger` (text) - What causes this anomaly
  - `endpoints` (text) - Affected API endpoints
  - `dashboard_surface` (text) - Where to observe/alert
  - `source_file` (text) - Code reference
- [ ] **Convert column types:**
  - `category` → Select
  - `severity` → Select (color code: CRITICAL=red, HIGH=orange, MEDIUM=yellow, LOW=gray)
- [ ] **Create filtered views:**
  - [ ] "By Severity" (grouped by severity)
  - [ ] "By Category" (grouped by category)
  - [ ] "Critical Alerts" (filtered: severity = CRITICAL)
  - [ ] "Performance Issues" (filtered: category = Performance)
  - [ ] "Auth Issues" (filtered: category = Auth or category = Security)
  - [ ] "Database Issues" (filtered: category = Database)
- [ ] Move database into **"📊 Data Catalogs"** section

---

## 📖 Part 2: Import Markdown Documentation

### Document 1: REPO_ATLAS.md

**File:** `REPO_ATLAS.md` (~500 lines)

- [ ] In the **"📖 Reference Documentation"** section, create a new page
- [ ] Title the page: **"REPO_ATLAS (Imported)"**
- [ ] Set page icon to 🏛️ or 🗺️
- [ ] Click in the page body
- [ ] Open: `docs/notion/upload_pack/REPO_ATLAS.md` in a text editor
- [ ] **Copy all content** (Ctrl+A, Ctrl+C)
- [ ] **Paste into Notion** (Ctrl+V)
- [ ] Notion will automatically convert Markdown formatting
- [ ] **Verify formatting:**
  - [ ] Headings converted correctly (# → H1, ## → H2, etc.)
  - [ ] Code blocks preserved with syntax highlighting
  - [ ] Bullet lists rendered correctly
  - [ ] Links converted to Notion links
  - [ ] Tables imported correctly
- [ ] **Post-import cleanup:**
  - [ ] Add a callout at the top: "📌 Generated on 2026-01-22 from repository source code"
  - [ ] Add table of contents toggle block if needed
- [ ] Move page into **"📖 Reference Documentation"** section

---

### Document 2: ROLE_UI_NAV_MATRIX.md

**File:** `ROLE_UI_NAV_MATRIX.md` (~600 lines)

- [ ] In the **"📖 Reference Documentation"** section, create a new page
- [ ] Title the page: **"ROLE_UI_NAV_MATRIX (Imported)"**
- [ ] Set page icon to 👥 or 🔐
- [ ] Click in the page body
- [ ] Open: `docs/notion/upload_pack/ROLE_UI_NAV_MATRIX.md` in a text editor
- [ ] **Copy all content** (Ctrl+A, Ctrl+C)
- [ ] **Paste into Notion** (Ctrl+V)
- [ ] Notion will automatically convert Markdown formatting
- [ ] **Verify formatting:**
  - [ ] 11 role sections rendered correctly
  - [ ] Nested bullet lists for navigation items
  - [ ] Large route access matrix table imported
  - [ ] data-testid table imported
- [ ] **Post-import cleanup:**
  - [ ] Add a callout at the top: "📌 Role-based navigation matrix for 11 job roles"
  - [ ] Consider splitting into 11 separate pages (one per role) if too long
  - [ ] Add synced block references to route access matrix for reuse
- [ ] Move page into **"📖 Reference Documentation"** section

---

## 🔗 Part 3: Set Up Database Relations (Optional but Recommended)

These relations enable powerful cross-database queries:

### Relation 1: Routes → API Catalog

- [ ] Open **Routes Catalog** database
- [ ] Add new column: **"APIs Used"** (Relation type)
- [ ] Link to: **API Catalog** database
- [ ] Relation property: Bi-directional (show in both databases)
- [ ] Manually link routes to their APIs based on `used_by_routes` column
  - _Note: This requires manual work or a script. Notion doesn't auto-link from CSV text._

### Relation 2: Features → Routes & APIs

- [ ] Open **Features Catalog** database
- [ ] Add new column: **"Related Routes"** (Relation type) → **Routes Catalog**
- [ ] Add new column: **"Related APIs"** (Relation type) → **API Catalog**
- [ ] Manually link features to their routes/APIs based on `routes` and `apis` columns

### Relation 3: Tests & Gates → Features

- [ ] Open **Tests & Gates** database
- [ ] Add new column: **"Tests Feature"** (Relation type) → **Features Catalog**
- [ ] Link tests to features they cover (e.g., "E2E Inventory Module" → "Inventory - Items & Stock Levels")

### Relation 4: Incidents & Anomalies → API Catalog

- [ ] Open **Incidents & Anomalies** database
- [ ] Add new column: **"Affected APIs"** (Relation type) → **API Catalog**
- [ ] Link anomalies to affected endpoints based on `endpoints` column

---

## 📊 Part 4: Create Dashboard Views (Optional)

### Master Dashboard Page

- [ ] Create a new page: **"Atlas Dashboard"**
- [ ] Add the following database views (linked databases, not inline):

#### Section 1: Quick Stats (using Notion formulas/rollups)
- [ ] **Total Routes:** Count from Routes Catalog
- [ ] **Total APIs:** Count from API Catalog  
- [ ] **Total Models:** Count from Models Catalog
- [ ] **Total Features:** Count from Features Catalog (filtered: status=COMPLETE)
- [ ] **Passing Tests:** Count from Tests & Gates (filtered: status=PASSING)
- [ ] **Critical Anomalies:** Count from Incidents & Anomalies (filtered: severity=CRITICAL)

#### Section 2: Key Database Views
- [ ] Add linked database: **Routes Catalog** (view: "By Role")
- [ ] Add linked database: **API Catalog** (view: "By Service")
- [ ] Add linked database: **Features Catalog** (view: "By Status")
- [ ] Add linked database: **Tests & Gates** (view: "Gate Tests Only")
- [ ] Add linked database: **Incidents & Anomalies** (view: "Critical Alerts")

#### Section 3: Quick Links
- [ ] Link to: **REPO_ATLAS (Imported)** page
- [ ] Link to: **ROLE_UI_NAV_MATRIX (Imported)** page
- [ ] Link to: Original files in `docs/repo_atlas/` (GitHub link)

---

## ✅ Final Verification Checklist

### Data Integrity
- [ ] All 6 CSV databases imported with correct row counts:
  - Routes Catalog: ~136 rows
  - API Catalog: ~180-220 rows (depends on which file used)
  - Models Catalog: ~100 rows
  - Features Catalog: ~70 rows
  - Tests & Gates: ~60 rows
  - Incidents & Anomalies: ~65 rows
- [ ] All 2 Markdown pages imported with proper formatting
- [ ] No broken links or missing sections
- [ ] All code blocks have syntax highlighting
- [ ] All tables rendered correctly

### Column Type Conversion
- [ ] Select/Multi-select columns converted (not plain text)
- [ ] Color coding applied to status columns (green=success, red=critical, etc.)
- [ ] Rollup/Formula columns working (if added)

### Views & Filters
- [ ] At least 3-5 filtered views per database
- [ ] Grouped views make sense (by domain, by role, by status, etc.)
- [ ] Default view set to most useful one

### Database Relations
- [ ] (Optional) Relations set up between databases
- [ ] (Optional) Bi-directional relations visible in both databases

### Access & Sharing
- [ ] Page permissions set correctly for your team
- [ ] Databases shared with appropriate workspace members
- [ ] README or description added to main atlas page

---

## 🎉 Upload Complete!

You now have a fully imported Nimbus POS Repository Atlas in Notion with:

- **6 linked databases** (Routes, APIs, Models, Features, Tests, Incidents)
- **2 reference documents** (REPO_ATLAS, ROLE_UI_NAV_MATRIX)
- **Filterable/sortable views** for every database
- **Evidence-based claims** (file paths + line numbers in source_file columns)

### Next Steps

1. **Share with your team:** Invite developers, PMs, QA engineers
2. **Set up automation:** Use Notion API to auto-update from CI/CD
3. **Create custom views:** Build role-specific dashboards (OWNER view, CASHIER view, etc.)
4. **Link to external tools:** Connect to GitHub, Jira, Sentry, etc.
5. **Keep updated:** Re-run atlas generation monthly or on major releases

---

## 📞 Need Help?

If you encounter issues during upload:

1. **CSV Import Errors:** Ensure file encoding is UTF-8, check for special characters
2. **Markdown Formatting Issues:** Try pasting in smaller sections, manually fix tables
3. **Missing Columns:** Re-export CSV from source with correct headers
4. **Notion Limits:** Free plan has limits on file uploads and integrations

---

**Original Files Location:**  
`c:\Users\arman\Desktop\nimbusPOS\nimbuspos\docs\notion\upload_pack\`

**Source Files Location:**  
`c:\Users\arman\Desktop\nimbusPOS\nimbuspos\docs\repo_atlas\`

**Generated:** January 22, 2026  
**Version:** 1.0  
**Product:** Nimbus POS (ChefCloud internal codename)
