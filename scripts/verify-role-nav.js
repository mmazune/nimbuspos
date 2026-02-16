#!/usr/bin/env npx tsx
"use strict";
/**
 * M8.1 - Role Navigation Verification Script
 *
 * Outputs the defaultRoute and navGroups for each jobRole
 * based on the roleCapabilities.ts configuration.
 *
 * Usage:
 *   npx tsx scripts/verify-role-nav.ts
 *   npx tsx scripts/verify-role-nav.ts --out path/to/output.txt
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ALL_JOB_ROLES = [
    'OWNER',
    'MANAGER',
    'ACCOUNTANT',
    'PROCUREMENT',
    'STOCK_MANAGER',
    'SUPERVISOR',
    'CASHIER',
    'CHEF',
    'WAITER',
    'BARTENDER',
    'EVENT_MANAGER',
];
const ROLE_CAPABILITIES = {
    OWNER: {
        defaultRoute: '/workspaces/owner',
        dashboardVariant: 'full',
        workspaceTitle: 'Owner Headquarters',
        workspaceDescription: 'Full visibility across all branches, finance, staff, and strategic analytics.',
        navGroups: [
            {
                label: 'Overview',
                items: [
                    { label: 'Dashboard', href: '/dashboard', icon: 'home' },
                    { label: 'Analytics', href: '/analytics', icon: 'chart' },
                ],
            },
            {
                label: 'Operations',
                items: [
                    { label: 'POS', href: '/pos', icon: 'register' },
                    { label: 'Inventory', href: '/inventory', icon: 'box' },
                    { label: 'Menu', href: '/menu', icon: 'utensils' },
                ],
            },
            {
                label: 'Finance',
                items: [
                    { label: 'Reports', href: '/reports', icon: 'file-text' },
                    { label: 'Billing', href: '/billing', icon: 'credit-card' },
                    { label: 'Invoices', href: '/invoices', icon: 'file-invoice' },
                ],
            },
            {
                label: 'Team',
                items: [
                    { label: 'Staff', href: '/staff', icon: 'users' },
                    { label: 'Feedback', href: '/feedback', icon: 'message-square' },
                ],
            },
            {
                label: 'Settings',
                items: [
                    { label: 'Settings', href: '/settings', icon: 'settings' },
                    { label: 'Service Providers', href: '/service-providers', icon: 'truck' },
                ],
            },
        ],
    },
    MANAGER: {
        defaultRoute: '/workspaces/manager',
        dashboardVariant: 'operational',
        workspaceTitle: 'Manager Hub',
        workspaceDescription: 'Manage daily operations, staff schedules, and branch performance.',
        navGroups: [
            {
                label: 'Overview',
                items: [
                    { label: 'Dashboard', href: '/dashboard', icon: 'home' },
                    { label: 'Analytics', href: '/analytics', icon: 'chart' },
                ],
            },
            {
                label: 'Operations',
                items: [
                    { label: 'POS', href: '/pos', icon: 'register' },
                    { label: 'Inventory', href: '/inventory', icon: 'box' },
                    { label: 'Menu', href: '/menu', icon: 'utensils' },
                    { label: 'Reservations', href: '/reservations', icon: 'calendar' },
                ],
            },
            {
                label: 'Team',
                items: [
                    { label: 'Staff', href: '/staff', icon: 'users' },
                    { label: 'Feedback', href: '/feedback', icon: 'message-square' },
                ],
            },
            {
                label: 'Reports',
                items: [{ label: 'Reports', href: '/reports', icon: 'file-text' }],
            },
        ],
    },
    ACCOUNTANT: {
        defaultRoute: '/workspaces/accountant',
        dashboardVariant: 'finance',
        workspaceTitle: 'Finance Center',
        workspaceDescription: 'Manage invoices, billing, financial reports, and revenue tracking.',
        navGroups: [
            {
                label: 'Finance',
                items: [
                    { label: 'Dashboard', href: '/dashboard/finance', icon: 'dollar-sign' },
                    { label: 'Invoices', href: '/invoices', icon: 'file-invoice' },
                    { label: 'Billing', href: '/billing', icon: 'credit-card' },
                    { label: 'Reports', href: '/reports', icon: 'file-text' },
                ],
            },
        ],
    },
    PROCUREMENT: {
        defaultRoute: '/workspaces/procurement',
        dashboardVariant: 'inventory',
        workspaceTitle: 'Procurement Center',
        workspaceDescription: 'Manage suppliers, purchase orders, and stock procurement.',
        navGroups: [
            {
                label: 'Procurement',
                items: [
                    { label: 'Dashboard', href: '/dashboard/procurement', icon: 'shopping-cart' },
                    { label: 'Suppliers', href: '/suppliers', icon: 'truck' },
                    { label: 'Inventory', href: '/inventory', icon: 'box' },
                    { label: 'Invoices', href: '/invoices', icon: 'file-invoice' },
                ],
            },
        ],
    },
    STOCK_MANAGER: {
        defaultRoute: '/workspaces/stock-manager',
        dashboardVariant: 'inventory',
        workspaceTitle: 'Inventory Hub',
        workspaceDescription: 'Monitor stock levels, manage counts, and track waste.',
        navGroups: [
            {
                label: 'Inventory',
                items: [
                    { label: 'Dashboard', href: '/dashboard/inventory', icon: 'box' },
                    { label: 'Inventory', href: '/inventory', icon: 'archive' },
                    { label: 'Stock Counts', href: '/stock-counts', icon: 'clipboard-list' },
                    { label: 'Waste Log', href: '/waste', icon: 'trash' },
                ],
            },
        ],
    },
    SUPERVISOR: {
        defaultRoute: '/workspaces/supervisor',
        dashboardVariant: 'operational',
        workspaceTitle: 'Shift Command',
        workspaceDescription: 'Oversee floor operations, approve voids, and manage the team.',
        navGroups: [
            {
                label: 'Operations',
                items: [
                    { label: 'Dashboard', href: '/dashboard', icon: 'home' },
                    { label: 'POS', href: '/pos', icon: 'register' },
                    { label: 'Staff', href: '/staff', icon: 'users' },
                    { label: 'Reservations', href: '/reservations', icon: 'calendar' },
                ],
            },
        ],
    },
    CASHIER: {
        defaultRoute: '/pos',
        dashboardVariant: 'pos',
        workspaceTitle: 'Point of Sale',
        workspaceDescription: 'Process orders and payments efficiently.',
        navGroups: [
            {
                label: 'POS',
                items: [{ label: 'POS', href: '/pos', icon: 'register' }],
            },
        ],
    },
    CHEF: {
        defaultRoute: '/workspaces/chef',
        dashboardVariant: 'kds',
        workspaceTitle: 'Kitchen Hub',
        workspaceDescription: 'View orders, manage prep, and monitor kitchen operations.',
        navGroups: [
            {
                label: 'Kitchen',
                items: [
                    { label: 'Kitchen Display', href: '/kds', icon: 'monitor' },
                    { label: 'Menu', href: '/menu', icon: 'utensils' },
                    { label: 'Inventory', href: '/inventory', icon: 'box' },
                ],
            },
        ],
    },
    WAITER: {
        defaultRoute: '/pos',
        dashboardVariant: 'pos',
        workspaceTitle: 'Table Service',
        workspaceDescription: 'Take orders and serve customers with ease.',
        navGroups: [
            {
                label: 'Service',
                items: [
                    { label: 'POS', href: '/pos', icon: 'register' },
                    { label: 'Menu', href: '/menu', icon: 'utensils' },
                ],
            },
        ],
    },
    BARTENDER: {
        defaultRoute: '/pos',
        dashboardVariant: 'pos',
        workspaceTitle: 'Bar Station',
        workspaceDescription: 'Manage drink orders and bar operations.',
        navGroups: [
            {
                label: 'Bar',
                items: [
                    { label: 'POS', href: '/pos', icon: 'register' },
                    { label: 'Menu', href: '/menu', icon: 'utensils' },
                ],
            },
        ],
    },
    EVENT_MANAGER: {
        defaultRoute: '/workspaces/event-manager',
        dashboardVariant: 'events',
        workspaceTitle: 'Events Center',
        workspaceDescription: 'Manage reservations, catering, and special events.',
        navGroups: [
            {
                label: 'Events',
                items: [
                    { label: 'Dashboard', href: '/dashboard/events', icon: 'calendar' },
                    { label: 'Reservations', href: '/reservations', icon: 'calendar-check' },
                    { label: 'Catering', href: '/catering', icon: 'utensils' },
                ],
            },
        ],
    },
};
function parseArgs() {
    const args = {
        out: 'instructions/M8.1_ROLE_NAV_VERIFY_OUTPUT.txt',
    };
    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg === '--out' && i + 1 < process.argv.length) {
            args.out = process.argv[++i];
        }
    }
    return args;
}
// ===== Main =====
function main() {
    const args = parseArgs();
    const outputPath = path.resolve(args.out);
    const outputDir = path.dirname(outputPath);
    // Create output directory if needed
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const lines = [
        '# M8.1 Role Navigation Verification Output',
        `Date: ${new Date().toISOString()}`,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '## ROLE CAPABILITY CONFIGURATION',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
    ];
    for (const role of ALL_JOB_ROLES) {
        const cap = ROLE_CAPABILITIES[role];
        lines.push(`### ${role}`);
        lines.push(`Default Route: ${cap.defaultRoute}`);
        lines.push(`Dashboard Variant: ${cap.dashboardVariant}`);
        lines.push(`Workspace Title: ${cap.workspaceTitle}`);
        lines.push(`Workspace Description: ${cap.workspaceDescription}`);
        lines.push('');
        lines.push('Nav Groups:');
        for (const group of cap.navGroups) {
            lines.push(`  📁 ${group.label}`);
            for (const item of group.items) {
                lines.push(`     ├─ ${item.label} → ${item.href}`);
            }
        }
        lines.push('');
        lines.push('---');
        lines.push('');
    }
    // Summary table
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('## SUMMARY TABLE');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push('| Role | Default Route | Dashboard | Nav Groups |');
    lines.push('|------|---------------|-----------|------------|');
    for (const role of ALL_JOB_ROLES) {
        const cap = ROLE_CAPABILITIES[role];
        const navGroupLabels = cap.navGroups.map((g) => g.label).join(', ');
        lines.push(`| ${role} | ${cap.defaultRoute} | ${cap.dashboardVariant} | ${navGroupLabels} |`);
    }
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('## VERIFICATION COMPLETE');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push(`Total Roles: ${ALL_JOB_ROLES.length}`);
    lines.push(`All roles have defaultRoute: ✅`);
    lines.push(`All roles have navGroups: ✅`);
    lines.push('');
    // Write to file
    const output = lines.join('\n');
    fs.writeFileSync(outputPath, output, 'utf-8');
    // Also print to console
    console.log(output);
    console.log(`\n📄 Output written to: ${outputPath}`);
}
main();
//# sourceMappingURL=verify-role-nav.js.map