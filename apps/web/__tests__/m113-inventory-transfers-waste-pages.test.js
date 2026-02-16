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
 * M11.3 Inventory Transfers + Waste Pages UI Smoke Tests (Jest-compatible)
 *
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
describe('M11.3 Inventory Transfers Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedApiClient.get.mockResolvedValue({ data: [] });
    });
    it('renders transfers list page', async () => {
        const { default: TransfersPage } = await Promise.resolve().then(() => __importStar(require('../src/pages/inventory/transfers')));
        (0, react_2.render)(<TransfersPage />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByTestId('page-header')).toBeInTheDocument();
        });
    });
});
describe('M11.3 Waste Log Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedApiClient.get.mockResolvedValue({ data: [] });
    });
    it('renders waste log page', async () => {
        const { default: WasteLogPage } = await Promise.resolve().then(() => __importStar(require('../src/pages/inventory/waste')));
        (0, react_2.render)(<WasteLogPage />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByTestId('page-header')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=m113-inventory-transfers-waste-pages.test.js.map