"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * M11.12 Analytics + Alerts UI Smoke Tests (Jest-compatible)
 *
 * Verifies the analytics and alerts pages render without errors.
 * Global mocks for AuthContext, api client, router are in jest.setup.ts
 */
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_query_1 = require("@tanstack/react-query");
const api_1 = require("@/lib/api");
const mockedApiClient = api_1.apiClient;
// Mock the layout components
jest.mock('@/components/layout/AppShell', () => ({
    AppShell: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));
jest.mock('@/components/layout/PageHeader', () => ({
    PageHeader: ({ title, subtitle }) => (<div data-testid="page-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>),
}));
// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({ toast: jest.fn() }),
}));
function createWrapper() {
    const queryClient = new react_query_1.QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (<react_query_1.QueryClientProvider client={queryClient}>{children}</react_query_1.QueryClientProvider>);
}
describe('M11.12 Inventory Analytics Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedApiClient.get.mockImplementation((url) => {
            if (url.includes('/inventory/analytics/summary')) {
                return Promise.resolve({
                    data: {
                        shrink: { totalVarianceQty: '10.0000', totalVarianceValue: '50.0000', itemCount: 3 },
                        waste: { totalWasteQty: '5.0000', totalWasteValue: '25.0000', topItemsCount: 2 },
                        deadStock: { itemCount: 1, totalOnHand: '100.0000' },
                        expiryRisk: { expiredCount: 0, within7Count: 2, within30Count: 5, within60Count: 8 },
                        reorderHealth: { belowReorderCount: 4, suggestionRunsTotal: 10 },
                    },
                });
            }
            return Promise.resolve({ data: {} });
        });
    });
    it('renders analytics page with header', async () => {
        // Lazy import to allow mocks to be set up first
        const { default: InventoryAnalyticsPage } = await Promise.resolve().then(() => __importStar(require('../src/pages/inventory/analytics')));
        (0, react_2.render)(<InventoryAnalyticsPage />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByTestId('page-header')).toBeInTheDocument();
        });
    });
});
describe('M11.12 Inventory Alerts Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedApiClient.get.mockImplementation((url) => {
            if (url.includes('/inventory/alerts')) {
                return Promise.resolve({
                    data: {
                        items: [
                            {
                                id: 'alert-1',
                                type: 'DEAD_STOCK',
                                severity: 'WARN',
                                title: 'Dead stock: Test Item',
                                status: 'OPEN',
                                createdAt: '2024-01-15T10:00:00Z',
                            },
                        ],
                        total: 1,
                        page: 1,
                        pageSize: 20,
                    },
                });
            }
            return Promise.resolve({ data: {} });
        });
    });
    it('renders alerts page with header', async () => {
        const { default: InventoryAlertsPage } = await Promise.resolve().then(() => __importStar(require('../src/pages/inventory/alerts')));
        (0, react_2.render)(<InventoryAlertsPage />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByTestId('page-header')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=m1112-analytics-alerts-pages.test.js.map