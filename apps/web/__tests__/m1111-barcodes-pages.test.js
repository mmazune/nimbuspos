"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * M11.11 Barcodes UI Smoke Tests
 *
 * Verifies the barcodes page renders without errors and shows core UI elements.
 */
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_query_1 = require("@tanstack/react-query");
const barcodes_1 = __importDefault(require("../src/pages/inventory/barcodes"));
const api_1 = require("@/lib/api");
// Get the mocked apiClient from jest.setup.ts
const mockedApiClient = api_1.apiClient;
// Mock the layout components
jest.mock('@/components/layout/AppShell', () => ({
    AppShell: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));
jest.mock('@/components/layout/PageHeader', () => ({
    PageHeader: ({ title, subtitle }) => (<div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>),
}));
// Create a wrapper with QueryClient
function createWrapper() {
    const queryClient = new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }) => (<react_query_1.QueryClientProvider client={queryClient}>{children}</react_query_1.QueryClientProvider>);
}
describe('InventoryBarcodesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup specific API responses for these tests
        mockedApiClient.get.mockImplementation((url) => {
            if (url.includes('/inventory/barcodes') && !url.includes('resolve') && !url.includes('export')) {
                return Promise.resolve({
                    data: {
                        items: [
                            {
                                id: 'bc-1',
                                value: '1234567890123',
                                format: 'EAN13',
                                type: 'ITEM',
                                entityId: 'item-1',
                                entityName: 'Test Item',
                                entitySku: 'SKU-001',
                                isPrimary: true,
                                createdAt: '2024-01-15T10:00:00Z',
                            },
                            {
                                id: 'bc-2',
                                value: 'LOT-2024-001',
                                format: 'CODE128',
                                type: 'LOT',
                                entityId: 'lot-1',
                                entityName: 'Test Lot',
                                isPrimary: false,
                                createdAt: '2024-01-15T10:00:00Z',
                            },
                        ],
                        total: 2,
                    },
                });
            }
            if (url.includes('/inventory/items')) {
                return Promise.resolve({
                    data: [
                        { id: 'item-1', name: 'Test Item', sku: 'SKU-001' },
                        { id: 'item-2', name: 'Another Item', sku: 'SKU-002' },
                    ],
                });
            }
            if (url.includes('resolve')) {
                return Promise.resolve({
                    data: {
                        type: 'ITEM',
                        itemId: 'item-1',
                        name: 'Test Item',
                        sku: 'SKU-001',
                        isActive: true,
                    },
                });
            }
            return Promise.resolve({ data: {} });
        });
        mockedApiClient.post.mockResolvedValue({ data: { id: 'new-bc', value: 'NEW-BARCODE' } });
        mockedApiClient.delete.mockResolvedValue({});
    });
    it('renders page header with correct title', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByText('Inventory Barcodes')).toBeInTheDocument();
            expect(react_2.screen.getByText('Manage barcode mappings for items and lots')).toBeInTheDocument();
        });
    });
    it('renders scanner input', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByPlaceholderText(/scan or enter barcode/i)).toBeInTheDocument();
            expect(react_2.screen.getByRole('button', { name: /resolve/i })).toBeInTheDocument();
        });
    });
    it('renders action buttons', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
            expect(react_2.screen.getByRole('button', { name: /add barcode/i })).toBeInTheDocument();
        });
    });
    it('displays barcodes in the table', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByText('1234567890123')).toBeInTheDocument();
            expect(react_2.screen.getByText('LOT-2024-001')).toBeInTheDocument();
            expect(react_2.screen.getByText('Test Item')).toBeInTheDocument();
        });
    });
    it('shows barcode format badges', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByText('EAN13')).toBeInTheDocument();
            expect(react_2.screen.getByText('CODE128')).toBeInTheDocument();
        });
    });
    it('shows type badges (ITEM/LOT)', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByText('ITEM')).toBeInTheDocument();
            expect(react_2.screen.getByText('LOT')).toBeInTheDocument();
        });
    });
    it('shows primary badge for primary barcode', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByText('Primary')).toBeInTheDocument();
        });
    });
    it('has search input for filtering', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByPlaceholderText(/search barcodes/i)).toBeInTheDocument();
        });
    });
    it('opens add barcode dialog on button click', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByRole('button', { name: /add barcode/i })).toBeInTheDocument();
        });
        react_2.fireEvent.click(react_2.screen.getByRole('button', { name: /add barcode/i }));
        await (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByText('Add Item Barcode')).toBeInTheDocument();
        });
    });
});
describe('Barcode Scanner Simulation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedApiClient.get.mockImplementation((url) => {
            if (url.includes('/inventory/barcodes') && !url.includes('resolve') && !url.includes('export')) {
                return Promise.resolve({
                    data: {
                        items: [
                            {
                                id: 'bc-1',
                                value: '1234567890123',
                                format: 'EAN13',
                                type: 'ITEM',
                                entityId: 'item-1',
                                entityName: 'Test Item',
                                entitySku: 'SKU-001',
                                isPrimary: true,
                                createdAt: '2024-01-15T10:00:00Z',
                            },
                        ],
                        total: 1,
                    },
                });
            }
            if (url.includes('resolve')) {
                return Promise.resolve({
                    data: {
                        type: 'ITEM',
                        itemId: 'item-1',
                        name: 'Test Item',
                        sku: 'SKU-001',
                        isActive: true,
                    },
                });
            }
            return Promise.resolve({ data: {} });
        });
    });
    it('resolves barcode and shows result', async () => {
        (0, react_2.render)(<barcodes_1.default />, { wrapper: createWrapper() });
        const input = await react_2.screen.findByPlaceholderText(/scan or enter barcode/i);
        const button = react_2.screen.getByRole('button', { name: /resolve/i });
        react_2.fireEvent.change(input, { target: { value: '1234567890123' } });
        react_2.fireEvent.click(button);
        await (0, react_2.waitFor)(() => {
            // Check for resolved item info
            expect(react_2.screen.getByText('Test Item')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=m1111-barcodes-pages.test.js.map