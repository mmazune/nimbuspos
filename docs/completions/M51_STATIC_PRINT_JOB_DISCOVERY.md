# M51 Static Print/Job Discovery

**Timestamp:** 2026-01-22T13:23:30Z  
**Method:** Static code analysis (grep patterns)

---

## Summary

| Pattern | Files Found | Notable Locations |
|---------|-------------|-------------------|
| `window.print()` | 1 | POS receipt detail page |
| Print buttons | 1 | POS receipt detail page |
| PDF keywords | 5 | Payslips, bookings (check-in tickets) |
| Async job patterns (202/poll/status) | 0 | None found in frontend |

---

## A) UI-Only Print Patterns

### 1. Receipt Detail Page — `window.print()`

**File:** `apps/web/src/pages/pos/receipts/[id].tsx`  
**Lines:** 62-64, 118-120

```tsx
const handlePrint = () => {
  window.print();
};

<Button size="sm" onClick={handlePrint}>
  <Printer className="mr-2 h-4 w-4" />
  Print
</Button>
```

**Classification:** UI_ONLY_PRINT  
**Route Pattern:** `/pos/receipts/[id]`  
**Control:** Button with "Print" text and Printer icon  
**Mechanism:** Direct `window.print()` call, no network activity  
**Print Styles:** Custom CSS `@media print` block (lines 207-220) for print-friendly formatting

**Key Details:**
- Fetches receipt data via `GET /pos/receipts/:id` on page load
- Print button triggers browser print dialog
- Print-friendly CSS hides navigation, formats receipt as 80mm thermal receipt
- No PDF generation, no download, pure client-side printing

---

## B) PDF Export/Download Patterns

### 1. Payslip PDF — Workforce Module

**File:** `apps/web/src/pages/workforce/payslips/[id].tsx`  
**Line:** 187

```tsx
Export PDF
```

**File:** `apps/web/src/pages/my-payslips.tsx`  
**Line:** 362

```tsx
Download PDF
```

**API Endpoint (found):**  
`services/api/src/bookings/checkin.controller.ts:66`
```typescript
res.setHeader('Content-Type', 'application/pdf');
```

**Classification:** HAS_DOWNLOAD (likely)  
**Notes:** 
- Payslip PDF export exists but specific endpoint pattern not directly observable in static search
- Bookings module has PDF ticket download at check-in endpoint
- Both set `Content-Type: application/pdf` indicating file download

### 2. Report Subscriptions — PDF Delivery

**File:** `apps/web/src/pages/reports/subscriptions.tsx`  
**Lines:** 28, 374-375

```tsx
interface ReportSubscription {
  includePDF: boolean;
  // ...
}

{sub.includePDF && (
  <Badge className="bg-gray-100 text-gray-700">PDF</Badge>
)}
```

**Classification:** Email/scheduled delivery (not direct download)  
**Notes:**
- Report subscriptions can include PDF attachments
- PDF generation happens server-side for email delivery
- Not a direct user-initiated print/download control

---

## C) Async Job/Report Generation Patterns

### Search Results: NONE FOUND

**Patterns Searched:**
- `202` (HTTP status for job acceptance)
- `job.*status` / `poll.*status`
- `queue.*report`
- `background.*job`

**Conclusion:**  
No evidence of async report generation patterns in the current codebase. All export operations appear to be synchronous:
- CSV exports return immediately with `Content-Disposition: attachment`
- PDF generation (if any) happens synchronously
- No job queues, polling mechanisms, or "report is being generated" UI patterns detected

---

## D) Receipt Detail Pages — Sampling Strategy

### Receipt List Endpoint

**API:** `GET /pos/export/receipts.csv` (confirmed in M50)  
**Data:** 51 receipts available (per M50 data realism check)

### Receipt Detail Endpoint

**API:** `GET /pos/receipts/:id` (confirmed)  
**Controller:** `services/api/src/pos/controllers/pos-payments.controller.ts:211`

### Sampling Plan for M51

**Target:** 5 receipt IDs per org (tapas, cafesserie)  
**Method:**
1. Export receipts CSV via API
2. Parse CSV to extract first 5 receipt IDs per org
3. Visit `/pos/receipts/[id]` for each ID
4. Verify page loads (200) and content is non-empty
5. Test "Print" button (window.print detection)

---

## E) Print Control Catalog (Static)

| Route | Control | TestId/Selector | Method | Classification |
|-------|---------|-----------------|--------|----------------|
| `/pos/receipts/[id]` | Print button | `<Printer>` icon + "Print" text | `window.print()` | UI_ONLY_PRINT |
| `/workforce/payslips/[id]` | Export PDF | "Export PDF" text | Unknown endpoint | HAS_DOWNLOAD (suspected) |
| `/my-payslips` | Download PDF | "Download PDF" text | Unknown endpoint | HAS_DOWNLOAD (suspected) |

**Notes:**
- Only 1 confirmed `window.print()` usage found
- Receipt detail page is the primary UI_ONLY_PRINT candidate
- PDF exports exist but are not direct print controls (separate download mechanism)

---

## F) Recommendations for Playwright Audit

### Required Detections

1. **Window.print() Hook**
   - Inject `window.__print_calls = 0` counter before navigation
   - Replace `window.print = () => { window.__print_calls++; }`
   - After control click, check if counter incremented → UI_ONLY_PRINT

2. **Receipt Detail Sampling**
   - Use M50's receipt export to get real receipt IDs
   - Visit at least 5 receipts per org
   - Test Print button on each
   - Verify no network downloads triggered

3. **PDF Download Detection**
   - Monitor responses for `Content-Type: application/pdf`
   - Monitor responses for `Content-Disposition: attachment; filename="*.pdf"`
   - Classify as HAS_DOWNLOAD if detected

4. **Async Job Detection** (optional, low priority)
   - Monitor for 202 responses
   - If found, attempt to follow polling pattern
   - Classify as ASYNC_JOB_DOWNLOAD if sequence completes

### Expected Outcome

Based on static analysis:
- **UI_ONLY_PRINT:** 1 control (receipt detail Print button)
- **HAS_DOWNLOAD:** 6-7 controls (from M50, plus any PDF exports)
- **ASYNC_JOB_DOWNLOAD:** 0 controls (no async patterns found)

---

**End of Static Discovery Report**
