# Render Contract - cafesserie/owner

**Generated:** 2026-01-22T18:21:19.090Z  
**Duration:** 30.9s

## Summary

| Metric | Value |
|--------|-------|
| Total Routes | 15 |
| Passed | 9 |
| Failed | 6 |
| Pass Rate | 60.0% |

## Top Failure Signatures

| Signature | Count | Example Route |
|-----------|-------|---------------|
| Console error: Failed to load resource: the server responded with a status of 404 (Not Found) | 5 | /analytics |
| HTTP 500 in responses: GET http://localhost:3001/workforce/swaps?status=pending | 1 | /workforce/swaps |

## Route Details

### ✅ /dashboard

**Status:** PASS  

### ❌ /analytics

**Status:** FAIL  
**Navigation HTTP Status:** 200  
**Error Signature:** Console error: Failed to load resource: the server responded with a status of 404 (Not Found)  
**Console Errors:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Screenshot:** cafesserie_owner__-analytics.png  

### ✅ /reports

**Status:** PASS  

### ❌ /pos

**Status:** FAIL  
**Navigation HTTP Status:** 200  
**Error Signature:** Console error: Failed to load resource: the server responded with a status of 404 (Not Found)  
**Console Errors:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Screenshot:** cafesserie_owner__-pos.png  

### ✅ /reservations

**Status:** PASS  

### ❌ /inventory

**Status:** FAIL  
**Navigation HTTP Status:** 200  
**Error Signature:** Console error: Failed to load resource: the server responded with a status of 404 (Not Found)  
**Console Errors:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Screenshot:** cafesserie_owner__-inventory.png  

### ✅ /finance

**Status:** PASS  

### ❌ /service-providers

**Status:** FAIL  
**Navigation HTTP Status:** 200  
**Error Signature:** Console error: Failed to load resource: the server responded with a status of 404 (Not Found)  
**Console Errors:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Screenshot:** cafesserie_owner__-service-providers.png  

### ❌ /staff

**Status:** FAIL  
**Navigation HTTP Status:** 200  
**Error Signature:** Console error: Failed to load resource: the server responded with a status of 404 (Not Found)  
**Console Errors:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Screenshot:** cafesserie_owner__-staff.png  

### ✅ /feedback

**Status:** PASS  

### ✅ /workforce/schedule

**Status:** PASS  

### ✅ /workforce/timeclock

**Status:** PASS  

### ✅ /workforce/approvals

**Status:** PASS  

### ❌ /workforce/swaps

**Status:** FAIL  
**Navigation HTTP Status:** 200  
**Error Signature:** HTTP 500 in responses: GET http://localhost:3001/workforce/swaps?status=pending  
**HTTP 500 Count:** 4  
**Console Errors:**
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

**Screenshot:** cafesserie_owner__-workforce-swaps.png  

### ✅ /workforce/labor

**Status:** PASS  

