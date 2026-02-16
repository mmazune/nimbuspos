-- AlterEnum
BEGIN;
CREATE TYPE "LeaveRequestStatus_new" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED_STEP1', 'APPROVED', 'REJECTED', 'CANCELLED');
ALTER TABLE "leave_requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "leave_requests_v2" ALTER COLUMN "status" TYPE "LeaveRequestStatus_new" USING ("status"::text::"LeaveRequestStatus_new");
ALTER TABLE "leave_requests" ALTER COLUMN "status" TYPE "LeaveRequestStatus_new" USING ("status"::text::"LeaveRequestStatus_new");
ALTER TYPE "LeaveRequestStatus" RENAME TO "LeaveRequestStatus_old";
ALTER TYPE "LeaveRequestStatus_new" RENAME TO "LeaveRequestStatus";
DROP TYPE "LeaveRequestStatus_old";
ALTER TABLE "leave_requests" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'OTHER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReservationStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "ReservationStatus" ADD VALUE 'NO_SHOW';

-- AlterEnum
ALTER TYPE "WorkforceNotificationType" ADD VALUE 'SCHEDULE_PUBLISHED';

-- DropForeignKey
ALTER TABLE "shift_templates" DROP CONSTRAINT "shift_templates_branchId_fkey";

-- DropIndex
DROP INDEX "leave_policies_orgId_idx";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "color",
DROP COLUMN "imageUrl",
ADD COLUMN     "parentCategoryId" TEXT,
ALTER COLUMN "orgId" SET NOT NULL;

-- AlterTable
ALTER TABLE "compensation_components" DROP COLUMN "type",
ADD COLUMN     "type" "CompensationComponentType" NOT NULL,
DROP COLUMN "calcMethod",
ADD COLUMN     "calcMethod" "CalcMethod" NOT NULL,
DROP COLUMN "roundingRule",
ADD COLUMN     "roundingRule" "RoundingRule" NOT NULL DEFAULT 'HALF_UP_CENTS';

-- AlterTable
ALTER TABLE "depletion_cost_breakdowns" ADD COLUMN     "deleteReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;

-- AlterTable
ALTER TABLE "goods_receipt_lines_v2" ADD COLUMN     "deleteReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;

-- AlterTable
ALTER TABLE "inventory_items" DROP COLUMN "createdById",
DROP COLUMN "trackStock",
ADD COLUMN     "uomId" TEXT;

-- AlterTable
ALTER TABLE "inventory_transfer_lines" ADD COLUMN     "lotId" TEXT;

-- AlterTable
ALTER TABLE "inventory_waste" ADD COLUMN     "glJournalEntryId" TEXT,
ADD COLUMN     "glPostingError" TEXT,
ADD COLUMN     "glPostingStatus" "GlPostingStatus";

-- AlterTable
ALTER TABLE "inventory_waste_lines" ADD COLUMN     "lotId" TEXT;

-- AlterTable
ALTER TABLE "kds_tickets" ADD COLUMN     "doneAt" TIMESTAMP(3),
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "voidReason" TEXT,
ADD COLUMN     "voidedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "leave_policies" DROP COLUMN "accrualHoursPerMonth",
DROP COLUMN "maxCarryOverHours",
ADD COLUMN     "accrualMethod" "AccrualMethod" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "accrualRate" DECIMAL(10,4) NOT NULL DEFAULT 0,
ADD COLUMN     "approvalMode" "ApprovalMode" NOT NULL DEFAULT 'SINGLE',
ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "carryoverMaxHours" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "leaveTypeId" TEXT NOT NULL,
ADD COLUMN     "maxBalanceHours" DECIMAL(10,2) NOT NULL DEFAULT 480,
ADD COLUMN     "roundingPrecision" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "leave_requests" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "menu_item_on_group" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "menu_items" ALTER COLUMN "orgId" SET NOT NULL,
ALTER COLUMN "isActive" SET NOT NULL,
ALTER COLUMN "trackInventory" SET NOT NULL,
ALTER COLUMN "sortOrder" SET NOT NULL;

-- AlterTable
ALTER TABLE "modifier_groups" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "selectionType" "ModifierSelectionType" NOT NULL DEFAULT 'SINGLE',
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "modifier_options" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "order_inventory_depletions" ADD COLUMN     "deleteReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "glJournalEntryId" TEXT,
ADD COLUMN     "glPostingError" TEXT,
ADD COLUMN     "glPostingStatus" "GlPostingStatus";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "basePriceCentsSnapshot" INTEGER,
ADD COLUMN     "itemNameSnapshot" TEXT,
ADD COLUMN     "lineTotalCentsSnapshot" INTEGER,
ADD COLUMN     "selectedModifiersSnapshot" JSONB,
ADD COLUMN     "unitPriceCentsSnapshot" INTEGER;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "orgId",
ADD COLUMN     "paymentStatus" "OrderPaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "amountCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "capturedCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "orgId" TEXT,
ADD COLUMN     "posStatus" "PosPaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "provider" "PosPaymentProvider" NOT NULL DEFAULT 'INTERNAL',
ADD COLUMN     "providerRef" TEXT,
ADD COLUMN     "refundedCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tipCents" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "payslip_line_items" DROP COLUMN "type",
ADD COLUMN     "type" "CompensationComponentType" NOT NULL;

-- AlterTable
ALTER TABLE "purchase_orders_v2" ADD COLUMN     "optimizationRunId" TEXT;

-- AlterTable
ALTER TABLE "reorder_policies" ADD COLUMN     "includeInTransit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "includeOpenPOs" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "includeQuarantinedLots" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeRecallBlockedLots" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leadTimeDays" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "minOrderQty" DECIMAL(12,4),
ADD COLUMN     "safetyStockDays" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "time_entries" ADD COLUMN     "clockInAccuracyMeters" DOUBLE PRECISION,
ADD COLUMN     "clockInLat" DOUBLE PRECISION,
ADD COLUMN     "clockInLng" DOUBLE PRECISION,
ADD COLUMN     "clockInOverride" BOOLEAN,
ADD COLUMN     "clockInOverrideById" TEXT,
ADD COLUMN     "clockInOverrideReason" TEXT,
ADD COLUMN     "clockInSource" TEXT,
ADD COLUMN     "clockOutAccuracyMeters" DOUBLE PRECISION,
ADD COLUMN     "clockOutLat" DOUBLE PRECISION,
ADD COLUMN     "clockOutLng" DOUBLE PRECISION,
ADD COLUMN     "clockOutOverride" BOOLEAN,
ADD COLUMN     "clockOutOverrideById" TEXT,
ADD COLUMN     "clockOutOverrideReason" TEXT,
ADD COLUMN     "clockOutSource" TEXT;

-- AlterTable
ALTER TABLE "workforce_policies" ADD COLUMN     "allowWaiveMealBreak" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kioskHeartbeatOfflineSeconds" INTEGER NOT NULL DEFAULT 900,
ADD COLUMN     "kioskHeartbeatStaleSeconds" INTEGER NOT NULL DEFAULT 120,
ADD COLUMN     "kioskMaxInvalidPinsPerMinute" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "kioskPinRateLimitPerMinute" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "kioskSessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 720,
ADD COLUMN     "mealBreakMinimumMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "mealBreakRequiredAfterHours" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN     "requireGeofenceForKiosk" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requireKioskForTimeclock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "restBreakMinimumMinutes" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "restBreakRequiredAfterHours" INTEGER NOT NULL DEFAULT 4;

