import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Moon, Sun, User, LogOut, ChevronDown } from 'lucide-react';
import { broadcastSessionEvent } from '@/lib/sessionBroadcast';

export function Topbar() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    // M32-SEC-S3: broadcast logout to other tabs
    broadcastSessionEvent('logout');

    await logout();
  };

  return (
    <header
      data-testid="topbar"
      className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-nimbus-navy/10 dark:border-white/10 bg-white/80 dark:bg-nimbus-navy/90 backdrop-blur-md px-6 transition-colors duration-300"
    >
      {/* Branch/Org Info */}
      <div className="flex items-center space-x-4" data-testid="topbar-org-info">
        {user?.branch && (
          <div>
            <p className="text-sm font-bold text-nimbus-navy dark:text-white leading-tight">{user.branch.name}</p>
            <p className="text-xs font-medium text-nimbus-ink/60 dark:text-white/60">{user.org.name}</p>
          </div>
        )}
        {!user?.branch && user?.org && (
          <div>
            <p className="text-sm font-bold text-nimbus-navy dark:text-white">{user.org.name}</p>
            <p className="text-xs font-medium text-nimbus-ink/60 dark:text-white/60">All Branches</p>
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4" data-testid="topbar-actions">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          data-testid="theme-toggle-btn"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="text-nimbus-navy dark:text-white hover:bg-nimbus-mist dark:hover:bg-white/10"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* User Menu */}
        <div className="relative" data-testid="user-menu-container">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 rounded-full pl-1 pr-3 py-1 hover:bg-nimbus-mist dark:hover:bg-white/10 transition-all border border-transparent hover:border-nimbus-navy/10"
            data-testid="user-menu-trigger"
            aria-label={`User menu for ${user?.displayName}`}
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nimbus-blue text-white shadow-sm">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-nimbus-navy dark:text-white" data-testid="user-display-name">{user?.displayName}</p>
              <p className="text-[10px] uppercase font-bold text-nimbus-blue dark:text-nimbus-violet tracking-wide" data-testid="user-role-level">{user?.roleLevel}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-nimbus-ink/40 dark:text-white/40" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
                data-testid="user-menu-backdrop"
              />
              {/* Menu */}
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg border bg-popover p-1 shadow-lg z-50"
                role="menu"
                data-testid="user-menu-dropdown"
                aria-label="User menu"
              >
                <div className="px-3 py-2 border-b" data-testid="user-menu-header">
                  <p className="text-sm font-medium">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    role="menuitem"
                    data-testid="logout-btn"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
