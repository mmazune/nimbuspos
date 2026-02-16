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
 * M12.7 Close Ops v3 Pages - UI Smoke Tests (Jest-compatible)
 *
 * Global mocks for AuthContext, api client, router are in jest.setup.ts
 */
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_query_1 = require("@tanstack/react-query");
const api_1 = require("@/lib/api");
const router_1 = require("next/router");
const mockedApiClient = api_1.apiClient;
const mockedUseRouter = router_1.useRouter;
// Mock the layout components
jest.mock('@/components/layout/AppShell', () => ({
    AppShell: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));
jest.mock('@/components/layout/PageHeader', () => ({
    PageHeader: ({ title }) => <h1 data-testid="page-header">{title}</h1>,
}));
jest.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({ toast: jest.fn() }),
}));
function createWrapper() {
    const queryClient = new react_query_1.QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (<react_query_1.QueryClientProvider client={queryClient}>{children}</react_query_1.QueryClientProvider>);
}
describe('M12.7 Blockers Check Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseRouter.mockReturnValue({
            pathname: '/inventory/period-dashboard',
            query: { id: 'period-test-1' },
            push: jest.fn(),
            replace: jest.fn(),
            isReady: true,
        });
        mockedApiClient.get.mockResolvedValue({
            data: {
                blockers: [],
                summary: { total: 0, byType: {} },
            },
        });
    });
    it('renders period dashboard with blockers section', async () => {
        const { default: PeriodDashboardPage } = await Promise.resolve().then(() => __importStar(require('../src/pages/inventory/period-dashboard')));
        (0, react_2.render)(<PeriodDashboardPage />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByTestId('page-header')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=m127-inventory-close-ops-v3-pages.test.js.map