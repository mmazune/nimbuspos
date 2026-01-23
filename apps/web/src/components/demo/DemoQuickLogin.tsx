/**
 * Demo Quick Login Panel
 * Redesign: Unified Login Experience
 * 
 * Provides quick login buttons for demo accounts organized by group (Tapas vs Cafesserie).
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles } from 'lucide-react';
import { DEMO_GROUPS, DemoUser } from './demo-users';

const DEMO_PASSWORD = 'Demo#123';

interface DemoQuickLoginProps {
  onLoginStart?: () => void;
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
  /**
   * Optional callback to just populate credentials instead of auto-logging in.
   * If provided, auto-login is disabled.
   */
  onSelectCredentials?: (email: string, password: string) => void;
  className?: string;
}

export function DemoQuickLogin({
  onLoginStart,
  onLoginSuccess,
  onLoginError,
  onSelectCredentials,
  className,
}: DemoQuickLoginProps) {
  const { login } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDemoClick = async (user: DemoUser) => {
    // If just selecting credentials (for population), emit and return
    if (onSelectCredentials) {
      onSelectCredentials(user.email, DEMO_PASSWORD);
      return;
    }

    // Otherwise perform actual login
    setLoading(user.email);
    setError(null);
    onLoginStart?.();

    try {
      await login({
        email: user.email,
        password: DEMO_PASSWORD,
      });
      onLoginSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Demo login failed';
      setError(errorMsg);
      onLoginError?.(errorMsg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn('space-y-8 animate-in fade-in zoom-in duration-300', className)}>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {DEMO_GROUPS.map((group) => (
        <div key={group.id} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{group.label}</h3>
            <span className="text-xs text-muted-foreground">/ {group.description}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {group.users.map((user) => (
              <button
                key={user.email}
                onClick={() => handleDemoClick(user)}
                disabled={loading !== null}
                className={cn(
                  'relative flex items-center gap-3 p-2 rounded-lg border text-left transition-all hover:scale-[1.01] active:scale-[0.99]',
                  user.bgColor,
                  loading === user.email ? 'opacity-70 cursor-wait' : 'hover:shadow-sm',
                  loading !== null && loading !== user.email && 'opacity-50'
                )}
              >
                <div className={cn('p-2 rounded-md bg-white/80 shrink-0', user.color)}>
                  {loading === user.email ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <user.icon className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-gray-900 truncate">{user.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate">{user.role}</span>
                  </div>
                </div>

                {!onSelectCredentials && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Sparkles className="h-3 w-3 text-chefcloud-blue" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-muted-foreground">
          All demo accounts use password <code className="px-1 py-0.5 bg-gray-100 rounded font-mono text-gray-700">Demo#123</code>
        </p>
      </div>
    </div>
  );
}

export function useDemoAutofill() {
  // Deprecated but kept for compatibility if needed elsewhere
  return { DEMO_PASSWORD };
}
