import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleCapabilities } from '@/config/roleCapabilities';
import { isNavmapEnabled, recordSidebarLinks, startCapture } from '@/lib/navmap';

/**
 * M8.1: Config-driven Sidebar Navigation
 * 
 * Navigation is now fully driven by roleCapabilities.ts
 * No scattered if/else role checks - single source of truth
 * 
 * Phase I3: Navmap capture mode supported
 */
export function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  // M8.1: Get nav groups from roleCapabilities based on jobRole
  const capabilities = getRoleCapabilities(user?.jobRole);
  const navGroups = capabilities.navGroups;

  // Phase I3: Record sidebar links for navmap capture
  useEffect(() => {
    if (!isNavmapEnabled() || !user?.jobRole) return;

    // Start capture for this role
    startCapture(user.jobRole);

    // Record all sidebar links
    navGroups.forEach(group => {
      recordSidebarLinks(
        group.title,
        group.items.map(item => ({
          label: item.label,
          href: item.href,
          isActive: isActive(item.href),
        }))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.jobRole, navGroups]);

  // M8.6: Get role home route for logo click
  const roleHome = capabilities.defaultRoute;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r bg-nimbus-mist dark:bg-nimbus-navy flex flex-col transition-all duration-300">
      {/* Logo/Brand - M8.6: Clicking logo navigates to role home */}
      <div className="flex h-[64px] items-center border-b border-nimbus-navy/10 dark:border-white/10 px-6 bg-white dark:bg-nimbus-navy">
        <Link
          href={roleHome}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          aria-label="Go to workspace home"
          data-testid="sidebar-logo"
        >
          {/* Logo adherence: Navy/White only, no gradients */}
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-nimbus-navy text-white font-bold">
            N
          </div>
          <div>
            <h1 className="text-lg font-bold text-nimbus-navy dark:text-white tracking-tight">Nimbus POS</h1>
            <p className="text-[11px] uppercase tracking-wider text-nimbus-ink/60 dark:text-white/60 font-semibold">
              {user?.jobRole ? user.jobRole.replace('_', ' ') : 'Backoffice'}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation - M8.1: Grouped by roleCapabilities */}
      <nav aria-label="Primary" className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-bold text-nimbus-navy/50 dark:text-white/50 uppercase tracking-wider mb-3 px-3">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                      'min-h-[44px]', // Touch target size
                      active
                        ? 'bg-nimbus-blue text-white shadow-md shadow-nimbus-blue/20'
                        : 'text-nimbus-ink dark:text-gray-300 hover:bg-nimbus-blue/10 hover:text-nimbus-blue dark:hover:bg-white/10 dark:hover:text-white'
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active ? "text-white" : "text-current")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-nimbus-navy/10 dark:border-white/10 p-6 bg-nimbus-mist/50 dark:bg-nimbus-navy/50">
        <div className="text-xs text-nimbus-ink/50 dark:text-white/50 font-medium">
          <p>v0.1.0 (Nimbus)</p>
          <p className="mt-1">© 2025 ChefCloud</p>
        </div>
      </div>
    </aside>
  );
}