-- CreateTable
CREATE TABLE "reservation_access_tokens" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservation_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "partySize" INTEGER NOT NULL,
    "notes" TEXT,
    "quotedWaitMinutes" INTEGER,
    "status" "WaitlistStatus" NOT NULL DEFAULT 'WAITING',
    "addedById" TEXT,
    "seatedById" TEXT,
    "seatedAt" TIMESTAMP(3),
    "droppedAt" TIMESTAMP(3),
    "droppedReason" TEXT,
    "promotedToResId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_policies" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "leadTimeMinutes" INTEGER NOT NULL DEFAULT 60,
    "maxPartySize" INTEGER NOT NULL DEFAULT 20,
    "holdExpiresMinutes" INTEGER NOT NULL DEFAULT 30,
    "cancelCutoffMinutes" INTEGER NOT NULL DEFAULT 120,
    "depositRequired" BOOLEAN NOT NULL DEFAULT false,
    "depositAmountDefault" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "depositPerGuest" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "noShowFeeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "noShowFeeAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "autoExpireHeldEnabled" BOOLEAN NOT NULL DEFAULT true,
    "waitlistAutoPromote" BOOLEAN NOT NULL DEFAULT false,
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reminderLeadMinutes" INTEGER NOT NULL DEFAULT 1440,
    "maxCapacityPerSlot" INTEGER,
    "noShowGraceMinutes" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_deposits" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "DepositStatus" NOT NULL DEFAULT 'REQUIRED',
    "paymentMethod" "PaymentMethod",
    "journalEntryId" TEXT,
    "refundJournalId" TEXT,
    "applyJournalId" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3),
    "refundReason" TEXT,
    "createdById" TEXT,
    "paidById" TEXT,
    "refundedById" TEXT,
    "appliedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "reservationId" TEXT,
    "waitlistId" TEXT,
    "type" "NotificationType" NOT NULL,
    "event" "NotificationEvent" NOT NULL,
    "toAddress" TEXT,
    "payloadJson" JSONB,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "sentAt" TIMESTAMP(3),
    "failedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_logs" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL DEFAULT 'SYSTEM',
    "actorId" TEXT,
    "beforeState" JSONB,
    "afterState" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_availability_rules" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "targetType" "AvailabilityTargetType" NOT NULL,
    "categoryId" TEXT,
    "itemId" TEXT,
    "daysOfWeek" INTEGER[] DEFAULT ARRAY[0, 1, 2, 3, 4, 5, 6]::INTEGER[],
    "startTime" TEXT NOT NULL DEFAULT '00:00',
    "endTime" TEXT NOT NULL DEFAULT '23:59',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_availability_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kds_ticket_lines" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "itemNameSnapshot" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "modifiersSnapshot" JSONB,
    "notesSnapshot" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "bumpedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kds_ticket_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_payment_events" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pos_payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_sessions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "openedById" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedById" TEXT,
    "closedAt" TIMESTAMP(3),
    "openingFloatCents" INTEGER NOT NULL,
    "expectedCashCents" INTEGER,
    "countedCashCents" INTEGER,
    "status" "CashSessionStatus" NOT NULL DEFAULT 'OPEN',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_receipts" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedById" TEXT NOT NULL,
    "totalsSnapshot" JSONB NOT NULL,

    CONSTRAINT "pos_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_posting_mappings" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "inventoryAssetAccountId" TEXT NOT NULL,
    "cogsAccountId" TEXT NOT NULL,
    "wasteExpenseAccountId" TEXT NOT NULL,
    "shrinkExpenseAccountId" TEXT NOT NULL,
    "grniAccountId" TEXT NOT NULL,
    "inventoryGainAccountId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_posting_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_type_definitions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" "LeaveTypeCode" NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "minNoticeHours" INTEGER NOT NULL DEFAULT 0,
    "maxConsecutiveDays" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_type_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests_v2" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "leaveTypeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalHours" DECIMAL(10,2) NOT NULL,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "reason" TEXT,
    "approvedStep1ById" TEXT,
    "approvedStep1At" TIMESTAMP(3),
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "rejectedStep" INTEGER,
    "overrideConflict" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balance_ledger" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "leaveTypeId" TEXT NOT NULL,
    "entryType" "LedgerEntryType" NOT NULL,
    "deltaHours" DECIMAL(10,4) NOT NULL,
    "balanceAfter" DECIMAL(10,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_balance_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_request_attachments" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_request_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_delegates" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "principalUserId" TEXT NOT NULL,
    "delegateUserId" TEXT NOT NULL,
    "branchId" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_delegates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_geo_fences" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "centerLat" DOUBLE PRECISION NOT NULL,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "radiusMeters" INTEGER NOT NULL DEFAULT 100,
    "enforceClockIn" BOOLEAN NOT NULL DEFAULT true,
    "enforceClockOut" BOOLEAN NOT NULL DEFAULT true,
    "allowManagerOverride" BOOLEAN NOT NULL DEFAULT true,
    "maxAccuracyMeters" INTEGER NOT NULL DEFAULT 200,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_geo_fences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_fence_events" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "reasonCode" TEXT,
    "clockAction" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "accuracyMeters" DOUBLE PRECISION,
    "distanceMeters" DOUBLE PRECISION,
    "radiusMeters" INTEGER,
    "overrideById" TEXT,
    "overrideReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geo_fence_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_operating_hours" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_operating_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_blackouts" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_blackouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_capacity_rules" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "maxPartiesPerHour" INTEGER,
    "maxCoversPerHour" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_capacity_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ops_incidents" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "payload" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "timeEntryId" TEXT,
    "userId" TEXT,
    "incidentDate" TIMESTAMP(3),
    "penaltyMinutes" INTEGER,
    "penaltyAmountCents" INTEGER,
    "currency" TEXT DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ops_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "eventTypes" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "timeoutMs" INTEGER NOT NULL DEFAULT 5000,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "disabledUntil" TIMESTAMP(3),
    "lastFailureAt" TIMESTAMP(3),
    "circuitBreakThreshold" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "responseCode" INTEGER,
    "responseBody" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "type" "NotificationType" NOT NULL,
    "event" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_outbox" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "recipientId" TEXT,
    "type" "NotificationType" NOT NULL,
    "event" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" "NotificationOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_feed_tokens" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'CALENDAR_READ',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendar_feed_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_devices" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicId" VARCHAR(32) NOT NULL,
    "secretHash" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "allowedIpCidrs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastSeenAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kiosk_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_device_sessions" (
    "id" TEXT NOT NULL,
    "kioskDeviceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "endedReason" TEXT,
    "lastHeartbeatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,

    CONSTRAINT "kiosk_device_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_pin_attempts" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "kioskDeviceId" TEXT NOT NULL,
    "pinMasked" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kiosk_pin_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_clock_events" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "kioskDeviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "timeEntryId" TEXT,
    "breakEntryId" TEXT,
    "geoBlocked" BOOLEAN NOT NULL DEFAULT false,
    "geoOverridden" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kiosk_clock_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_events" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "kioskDeviceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" TEXT NOT NULL,
    "payloadJson" JSONB,
    "status" TEXT NOT NULL,
    "rejectCode" TEXT,
    "timeEntryId" TEXT,
    "breakEntryId" TEXT,
    "userId" TEXT,

    CONSTRAINT "kiosk_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_event_ingests" (
    "id" TEXT NOT NULL,
    "kioskDeviceId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "eventCount" INTEGER NOT NULL,
    "acceptedCount" INTEGER NOT NULL DEFAULT 0,
    "rejectedCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "diagnostics" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kiosk_event_ingests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_ledger_entries" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "qty" DECIMAL(12,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "notes" TEXT,
    "createdById" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "qty" DECIMAL(12,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "count_sessions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "locationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdById" TEXT NOT NULL,
    "finalizedById" TEXT,
    "finalizedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "count_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "count_session_lines" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "expectedQty" DECIMAL(12,4) NOT NULL,
    "countedQty" DECIMAL(12,4) NOT NULL,
    "variance" DECIMAL(12,4) NOT NULL,
    "notes" TEXT,
    "countedById" TEXT,
    "countedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "count_session_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktake_sessions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "sessionNumber" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "locationId" TEXT,
    "status" "StocktakeStatus" NOT NULL DEFAULT 'DRAFT',
    "blindCount" BOOLEAN NOT NULL DEFAULT true,
    "varianceThresholdPct" DECIMAL(5,2),
    "varianceThresholdAbs" DECIMAL(12,4),
    "createdById" TEXT NOT NULL,
    "startedById" TEXT,
    "startedAt" TIMESTAMP(3),
    "submittedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "postedById" TEXT,
    "postedAt" TIMESTAMP(3),
    "voidedById" TEXT,
    "voidedAt" TIMESTAMP(3),
    "voidReason" TEXT,
    "totalLines" INTEGER NOT NULL DEFAULT 0,
    "linesWithVariance" INTEGER NOT NULL DEFAULT 0,
    "totalVarianceValue" DECIMAL(12,2),
    "glJournalEntryId" TEXT,
    "glPostingStatus" "GlPostingStatus",
    "glPostingError" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocktake_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktake_lines" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "snapshotQty" DECIMAL(12,4) NOT NULL,
    "countedQty" DECIMAL(12,4),
    "variance" DECIMAL(12,4),
    "varianceValue" DECIMAL(12,2),
    "notes" TEXT,
    "countedById" TEXT,
    "countedAt" TIMESTAMP(3),
    "ledgerEntryId" TEXT,
    "reversalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocktake_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prep_items" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "yieldQty" DECIMAL(12,4) NOT NULL,
    "yieldUomId" TEXT NOT NULL,
    "prepMinutes" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "output_inventory_item_id" TEXT,

    CONSTRAINT "prep_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prep_lines" (
    "id" TEXT NOT NULL,
    "prepItemId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "qty" DECIMAL(12,4) NOT NULL,
    "uomId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prep_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demand_forecast_snapshots" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "windowDays" INTEGER NOT NULL DEFAULT 14,
    "horizonDays" INTEGER NOT NULL DEFAULT 14,
    "model" "ForecastModelType" NOT NULL DEFAULT 'TRAILING_MOVING_AVG',
    "modelVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "avgDailyQty" DECIMAL(12,4) NOT NULL,
    "forecastTotalQty" DECIMAL(12,4) NOT NULL,
    "confidenceLow" DECIMAL(12,4) NOT NULL,
    "confidenceHigh" DECIMAL(12,4) NOT NULL,
    "lastObservedDate" TIMESTAMP(3),
    "dataPoints" INTEGER NOT NULL DEFAULT 0,
    "deterministicHash" TEXT NOT NULL,
    "generatedById" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyForecast" JSONB,

    CONSTRAINT "demand_forecast_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_optimization_runs" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "horizonDays" INTEGER NOT NULL DEFAULT 14,
    "leadTimeDaysOverride" INTEGER,
    "safetyStockDaysOverride" INTEGER,
    "status" "ForecastOptimizationStatus" NOT NULL DEFAULT 'GENERATED',
    "usedSnapshotId" TEXT,
    "deterministicHash" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "totalSuggestedQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forecast_optimization_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_optimization_lines" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "onHandQty" DECIMAL(12,4) NOT NULL,
    "inTransitQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "onOrderQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "quarantinedQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "availableQty" DECIMAL(12,4) NOT NULL,
    "avgDailyQty" DECIMAL(12,4) NOT NULL,
    "forecastDemandQty" DECIMAL(12,4) NOT NULL,
    "targetStockQty" DECIMAL(12,4) NOT NULL,
    "reorderPointQty" DECIMAL(12,4) NOT NULL,
    "suggestedQty" DECIMAL(12,4) NOT NULL,
    "reasonCodes" "ForecastReasonCode"[],
    "explanation" TEXT NOT NULL,
    "suggestedVendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forecast_optimization_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_lots" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "receivedQty" DECIMAL(12,4) NOT NULL,
    "remainingQty" DECIMAL(12,4) NOT NULL,
    "unitCost" DECIMAL(12,4),
    "expiryDate" TIMESTAMP(3),
    "status" "LotStatus" NOT NULL DEFAULT 'ACTIVE',
    "manufacturingDate" TIMESTAMP(3),
    "supplierLotRef" TEXT,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lot_ledger_allocations" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "ledgerEntryId" TEXT,
    "allocatedQty" DECIMAL(12,4) NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "allocationOrder" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lot_ledger_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_returns" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "status" "VendorReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "submittedById" TEXT,
    "postedAt" TIMESTAMP(3),
    "postedById" TEXT,
    "voidedAt" TIMESTAMP(3),
    "voidedById" TEXT,
    "voidReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_return_lines" (
    "id" TEXT NOT NULL,
    "vendorReturnId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "requestedBaseQty" DECIMAL(12,4) NOT NULL,
    "postedBaseQty" DECIMAL(12,4),
    "uomId" TEXT,
    "lotId" TEXT,
    "unitCost" DECIMAL(12,4),
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_return_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recall_cases" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "caseNumber" TEXT NOT NULL,
    "status" "RecallCaseStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "closedAt" TIMESTAMP(3),
    "closedById" TEXT,
    "closeNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recall_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recall_lot_links" (
    "id" TEXT NOT NULL,
    "recallCaseId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "linkedById" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "recall_lot_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_batches" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "productionLocationId" TEXT NOT NULL,
    "outputItemId" TEXT NOT NULL,
    "outputQty" DECIMAL(12,4) NOT NULL,
    "outputUomId" TEXT NOT NULL,
    "outputBaseQty" DECIMAL(12,4) NOT NULL,
    "outputCost" DECIMAL(12,4),
    "recipeId" TEXT,
    "status" "ProductionBatchStatus" NOT NULL DEFAULT 'DRAFT',
    "producedAt" TIMESTAMP(3),
    "producedById" TEXT,
    "voidedAt" TIMESTAMP(3),
    "voidedById" TEXT,
    "voidReason" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_batch_lines" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "lotId" TEXT,
    "uomId" TEXT NOT NULL,
    "qty" DECIMAL(12,4) NOT NULL,
    "baseQty" DECIMAL(12,4) NOT NULL,
    "consumedBaseQty" DECIMAL(12,4),
    "unitCostAtPost" DECIMAL(12,4),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_batch_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_barcodes" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "format" "BarcodeFormat" NOT NULL DEFAULT 'OTHER',
    "value" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_item_barcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_lot_barcodes" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "format" "BarcodeFormat" NOT NULL DEFAULT 'OTHER',
    "value" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_lot_barcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_alerts" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "type" "InventoryAlertType" NOT NULL,
    "severity" "InventoryAlertSeverity" NOT NULL DEFAULT 'WARN',
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detailsJson" JSONB,
    "status" "InventoryAlertStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,

    CONSTRAINT "inventory_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_periods" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" "InventoryPeriodStatus" NOT NULL DEFAULT 'OPEN',
    "closedAt" TIMESTAMP(3),
    "closedById" TEXT,
    "lockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_valuation_snapshots" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "qtyOnHand" DECIMAL(12,4) NOT NULL,
    "wac" DECIMAL(12,4) NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "asOf" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_valuation_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_period_movement_summaries" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "itemId" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "receiveQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "receiveValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "depletionQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "depletionValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "wasteQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "wasteValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "transferInQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "transferOutQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "adjustmentQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "adjustmentValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "countVarianceQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "countVarianceValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "productionConsumeQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "productionConsumeValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "productionProduceQty" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "productionProduceValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_period_movement_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immutability_audit_events" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "reasonCode" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "immutability_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservation_access_tokens_token_key" ON "reservation_access_tokens"("token");

-- CreateIndex
CREATE INDEX "reservation_access_tokens_token_idx" ON "reservation_access_tokens"("token");

-- CreateIndex
CREATE INDEX "reservation_access_tokens_reservationId_idx" ON "reservation_access_tokens"("reservationId");

-- CreateIndex
CREATE INDEX "waitlist_entries_orgId_idx" ON "waitlist_entries"("orgId");

-- CreateIndex
CREATE INDEX "waitlist_entries_branchId_idx" ON "waitlist_entries"("branchId");

-- CreateIndex
CREATE INDEX "waitlist_entries_status_createdAt_idx" ON "waitlist_entries"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_policies_branchId_key" ON "reservation_policies"("branchId");

-- CreateIndex
CREATE INDEX "reservation_policies_orgId_idx" ON "reservation_policies"("orgId");

-- CreateIndex
CREATE INDEX "reservation_deposits_orgId_idx" ON "reservation_deposits"("orgId");

-- CreateIndex
CREATE INDEX "reservation_deposits_reservationId_idx" ON "reservation_deposits"("reservationId");

-- CreateIndex
CREATE INDEX "reservation_deposits_status_idx" ON "reservation_deposits"("status");

-- CreateIndex
CREATE INDEX "notification_logs_orgId_idx" ON "notification_logs"("orgId");

-- CreateIndex
CREATE INDEX "notification_logs_branchId_idx" ON "notification_logs"("branchId");

-- CreateIndex
CREATE INDEX "notification_logs_reservationId_idx" ON "notification_logs"("reservationId");

-- CreateIndex
CREATE INDEX "notification_logs_event_createdAt_idx" ON "notification_logs"("event", "createdAt");

-- CreateIndex
CREATE INDEX "automation_logs_orgId_idx" ON "automation_logs"("orgId");

-- CreateIndex
CREATE INDEX "automation_logs_branchId_idx" ON "automation_logs"("branchId");

-- CreateIndex
CREATE INDEX "automation_logs_entityType_entityId_idx" ON "automation_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "automation_logs_action_createdAt_idx" ON "automation_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "menu_availability_rules_orgId_idx" ON "menu_availability_rules"("orgId");

-- CreateIndex
CREATE INDEX "menu_availability_rules_branchId_idx" ON "menu_availability_rules"("branchId");

-- CreateIndex
CREATE INDEX "menu_availability_rules_targetType_categoryId_idx" ON "menu_availability_rules"("targetType", "categoryId");

-- CreateIndex
CREATE INDEX "menu_availability_rules_targetType_itemId_idx" ON "menu_availability_rules"("targetType", "itemId");

-- CreateIndex
CREATE INDEX "kds_ticket_lines_ticketId_idx" ON "kds_ticket_lines"("ticketId");

-- CreateIndex
CREATE INDEX "pos_payment_events_paymentId_idx" ON "pos_payment_events"("paymentId");

-- CreateIndex
CREATE INDEX "pos_payment_events_orgId_type_idx" ON "pos_payment_events"("orgId", "type");

-- CreateIndex
CREATE INDEX "cash_sessions_orgId_branchId_status_idx" ON "cash_sessions"("orgId", "branchId", "status");

-- CreateIndex
CREATE INDEX "cash_sessions_branchId_status_idx" ON "cash_sessions"("branchId", "status");

-- CreateIndex
CREATE INDEX "pos_receipts_orgId_branchId_idx" ON "pos_receipts"("orgId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "pos_receipts_orgId_receiptNumber_key" ON "pos_receipts"("orgId", "receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "pos_receipts_orgId_orderId_key" ON "pos_receipts"("orgId", "orderId");

-- CreateIndex
CREATE INDEX "inventory_posting_mappings_orgId_idx" ON "inventory_posting_mappings"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_posting_mappings_orgId_branchId_key" ON "inventory_posting_mappings"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "leave_type_definitions_orgId_isActive_idx" ON "leave_type_definitions"("orgId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "leave_type_definitions_orgId_code_key" ON "leave_type_definitions"("orgId", "code");

-- CreateIndex
CREATE INDEX "leave_requests_v2_orgId_branchId_status_idx" ON "leave_requests_v2"("orgId", "branchId", "status");

-- CreateIndex
CREATE INDEX "leave_requests_v2_userId_startDate_endDate_idx" ON "leave_requests_v2"("userId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "leave_requests_v2_leaveTypeId_idx" ON "leave_requests_v2"("leaveTypeId");

-- CreateIndex
CREATE INDEX "leave_balance_ledger_orgId_userId_leaveTypeId_idx" ON "leave_balance_ledger"("orgId", "userId", "leaveTypeId");

-- CreateIndex
CREATE INDEX "leave_balance_ledger_createdAt_idx" ON "leave_balance_ledger"("createdAt");

-- CreateIndex
CREATE INDEX "leave_balance_ledger_referenceId_idx" ON "leave_balance_ledger"("referenceId");

-- CreateIndex
CREATE INDEX "leave_request_attachments_leaveRequestId_idx" ON "leave_request_attachments"("leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_request_attachments_orgId_idx" ON "leave_request_attachments"("orgId");

-- CreateIndex
CREATE INDEX "approval_delegates_orgId_principalUserId_enabled_idx" ON "approval_delegates"("orgId", "principalUserId", "enabled");

-- CreateIndex
CREATE INDEX "approval_delegates_orgId_delegateUserId_idx" ON "approval_delegates"("orgId", "delegateUserId");

-- CreateIndex
CREATE INDEX "approval_delegates_startAt_endAt_idx" ON "approval_delegates"("startAt", "endAt");

-- CreateIndex
CREATE UNIQUE INDEX "branch_geo_fences_branchId_key" ON "branch_geo_fences"("branchId");

-- CreateIndex
CREATE INDEX "branch_geo_fences_orgId_idx" ON "branch_geo_fences"("orgId");

-- CreateIndex
CREATE INDEX "branch_geo_fences_branchId_idx" ON "branch_geo_fences"("branchId");

-- CreateIndex
CREATE INDEX "geo_fence_events_orgId_branchId_createdAt_idx" ON "geo_fence_events"("orgId", "branchId", "createdAt");

-- CreateIndex
CREATE INDEX "geo_fence_events_userId_idx" ON "geo_fence_events"("userId");

-- CreateIndex
CREATE INDEX "geo_fence_events_eventType_idx" ON "geo_fence_events"("eventType");

-- CreateIndex
CREATE INDEX "branch_operating_hours_orgId_idx" ON "branch_operating_hours"("orgId");

-- CreateIndex
CREATE INDEX "branch_operating_hours_branchId_idx" ON "branch_operating_hours"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "branch_operating_hours_branchId_dayOfWeek_key" ON "branch_operating_hours"("branchId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "branch_blackouts_orgId_idx" ON "branch_blackouts"("orgId");

-- CreateIndex
CREATE INDEX "branch_blackouts_branchId_idx" ON "branch_blackouts"("branchId");

-- CreateIndex
CREATE INDEX "branch_blackouts_startAt_endAt_idx" ON "branch_blackouts"("startAt", "endAt");

-- CreateIndex
CREATE UNIQUE INDEX "branch_capacity_rules_branchId_key" ON "branch_capacity_rules"("branchId");

-- CreateIndex
CREATE INDEX "branch_capacity_rules_orgId_idx" ON "branch_capacity_rules"("orgId");

-- CreateIndex
CREATE INDEX "ops_incidents_orgId_idx" ON "ops_incidents"("orgId");

-- CreateIndex
CREATE INDEX "ops_incidents_branchId_idx" ON "ops_incidents"("branchId");

-- CreateIndex
CREATE INDEX "ops_incidents_type_createdAt_idx" ON "ops_incidents"("type", "createdAt");

-- CreateIndex
CREATE INDEX "ops_incidents_resolved_createdAt_idx" ON "ops_incidents"("resolved", "createdAt");

-- CreateIndex
CREATE INDEX "ops_incidents_userId_createdAt_idx" ON "ops_incidents"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ops_incidents_timeEntryId_idx" ON "ops_incidents"("timeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "ops_incidents_orgId_timeEntryId_type_key" ON "ops_incidents"("orgId", "timeEntryId", "type");

-- CreateIndex
CREATE INDEX "webhook_endpoints_orgId_idx" ON "webhook_endpoints"("orgId");

-- CreateIndex
CREATE INDEX "webhook_endpoints_branchId_idx" ON "webhook_endpoints"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_deliveries_eventId_key" ON "webhook_deliveries"("eventId");

-- CreateIndex
CREATE INDEX "webhook_deliveries_endpointId_idx" ON "webhook_deliveries"("endpointId");

-- CreateIndex
CREATE INDEX "webhook_deliveries_status_idx" ON "webhook_deliveries"("status");

-- CreateIndex
CREATE INDEX "webhook_deliveries_eventId_idx" ON "webhook_deliveries"("eventId");

-- CreateIndex
CREATE INDEX "notification_templates_orgId_idx" ON "notification_templates"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_orgId_branchId_type_event_key" ON "notification_templates"("orgId", "branchId", "type", "event");

-- CreateIndex
CREATE INDEX "notification_outbox_status_idx" ON "notification_outbox"("status");

-- CreateIndex
CREATE INDEX "notification_outbox_orgId_idx" ON "notification_outbox"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_feed_tokens_token_key" ON "calendar_feed_tokens"("token");

-- CreateIndex
CREATE INDEX "calendar_feed_tokens_branchId_idx" ON "calendar_feed_tokens"("branchId");

-- CreateIndex
CREATE INDEX "calendar_feed_tokens_token_idx" ON "calendar_feed_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_devices_publicId_key" ON "kiosk_devices"("publicId");

-- CreateIndex
CREATE INDEX "kiosk_devices_orgId_idx" ON "kiosk_devices"("orgId");

-- CreateIndex
CREATE INDEX "kiosk_devices_branchId_idx" ON "kiosk_devices"("branchId");

-- CreateIndex
CREATE INDEX "kiosk_devices_publicId_idx" ON "kiosk_devices"("publicId");

-- CreateIndex
CREATE INDEX "kiosk_device_sessions_kioskDeviceId_idx" ON "kiosk_device_sessions"("kioskDeviceId");

-- CreateIndex
CREATE INDEX "kiosk_device_sessions_startedAt_idx" ON "kiosk_device_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "kiosk_pin_attempts_orgId_kioskDeviceId_attemptedAt_idx" ON "kiosk_pin_attempts"("orgId", "kioskDeviceId", "attemptedAt");

-- CreateIndex
CREATE INDEX "kiosk_pin_attempts_kioskDeviceId_attemptedAt_idx" ON "kiosk_pin_attempts"("kioskDeviceId", "attemptedAt");

-- CreateIndex
CREATE INDEX "kiosk_clock_events_orgId_branchId_createdAt_idx" ON "kiosk_clock_events"("orgId", "branchId", "createdAt");

-- CreateIndex
CREATE INDEX "kiosk_clock_events_kioskDeviceId_createdAt_idx" ON "kiosk_clock_events"("kioskDeviceId", "createdAt");

-- CreateIndex
CREATE INDEX "kiosk_clock_events_userId_createdAt_idx" ON "kiosk_clock_events"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "kiosk_events_orgId_branchId_receivedAt_idx" ON "kiosk_events"("orgId", "branchId", "receivedAt");

-- CreateIndex
CREATE INDEX "kiosk_events_kioskDeviceId_receivedAt_idx" ON "kiosk_events"("kioskDeviceId", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_events_kioskDeviceId_idempotencyKey_key" ON "kiosk_events"("kioskDeviceId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "kiosk_event_ingests_kioskDeviceId_createdAt_idx" ON "kiosk_event_ingests"("kioskDeviceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_event_ingests_kioskDeviceId_batchId_key" ON "kiosk_event_ingests"("kioskDeviceId", "batchId");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_orgId_branchId_itemId_idx" ON "inventory_ledger_entries"("orgId", "branchId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_itemId_locationId_idx" ON "inventory_ledger_entries"("itemId", "locationId");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_sourceType_sourceId_idx" ON "inventory_ledger_entries"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_createdAt_idx" ON "inventory_ledger_entries"("createdAt");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_branchId_createdAt_idx" ON "inventory_ledger_entries"("branchId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_effectiveAt_idx" ON "inventory_ledger_entries"("effectiveAt");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_branchId_effectiveAt_idx" ON "inventory_ledger_entries"("branchId", "effectiveAt");

-- CreateIndex
CREATE INDEX "inventory_ledger_entries_orgId_branchId_effectiveAt_idx" ON "inventory_ledger_entries"("orgId", "branchId", "effectiveAt");

-- CreateIndex
CREATE INDEX "stock_adjustments_orgId_branchId_idx" ON "stock_adjustments"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "stock_adjustments_itemId_idx" ON "stock_adjustments"("itemId");

-- CreateIndex
CREATE INDEX "stock_adjustments_status_idx" ON "stock_adjustments"("status");

-- CreateIndex
CREATE INDEX "count_sessions_orgId_branchId_idx" ON "count_sessions"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "count_sessions_status_idx" ON "count_sessions"("status");

-- CreateIndex
CREATE INDEX "count_session_lines_sessionId_idx" ON "count_session_lines"("sessionId");

-- CreateIndex
CREATE INDEX "count_session_lines_itemId_idx" ON "count_session_lines"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "count_session_lines_sessionId_itemId_locationId_key" ON "count_session_lines"("sessionId", "itemId", "locationId");

-- CreateIndex
CREATE INDEX "stocktake_sessions_orgId_branchId_idx" ON "stocktake_sessions"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "stocktake_sessions_status_idx" ON "stocktake_sessions"("status");

-- CreateIndex
CREATE INDEX "stocktake_sessions_createdAt_idx" ON "stocktake_sessions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_sessions_orgId_sessionNumber_key" ON "stocktake_sessions"("orgId", "sessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_lines_ledgerEntryId_key" ON "stocktake_lines"("ledgerEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_lines_reversalEntryId_key" ON "stocktake_lines"("reversalEntryId");

-- CreateIndex
CREATE INDEX "stocktake_lines_sessionId_idx" ON "stocktake_lines"("sessionId");

-- CreateIndex
CREATE INDEX "stocktake_lines_itemId_idx" ON "stocktake_lines"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_lines_sessionId_itemId_locationId_key" ON "stocktake_lines"("sessionId", "itemId", "locationId");

-- CreateIndex
CREATE INDEX "prep_items_orgId_branchId_idx" ON "prep_items"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "prep_items_orgId_name_idx" ON "prep_items"("orgId", "name");

-- CreateIndex
CREATE INDEX "prep_lines_prepItemId_idx" ON "prep_lines"("prepItemId");

-- CreateIndex
CREATE INDEX "prep_lines_inventoryItemId_idx" ON "prep_lines"("inventoryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "demand_forecast_snapshots_deterministicHash_key" ON "demand_forecast_snapshots"("deterministicHash");

-- CreateIndex
CREATE INDEX "demand_forecast_snapshots_orgId_branchId_idx" ON "demand_forecast_snapshots"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "demand_forecast_snapshots_orgId_branchId_inventoryItemId_idx" ON "demand_forecast_snapshots"("orgId", "branchId", "inventoryItemId");

-- CreateIndex
CREATE INDEX "demand_forecast_snapshots_generatedAt_idx" ON "demand_forecast_snapshots"("generatedAt");

-- CreateIndex
CREATE INDEX "forecast_optimization_runs_orgId_branchId_idx" ON "forecast_optimization_runs"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "forecast_optimization_runs_createdAt_idx" ON "forecast_optimization_runs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_optimization_runs_orgId_branchId_deterministicHash_key" ON "forecast_optimization_runs"("orgId", "branchId", "deterministicHash");

-- CreateIndex
CREATE INDEX "forecast_optimization_lines_runId_idx" ON "forecast_optimization_lines"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_optimization_lines_runId_inventoryItemId_key" ON "forecast_optimization_lines"("runId", "inventoryItemId");

-- CreateIndex
CREATE INDEX "inventory_lots_orgId_branchId_itemId_idx" ON "inventory_lots"("orgId", "branchId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_lots_itemId_locationId_idx" ON "inventory_lots"("itemId", "locationId");

-- CreateIndex
CREATE INDEX "inventory_lots_status_idx" ON "inventory_lots"("status");

-- CreateIndex
CREATE INDEX "inventory_lots_expiryDate_idx" ON "inventory_lots"("expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_lots_orgId_branchId_itemId_locationId_lotNumber_key" ON "inventory_lots"("orgId", "branchId", "itemId", "locationId", "lotNumber");

-- CreateIndex
CREATE INDEX "lot_ledger_allocations_lotId_idx" ON "lot_ledger_allocations"("lotId");

-- CreateIndex
CREATE INDEX "lot_ledger_allocations_ledgerEntryId_idx" ON "lot_ledger_allocations"("ledgerEntryId");

-- CreateIndex
CREATE INDEX "lot_ledger_allocations_sourceType_sourceId_idx" ON "lot_ledger_allocations"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "lot_ledger_allocations_orgId_sourceType_idx" ON "lot_ledger_allocations"("orgId", "sourceType");

-- CreateIndex
CREATE INDEX "vendor_returns_orgId_branchId_idx" ON "vendor_returns"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "vendor_returns_vendorId_idx" ON "vendor_returns"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_returns_status_idx" ON "vendor_returns"("status");

-- CreateIndex
CREATE INDEX "vendor_returns_createdAt_idx" ON "vendor_returns"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_returns_orgId_returnNumber_key" ON "vendor_returns"("orgId", "returnNumber");

-- CreateIndex
CREATE INDEX "vendor_return_lines_vendorReturnId_idx" ON "vendor_return_lines"("vendorReturnId");

-- CreateIndex
CREATE INDEX "vendor_return_lines_itemId_idx" ON "vendor_return_lines"("itemId");

-- CreateIndex
CREATE INDEX "vendor_return_lines_lotId_idx" ON "vendor_return_lines"("lotId");

-- CreateIndex
CREATE INDEX "recall_cases_orgId_branchId_idx" ON "recall_cases"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "recall_cases_status_idx" ON "recall_cases"("status");

-- CreateIndex
CREATE INDEX "recall_cases_createdAt_idx" ON "recall_cases"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "recall_cases_orgId_caseNumber_key" ON "recall_cases"("orgId", "caseNumber");

-- CreateIndex
CREATE INDEX "recall_lot_links_lotId_idx" ON "recall_lot_links"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "recall_lot_links_recallCaseId_lotId_key" ON "recall_lot_links"("recallCaseId", "lotId");

-- CreateIndex
CREATE INDEX "production_batches_orgId_branchId_idx" ON "production_batches"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "production_batches_status_idx" ON "production_batches"("status");

-- CreateIndex
CREATE UNIQUE INDEX "production_batches_orgId_branchId_batchNumber_key" ON "production_batches"("orgId", "branchId", "batchNumber");

-- CreateIndex
CREATE INDEX "production_batch_lines_batchId_idx" ON "production_batch_lines"("batchId");

-- CreateIndex
CREATE INDEX "production_batch_lines_itemId_idx" ON "production_batch_lines"("itemId");

-- CreateIndex
CREATE INDEX "production_batch_lines_lotId_idx" ON "production_batch_lines"("lotId");

-- CreateIndex
CREATE INDEX "inventory_item_barcodes_itemId_idx" ON "inventory_item_barcodes"("itemId");

-- CreateIndex
CREATE INDEX "inventory_item_barcodes_value_idx" ON "inventory_item_barcodes"("value");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_barcodes_orgId_value_key" ON "inventory_item_barcodes"("orgId", "value");

-- CreateIndex
CREATE INDEX "inventory_lot_barcodes_lotId_idx" ON "inventory_lot_barcodes"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_lot_barcodes_orgId_value_key" ON "inventory_lot_barcodes"("orgId", "value");

-- CreateIndex
CREATE INDEX "inventory_alerts_orgId_status_idx" ON "inventory_alerts"("orgId", "status");

-- CreateIndex
CREATE INDEX "inventory_alerts_branchId_idx" ON "inventory_alerts"("branchId");

-- CreateIndex
CREATE INDEX "inventory_alerts_type_idx" ON "inventory_alerts"("type");

-- CreateIndex
CREATE INDEX "inventory_alerts_entityType_entityId_idx" ON "inventory_alerts"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_alerts_orgId_branchId_type_entityType_entityId_st_key" ON "inventory_alerts"("orgId", "branchId", "type", "entityType", "entityId", "status");

-- CreateIndex
CREATE INDEX "inventory_periods_orgId_branchId_idx" ON "inventory_periods"("orgId", "branchId");

-- CreateIndex
CREATE INDEX "inventory_periods_status_idx" ON "inventory_periods"("status");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_periods_orgId_branchId_startDate_endDate_key" ON "inventory_periods"("orgId", "branchId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "inventory_valuation_snapshots_periodId_idx" ON "inventory_valuation_snapshots"("periodId");

-- CreateIndex
CREATE INDEX "inventory_valuation_snapshots_orgId_branchId_idx" ON "inventory_valuation_snapshots"("orgId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_valuation_snapshots_periodId_itemId_locationId_re_key" ON "inventory_valuation_snapshots"("periodId", "itemId", "locationId", "revision");

-- CreateIndex
CREATE INDEX "inventory_period_movement_summaries_periodId_idx" ON "inventory_period_movement_summaries"("periodId");

-- CreateIndex
CREATE INDEX "inventory_period_movement_summaries_orgId_branchId_idx" ON "inventory_period_movement_summaries"("orgId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_period_movement_summaries_periodId_itemId_revisio_key" ON "inventory_period_movement_summaries"("periodId", "itemId", "revision");

-- CreateIndex
CREATE INDEX "immutability_audit_events_orgId_createdAt_idx" ON "immutability_audit_events"("orgId", "createdAt");

-- CreateIndex
CREATE INDEX "immutability_audit_events_entityType_entityId_idx" ON "immutability_audit_events"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "immutability_audit_events_actorId_idx" ON "immutability_audit_events"("actorId");

-- CreateIndex
CREATE INDEX "immutability_audit_events_periodId_idx" ON "immutability_audit_events"("periodId");

-- CreateIndex
CREATE INDEX "categories_orgId_idx" ON "categories"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_orgId_branchId_name_key" ON "categories"("orgId", "branchId", "name");

-- CreateIndex
CREATE INDEX "depletion_cost_breakdowns_deletedAt_idx" ON "depletion_cost_breakdowns"("deletedAt");

-- CreateIndex
CREATE INDEX "goods_receipt_lines_v2_deletedAt_idx" ON "goods_receipt_lines_v2"("deletedAt");

-- CreateIndex
CREATE INDEX "inventory_items_orgId_isActive_idx" ON "inventory_items"("orgId", "isActive");

-- CreateIndex
CREATE INDEX "inventory_transfer_lines_lotId_idx" ON "inventory_transfer_lines"("lotId");

-- CreateIndex
CREATE INDEX "inventory_waste_lines_lotId_idx" ON "inventory_waste_lines"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "kds_tickets_orderId_station_key" ON "kds_tickets"("orderId", "station");

-- CreateIndex
CREATE INDEX "leave_policies_orgId_isActive_idx" ON "leave_policies"("orgId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "leave_policies_orgId_leaveTypeId_branchId_key" ON "leave_policies"("orgId", "leaveTypeId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_orgId_sku_key" ON "menu_items"("orgId", "sku");

-- CreateIndex
CREATE INDEX "modifier_groups_orgId_idx" ON "modifier_groups"("orgId");

-- CreateIndex
CREATE INDEX "modifier_options_groupId_idx" ON "modifier_options"("groupId");

-- CreateIndex
CREATE INDEX "order_inventory_depletions_deletedAt_idx" ON "order_inventory_depletions"("deletedAt");

-- CreateIndex
CREATE INDEX "payments_orgId_branchId_posStatus_idx" ON "payments"("orgId", "branchId", "posStatus");

-- CreateIndex
CREATE UNIQUE INDEX "payments_orgId_idempotencyKey_key" ON "payments"("orgId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "purchase_orders_v2_optimizationRunId_idx" ON "purchase_orders_v2"("optimizationRunId");

-- CreateIndex
CREATE UNIQUE INDEX "remittance_batches_orgId_idempotencyKey_key" ON "remittance_batches"("orgId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "scheduled_shifts_isOpen_idx" ON "scheduled_shifts"("isOpen");

-- CreateIndex
CREATE INDEX "shift_templates_branchId_idx" ON "shift_templates"("branchId");

-- AddForeignKey
ALTER TABLE "reservation_access_tokens" ADD CONSTRAINT "reservation_access_tokens_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_policies" ADD CONSTRAINT "reservation_policies_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_policies" ADD CONSTRAINT "reservation_policies_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_deposits" ADD CONSTRAINT "reservation_deposits_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_deposits" ADD CONSTRAINT "reservation_deposits_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_deposits" ADD CONSTRAINT "reservation_deposits_refundJournalId_fkey" FOREIGN KEY ("refundJournalId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_deposits" ADD CONSTRAINT "reservation_deposits_applyJournalId_fkey" FOREIGN KEY ("applyJournalId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_waitlistId_fkey" FOREIGN KEY ("waitlistId") REFERENCES "waitlist_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_availability_rules" ADD CONSTRAINT "menu_availability_rules_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_availability_rules" ADD CONSTRAINT "menu_availability_rules_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_availability_rules" ADD CONSTRAINT "menu_availability_rules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_availability_rules" ADD CONSTRAINT "menu_availability_rules_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kds_ticket_lines" ADD CONSTRAINT "kds_ticket_lines_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "kds_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kds_ticket_lines" ADD CONSTRAINT "kds_ticket_lines_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_templates" ADD CONSTRAINT "shift_templates_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_payment_events" ADD CONSTRAINT "pos_payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_sessions" ADD CONSTRAINT "cash_sessions_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_sessions" ADD CONSTRAINT "cash_sessions_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_receipts" ADD CONSTRAINT "pos_receipts_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "units_of_measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_inventoryAssetAccountId_fkey" FOREIGN KEY ("inventoryAssetAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_cogsAccountId_fkey" FOREIGN KEY ("cogsAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_wasteExpenseAccountId_fkey" FOREIGN KEY ("wasteExpenseAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_shrinkExpenseAccountId_fkey" FOREIGN KEY ("shrinkExpenseAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_grniAccountId_fkey" FOREIGN KEY ("grniAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_inventoryGainAccountId_fkey" FOREIGN KEY ("inventoryGainAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_posting_mappings" ADD CONSTRAINT "inventory_posting_mappings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_policies" ADD CONSTRAINT "leave_policies_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "leave_type_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests_v2" ADD CONSTRAINT "leave_requests_v2_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests_v2" ADD CONSTRAINT "leave_requests_v2_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests_v2" ADD CONSTRAINT "leave_requests_v2_approvedStep1ById_fkey" FOREIGN KEY ("approvedStep1ById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests_v2" ADD CONSTRAINT "leave_requests_v2_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "leave_type_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balance_ledger" ADD CONSTRAINT "leave_balance_ledger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balance_ledger" ADD CONSTRAINT "leave_balance_ledger_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "leave_type_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balance_ledger" ADD CONSTRAINT "leave_balance_ledger_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "leave_requests_v2"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_request_attachments" ADD CONSTRAINT "leave_request_attachments_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "leave_requests_v2"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_request_attachments" ADD CONSTRAINT "leave_request_attachments_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_delegates" ADD CONSTRAINT "approval_delegates_principalUserId_fkey" FOREIGN KEY ("principalUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_delegates" ADD CONSTRAINT "approval_delegates_delegateUserId_fkey" FOREIGN KEY ("delegateUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_clockInOverrideById_fkey" FOREIGN KEY ("clockInOverrideById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_clockOutOverrideById_fkey" FOREIGN KEY ("clockOutOverrideById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_geo_fences" ADD CONSTRAINT "branch_geo_fences_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_geo_fences" ADD CONSTRAINT "branch_geo_fences_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_geo_fences" ADD CONSTRAINT "branch_geo_fences_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_geo_fences" ADD CONSTRAINT "branch_geo_fences_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_fence_events" ADD CONSTRAINT "geo_fence_events_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_fence_events" ADD CONSTRAINT "geo_fence_events_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_fence_events" ADD CONSTRAINT "geo_fence_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_fence_events" ADD CONSTRAINT "geo_fence_events_overrideById_fkey" FOREIGN KEY ("overrideById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_operating_hours" ADD CONSTRAINT "branch_operating_hours_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_operating_hours" ADD CONSTRAINT "branch_operating_hours_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_blackouts" ADD CONSTRAINT "branch_blackouts_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_blackouts" ADD CONSTRAINT "branch_blackouts_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_capacity_rules" ADD CONSTRAINT "branch_capacity_rules_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_capacity_rules" ADD CONSTRAINT "branch_capacity_rules_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ops_incidents" ADD CONSTRAINT "ops_incidents_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ops_incidents" ADD CONSTRAINT "ops_incidents_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ops_incidents" ADD CONSTRAINT "ops_incidents_timeEntryId_fkey" FOREIGN KEY ("timeEntryId") REFERENCES "time_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ops_incidents" ADD CONSTRAINT "ops_incidents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_outbox" ADD CONSTRAINT "notification_outbox_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_feed_tokens" ADD CONSTRAINT "calendar_feed_tokens_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_devices" ADD CONSTRAINT "kiosk_devices_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_devices" ADD CONSTRAINT "kiosk_devices_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_devices" ADD CONSTRAINT "kiosk_devices_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_device_sessions" ADD CONSTRAINT "kiosk_device_sessions_kioskDeviceId_fkey" FOREIGN KEY ("kioskDeviceId") REFERENCES "kiosk_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_pin_attempts" ADD CONSTRAINT "kiosk_pin_attempts_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_pin_attempts" ADD CONSTRAINT "kiosk_pin_attempts_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_pin_attempts" ADD CONSTRAINT "kiosk_pin_attempts_kioskDeviceId_fkey" FOREIGN KEY ("kioskDeviceId") REFERENCES "kiosk_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_pin_attempts" ADD CONSTRAINT "kiosk_pin_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_clock_events" ADD CONSTRAINT "kiosk_clock_events_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_clock_events" ADD CONSTRAINT "kiosk_clock_events_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_clock_events" ADD CONSTRAINT "kiosk_clock_events_kioskDeviceId_fkey" FOREIGN KEY ("kioskDeviceId") REFERENCES "kiosk_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_clock_events" ADD CONSTRAINT "kiosk_clock_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_events" ADD CONSTRAINT "kiosk_events_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_events" ADD CONSTRAINT "kiosk_events_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_events" ADD CONSTRAINT "kiosk_events_kioskDeviceId_fkey" FOREIGN KEY ("kioskDeviceId") REFERENCES "kiosk_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_events" ADD CONSTRAINT "kiosk_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_event_ingests" ADD CONSTRAINT "kiosk_event_ingests_kioskDeviceId_fkey" FOREIGN KEY ("kioskDeviceId") REFERENCES "kiosk_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_ledger_entries" ADD CONSTRAINT "inventory_ledger_entries_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_ledger_entries" ADD CONSTRAINT "inventory_ledger_entries_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_ledger_entries" ADD CONSTRAINT "inventory_ledger_entries_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_ledger_entries" ADD CONSTRAINT "inventory_ledger_entries_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_sessions" ADD CONSTRAINT "count_sessions_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_sessions" ADD CONSTRAINT "count_sessions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_sessions" ADD CONSTRAINT "count_sessions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_sessions" ADD CONSTRAINT "count_sessions_finalizedById_fkey" FOREIGN KEY ("finalizedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_session_lines" ADD CONSTRAINT "count_session_lines_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "count_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_session_lines" ADD CONSTRAINT "count_session_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_session_lines" ADD CONSTRAINT "count_session_lines_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_session_lines" ADD CONSTRAINT "count_session_lines_countedById_fkey" FOREIGN KEY ("countedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_startedById_fkey" FOREIGN KEY ("startedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_voidedById_fkey" FOREIGN KEY ("voidedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_sessions" ADD CONSTRAINT "stocktake_sessions_glJournalEntryId_fkey" FOREIGN KEY ("glJournalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_lines" ADD CONSTRAINT "stocktake_lines_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "stocktake_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_lines" ADD CONSTRAINT "stocktake_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_lines" ADD CONSTRAINT "stocktake_lines_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_lines" ADD CONSTRAINT "stocktake_lines_countedById_fkey" FOREIGN KEY ("countedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_lines" ADD CONSTRAINT "stocktake_lines_ledgerEntryId_fkey" FOREIGN KEY ("ledgerEntryId") REFERENCES "inventory_ledger_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_lines" ADD CONSTRAINT "stocktake_lines_reversalEntryId_fkey" FOREIGN KEY ("reversalEntryId") REFERENCES "inventory_ledger_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders_v2" ADD CONSTRAINT "purchase_orders_v2_optimizationRunId_fkey" FOREIGN KEY ("optimizationRunId") REFERENCES "forecast_optimization_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transfer_lines" ADD CONSTRAINT "inventory_transfer_lines_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "inventory_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_waste" ADD CONSTRAINT "inventory_waste_glJournalEntryId_fkey" FOREIGN KEY ("glJournalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_waste_lines" ADD CONSTRAINT "inventory_waste_lines_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "inventory_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_inventory_depletions" ADD CONSTRAINT "order_inventory_depletions_glJournalEntryId_fkey" FOREIGN KEY ("glJournalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_items" ADD CONSTRAINT "prep_items_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_items" ADD CONSTRAINT "prep_items_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_items" ADD CONSTRAINT "prep_items_yieldUomId_fkey" FOREIGN KEY ("yieldUomId") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_items" ADD CONSTRAINT "prep_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_items" ADD CONSTRAINT "prep_items_output_inventory_item_id_fkey" FOREIGN KEY ("output_inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_lines" ADD CONSTRAINT "prep_lines_prepItemId_fkey" FOREIGN KEY ("prepItemId") REFERENCES "prep_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_lines" ADD CONSTRAINT "prep_lines_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_lines" ADD CONSTRAINT "prep_lines_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_forecast_snapshots" ADD CONSTRAINT "demand_forecast_snapshots_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_forecast_snapshots" ADD CONSTRAINT "demand_forecast_snapshots_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_forecast_snapshots" ADD CONSTRAINT "demand_forecast_snapshots_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_optimization_runs" ADD CONSTRAINT "forecast_optimization_runs_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_optimization_runs" ADD CONSTRAINT "forecast_optimization_runs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_optimization_runs" ADD CONSTRAINT "forecast_optimization_runs_usedSnapshotId_fkey" FOREIGN KEY ("usedSnapshotId") REFERENCES "demand_forecast_snapshots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_optimization_lines" ADD CONSTRAINT "forecast_optimization_lines_runId_fkey" FOREIGN KEY ("runId") REFERENCES "forecast_optimization_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_optimization_lines" ADD CONSTRAINT "forecast_optimization_lines_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_optimization_lines" ADD CONSTRAINT "forecast_optimization_lines_suggestedVendorId_fkey" FOREIGN KEY ("suggestedVendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lot_ledger_allocations" ADD CONSTRAINT "lot_ledger_allocations_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "inventory_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lot_ledger_allocations" ADD CONSTRAINT "lot_ledger_allocations_ledgerEntryId_fkey" FOREIGN KEY ("ledgerEntryId") REFERENCES "inventory_ledger_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_returns" ADD CONSTRAINT "vendor_returns_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_returns" ADD CONSTRAINT "vendor_returns_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_returns" ADD CONSTRAINT "vendor_returns_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_returns" ADD CONSTRAINT "vendor_returns_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_returns" ADD CONSTRAINT "vendor_returns_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_returns" ADD CONSTRAINT "vendor_returns_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_returns" ADD CONSTRAINT "vendor_returns_voidedById_fkey" FOREIGN KEY ("voidedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_return_lines" ADD CONSTRAINT "vendor_return_lines_vendorReturnId_fkey" FOREIGN KEY ("vendorReturnId") REFERENCES "vendor_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_return_lines" ADD CONSTRAINT "vendor_return_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_return_lines" ADD CONSTRAINT "vendor_return_lines_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_return_lines" ADD CONSTRAINT "vendor_return_lines_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "units_of_measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_return_lines" ADD CONSTRAINT "vendor_return_lines_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "inventory_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recall_cases" ADD CONSTRAINT "recall_cases_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recall_cases" ADD CONSTRAINT "recall_cases_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recall_cases" ADD CONSTRAINT "recall_cases_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recall_cases" ADD CONSTRAINT "recall_cases_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recall_lot_links" ADD CONSTRAINT "recall_lot_links_recallCaseId_fkey" FOREIGN KEY ("recallCaseId") REFERENCES "recall_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recall_lot_links" ADD CONSTRAINT "recall_lot_links_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "inventory_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recall_lot_links" ADD CONSTRAINT "recall_lot_links_linkedById_fkey" FOREIGN KEY ("linkedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_productionLocationId_fkey" FOREIGN KEY ("productionLocationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_outputItemId_fkey" FOREIGN KEY ("outputItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_outputUomId_fkey" FOREIGN KEY ("outputUomId") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_producedById_fkey" FOREIGN KEY ("producedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_voidedById_fkey" FOREIGN KEY ("voidedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batch_lines" ADD CONSTRAINT "production_batch_lines_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "production_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batch_lines" ADD CONSTRAINT "production_batch_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batch_lines" ADD CONSTRAINT "production_batch_lines_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batch_lines" ADD CONSTRAINT "production_batch_lines_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "inventory_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_batch_lines" ADD CONSTRAINT "production_batch_lines_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_barcodes" ADD CONSTRAINT "inventory_item_barcodes_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_barcodes" ADD CONSTRAINT "inventory_item_barcodes_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_barcodes" ADD CONSTRAINT "inventory_item_barcodes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_barcodes" ADD CONSTRAINT "inventory_lot_barcodes_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_barcodes" ADD CONSTRAINT "inventory_lot_barcodes_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "inventory_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_barcodes" ADD CONSTRAINT "inventory_lot_barcodes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_acknowledgedById_fkey" FOREIGN KEY ("acknowledgedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_periods" ADD CONSTRAINT "inventory_periods_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_periods" ADD CONSTRAINT "inventory_periods_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_periods" ADD CONSTRAINT "inventory_periods_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_valuation_snapshots" ADD CONSTRAINT "inventory_valuation_snapshots_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "inventory_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_valuation_snapshots" ADD CONSTRAINT "inventory_valuation_snapshots_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_valuation_snapshots" ADD CONSTRAINT "inventory_valuation_snapshots_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_period_movement_summaries" ADD CONSTRAINT "inventory_period_movement_summaries_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "inventory_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_period_movement_summaries" ADD CONSTRAINT "inventory_period_movement_summaries_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_period_close_requests" ADD CONSTRAINT "inventory_period_close_requests_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "inventory_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_period_events" ADD CONSTRAINT "inventory_period_events_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "inventory_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

