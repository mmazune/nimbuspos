"use strict";
/**
 * Route Index Builder
 *
 * Reads all 11 *.runtime.json files and generates:
 * - navmap.routes.index.json - Machine-readable index
 * - navmap.routes.index.md - Human-readable documentation
 *
 * Usage: npx tsx scripts/build-route-index.ts
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
const glob = __importStar(require("glob"));
const RUNTIME_DIR = path.resolve(__dirname, '../reports/navigation/runtime');
const OUTPUT_DIR = path.resolve(__dirname, '../docs/navmap');
function loadRuntimeFiles() {
    const files = glob.sync('*.runtime.json', { cwd: RUNTIME_DIR });
    const runtimes = [];
    for (const file of files) {
        const filePath = path.join(RUNTIME_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        runtimes.push(JSON.parse(content));
    }
    return runtimes;
}
function buildRouteIndex(runtimes) {
    const routeMap = new Map();
    const sidebarMap = new Map();
    const rolesSummary = {};
    for (const runtime of runtimes) {
        const role = runtime.role;
        rolesSummary[role] = {
            routeCount: runtime.routesVisited.length,
            sidebarLinkCount: runtime.sidebarLinks.length,
        };
        // Process routes
        for (const route of runtime.routesVisited) {
            if (!routeMap.has(route)) {
                routeMap.set(route, {
                    route,
                    roles: [],
                    navGroups: [],
                    sidebarLabels: [],
                    isDynamic: route.includes('['),
                });
            }
            const info = routeMap.get(route);
            if (!info.roles.includes(role)) {
                info.roles.push(role);
            }
        }
        // Process sidebar links
        for (const link of runtime.sidebarLinks) {
            const key = link.href;
            if (!sidebarMap.has(key)) {
                sidebarMap.set(key, {
                    href: link.href,
                    label: link.label,
                    navGroup: link.navGroup,
                    roles: [],
                });
            }
            const sidebarInfo = sidebarMap.get(key);
            if (!sidebarInfo.roles.includes(role)) {
                sidebarInfo.roles.push(role);
            }
            // Also update route info with nav group and label
            if (routeMap.has(link.href)) {
                const routeInfo = routeMap.get(link.href);
                if (!routeInfo.navGroups.includes(link.navGroup)) {
                    routeInfo.navGroups.push(link.navGroup);
                }
                if (!routeInfo.sidebarLabels.includes(link.label)) {
                    routeInfo.sidebarLabels.push(link.label);
                }
            }
        }
    }
    const routes = Array.from(routeMap.values()).sort((a, b) => a.route.localeCompare(b.route));
    const sidebarLinks = Array.from(sidebarMap.values()).sort((a, b) => a.href.localeCompare(b.href));
    return {
        generatedAt: new Date().toISOString(),
        totalRoles: runtimes.length,
        totalUniqueRoutes: routes.length,
        totalSidebarLinks: sidebarLinks.length,
        routes,
        sidebarLinks,
        rolesSummary,
    };
}
function generateMarkdown(index) {
    const lines = [
        '# NavMap Route Index',
        '',
        `Generated: ${index.generatedAt}`,
        '',
        '## Summary',
        '',
        `- **Total Roles**: ${index.totalRoles}`,
        `- **Unique Routes**: ${index.totalUniqueRoutes}`,
        `- **Unique Sidebar Links**: ${index.totalSidebarLinks}`,
        '',
        '## Roles Overview',
        '',
        '| Role | Routes | Sidebar Links |',
        '|------|--------|---------------|',
    ];
    for (const [role, summary] of Object.entries(index.rolesSummary).sort()) {
        lines.push(`| ${role} | ${summary.routeCount} | ${summary.sidebarLinkCount} |`);
    }
    lines.push('');
    lines.push('## All Routes');
    lines.push('');
    lines.push('| Route | Roles | Nav Groups | Dynamic |');
    lines.push('|-------|-------|------------|---------|');
    for (const route of index.routes) {
        const roles = route.roles.length > 3
            ? `${route.roles.slice(0, 3).join(', ')}...`
            : route.roles.join(', ');
        const navGroups = route.navGroups.join(', ') || '-';
        lines.push(`| \`${route.route}\` | ${roles} | ${navGroups} | ${route.isDynamic ? '✓' : ''} |`);
    }
    lines.push('');
    lines.push('## Sidebar Links');
    lines.push('');
    lines.push('| Link | Label | Nav Group | Roles |');
    lines.push('|------|-------|-----------|-------|');
    for (const link of index.sidebarLinks) {
        const roles = link.roles.length > 3
            ? `${link.roles.slice(0, 3).join(', ')}...`
            : link.roles.join(', ');
        lines.push(`| \`${link.href}\` | ${link.label} | ${link.navGroup} | ${roles} |`);
    }
    return lines.join('\n');
}
async function main() {
    console.log('Building route index...');
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    // Load all runtime files
    const runtimes = loadRuntimeFiles();
    console.log(`Loaded ${runtimes.length} runtime files`);
    // Build the index
    const index = buildRouteIndex(runtimes);
    // Write JSON
    const jsonPath = path.join(OUTPUT_DIR, 'navmap.routes.index.json');
    fs.writeFileSync(jsonPath, JSON.stringify(index, null, 2));
    console.log(`Written: ${jsonPath}`);
    // Write Markdown
    const mdPath = path.join(OUTPUT_DIR, 'navmap.routes.index.md');
    fs.writeFileSync(mdPath, generateMarkdown(index));
    console.log(`Written: ${mdPath}`);
    console.log('\nRoute Index Summary:');
    console.log(`- Total Roles: ${index.totalRoles}`);
    console.log(`- Unique Routes: ${index.totalUniqueRoutes}`);
    console.log(`- Unique Sidebar Links: ${index.totalSidebarLinks}`);
}
main().catch(console.error);
//# sourceMappingURL=build-route-index.js.map