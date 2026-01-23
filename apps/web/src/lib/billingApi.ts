import {
  BillingPlanDto,
  OrgSubscriptionDto,
  BillingUsageDto,
  PlanChangeQuoteDto,
  BillingPlanId,
} from "@/types/billing";
import { handleAuthHttpError } from "@/lib/authHttpError";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const AUTH_TOKEN_KEY = "auth_token";

/**
 * Get headers with auth token for API requests
 */
function getAuthHeaders(): HeadersInit {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchBillingPlans(): Promise<BillingPlanDto[]> {
  const res = await fetch(`${API_URL}/billing/plans`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (res.status === 401 || res.status === 419) {
    handleAuthHttpError(res.status);
    throw new Error('Unauthorized');
  }

  return handleJson<BillingPlanDto[]>(res);
}

export async function fetchOrgSubscription(): Promise<OrgSubscriptionDto> {
  const res = await fetch(`${API_URL}/billing/subscription`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (res.status === 401 || res.status === 419) {
    handleAuthHttpError(res.status);
    throw new Error('Unauthorized');
  }

  return handleJson<OrgSubscriptionDto>(res);
}

export async function fetchBillingUsage(): Promise<BillingUsageDto> {
  const res = await fetch(`${API_URL}/billing/usage`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (res.status === 401 || res.status === 419) {
    handleAuthHttpError(res.status);
    throw new Error('Unauthorized');
  }

  return handleJson<BillingUsageDto>(res);
}

export async function fetchPlanChangeQuote(
  targetPlanId: BillingPlanId,
): Promise<PlanChangeQuoteDto> {
  const res = await fetch(`${API_URL}/billing/plan/quote`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ targetPlanId }),
  });

  if (res.status === 401 || res.status === 419) {
    handleAuthHttpError(res.status);
    throw new Error('Unauthorized');
  }

  return handleJson<PlanChangeQuoteDto>(res);
}

export async function applyPlanChange(
  targetPlanId: BillingPlanId,
): Promise<OrgSubscriptionDto> {
  const res = await fetch(`${API_URL}/billing/plan/change`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ planCode: targetPlanId }),
  });

  if (res.status === 401 || res.status === 419) {
    handleAuthHttpError(res.status);
    throw new Error('Unauthorized');
  }

  return handleJson<OrgSubscriptionDto>(res);
}
