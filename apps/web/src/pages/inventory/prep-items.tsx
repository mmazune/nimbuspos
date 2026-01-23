/**
 * M80: Prep Items Page
 * 
 * Provides UI for managing prep items (semi-finished goods):
 * - List active prep items
 * - View prep item details with ingredient lines
 * - Create new prep items (Phase 1 minimal)
 * - RBAC: Chef + Accountant can view, Chef can create
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { Plus, Search, ChevronDown, ChevronRight } from 'lucide-react';

interface PrepLine {
    id: string;
    inventoryItemId: string;
    qty: string;
    uomId: string;
    notes: string | null;
    inventoryItem: {
        id: string;
        name: string;
        sku: string;
    };
    uom: {
        id: string;
        code: string;
        name: string;
    };
}

interface PrepItem {
    id: string;
    name: string;
    yieldQty: string;
    yieldUomId: string;
    prepMinutes: number;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
    branch: {
        id: string;
        name: string;
    };
    yieldUom: {
        id: string;
        code: string;
        name: string;
    };
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
    lines: PrepLine[];
}

// M81: Cost breakdown for prep items
interface PrepItemCost {
    totalCost: number;
    costPerYieldUnit: number;
    ingredientCosts: Array<{
        inventoryItemId: string;
        itemName: string;
        qty: string;
        unitCost: number;
        lineCost: number;
    }>;
}

interface InventoryItem {
    id: string;
    name: string;
    sku: string | null;
}

interface Branch {
    id: string;
    name: string;
}

interface UOM {
    id: string;
    code: string;
    name: string;
}

export default function PrepItemsPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [dialogOpen, setDialogOpen] = useState(false);

    // Form state
    const [formBranchId, setFormBranchId] = useState('');
    const [formName, setFormName] = useState('');
    const [formYieldQty, setFormYieldQty] = useState('1');
    const [formYieldUomId, setFormYieldUomId] = useState('');
    const [formPrepMinutes, setFormPrepMinutes] = useState('30');
    const [formLines, setFormLines] = useState<Array<{
        inventoryItemId: string;
        qty: string;
        uomId: string;
        notes: string;
    }>>([]);

    // Fetch prep items
    const { data, isLoading } = useQuery({
        queryKey: ['prep-items', search],
        queryFn: async () => {
            const params: Record<string, string> = {
                includeLines: 'true',
                isActive: 'true',
            };
            if (search) params.search = search;
            const response = await apiClient.get<{ items: PrepItem[]; total: number }>(
                '/inventory/prep-items',
                { params }
            );
            return response.data;
        },
    });

    // Fetch branches for dropdown
    const { data: branches } = useQuery({
        queryKey: ['branches-list'],
        queryFn: async () => {
            const response = await apiClient.get<Branch[]>('/branches');
            return response.data;
        },
    });

    // Fetch items for dropdown
    const { data: items } = useQuery({
        queryKey: ['inventory-items-list'],
        queryFn: async () => {
            const response = await apiClient.get<InventoryItem[]>('/inventory/items');
            return response.data;
        },
    });

    // Fetch UOMs for dropdown
    const { data: uoms } = useQuery({
        queryKey: ['uoms-list'],
        queryFn: async () => {
            const response = await apiClient.get<UOM[]>('/inventory/foundation/uoms');
            return response.data;
        },
    });

    // Create prep item mutation
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post('/inventory/prep-items', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prep-items'] });
            setDialogOpen(false);
            resetForm();
        },
    });

    const resetForm = () => {
        setFormBranchId('');
        setFormName('');
        setFormYieldQty('1');
        setFormYieldUomId('');
        setFormPrepMinutes('30');
        setFormLines([]);
    };

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const addLine = () => {
        setFormLines([...formLines, { inventoryItemId: '', qty: '1', uomId: '', notes: '' }]);
    };

    const removeLine = (index: number) => {
        setFormLines(formLines.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: string, value: string) => {
        const updated = [...formLines];
        updated[index] = { ...updated[index], [field]: value };
        setFormLines(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formBranchId || !formName || !formYieldUomId || formLines.length === 0) {
            alert('Please fill in all required fields and add at least one ingredient');
            return;
        }

        const payload = {
            branchId: formBranchId,
            name: formName,
            yieldQty: formYieldQty,
            yieldUomId: formYieldUomId,
            prepMinutes: parseInt(formPrepMinutes),
            lines: formLines.map(line => ({
                inventoryItemId: line.inventoryItemId,
                qty: line.qty,
                uomId: line.uomId,
                notes: line.notes || undefined,
            })),
        };

        createMutation.mutate(payload);
    };

    return (
        <AppShell>
            <div className="container mx-auto p-6">
                <PageHeader
                    title="Prep Items"
                    description="Manage semi-finished goods and prep recipes"
                    actions={
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Prep Item
                        </Button>
                    }
                />

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search prep items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Prep Items List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Loading prep items...</div>
                    </div>
                ) : !data?.items?.length ? (
                    <Card className="p-8 text-center">
                        <div className="text-gray-500">No prep items found</div>
                        <Button onClick={() => setDialogOpen(true)} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Prep Item
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {data.items.map((prepItem) => (
                            <Card key={prepItem.id} className="p-4">
                                <div 
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleExpanded(prepItem.id)}
                                >
                                    <div className="flex items-center space-x-4">
                                        {expandedItems.has(prepItem.id) ? (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-lg">{prepItem.name}</h3>
                                            <div className="text-sm text-gray-500 space-x-3">
                                                <span>Branch: {prepItem.branch.name}</span>
                                                <span>•</span>
                                                <span>Yields: {prepItem.yieldQty} {prepItem.yieldUom.code}</span>
                                                <span>•</span>
                                                <span>Prep Time: {prepItem.prepMinutes}min</span>
                                                <span>•</span>
                                                <span>{prepItem.lines.length} ingredients</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={prepItem.isActive ? 'default' : 'secondary'}>
                                        {prepItem.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                {/* Expanded Details */}
                                {expandedItems.has(prepItem.id) && (
                                    <div className="mt-4 pl-9 border-t pt-4">
                                        <h4 className="font-semibold mb-2">Ingredients:</h4>
                                        <div className="space-y-2">
                                            {prepItem.lines.map((line) => (
                                                <div key={line.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                                    <div className="flex-1">
                                                        <span className="font-medium">{line.inventoryItem.name}</span>
                                                        {line.inventoryItem.sku && (
                                                            <span className="text-sm text-gray-500 ml-2">({line.inventoryItem.sku})</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-medium">{line.qty} {line.uom.code}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {prepItem.notes && (
                                            <div className="mt-3 text-sm text-gray-600">
                                                <strong>Notes:</strong> {prepItem.notes}
                                            </div>
                                        )}
                                        
                                        {/* M81: Cost Information (for Accountant role) */}
                                        <PrepItemCostDisplay prepItemId={prepItem.id} branchId={prepItem.branch.id} yieldUomCode={prepItem.yieldUom.code} />
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <div className="max-w-3xl">
                        <h2 className="text-xl font-bold mb-4">Create Prep Item</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Branch Selection */}
                                <div>
                                    <Label htmlFor="branch">Branch *</Label>
                                    <select
                                        id="branch"
                                        value={formBranchId}
                                        onChange={(e) => setFormBranchId(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select branch...</option>
                                        {branches?.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Name */}
                                <div>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="e.g., Pizza Dough, Marinara Sauce"
                                        required
                                    />
                                </div>

                                {/* Yield Quantity + UOM */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="yieldQty">Yield Quantity *</Label>
                                        <Input
                                            id="yieldQty"
                                            type="number"
                                            step="0.0001"
                                            value={formYieldQty}
                                            onChange={(e) => setFormYieldQty(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="yieldUom">Yield UOM *</Label>
                                        <select
                                            id="yieldUom"
                                            value={formYieldUomId}
                                            onChange={(e) => setFormYieldUomId(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        >
                                            <option value="">Select UOM...</option>
                                            {uoms?.map((uom) => (
                                                <option key={uom.id} value={uom.id}>
                                                    {uom.name} ({uom.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Prep Time */}
                                <div>
                                    <Label htmlFor="prepMinutes">Prep Time (minutes)</Label>
                                    <Input
                                        id="prepMinutes"
                                        type="number"
                                        value={formPrepMinutes}
                                        onChange={(e) => setFormPrepMinutes(e.target.value)}
                                    />
                                </div>

                                {/* Ingredient Lines */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Ingredients *</Label>
                                        <Button type="button" onClick={addLine} size="sm">
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Ingredient
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {formLines.map((line, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                                <div className="col-span-5">
                                                    <select
                                                        value={line.inventoryItemId}
                                                        onChange={(e) => updateLine(index, 'inventoryItemId', e.target.value)}
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        required
                                                    >
                                                        <option value="">Select item...</option>
                                                        {items?.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name} {item.sku ? `(${item.sku})` : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2">
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        value={line.qty}
                                                        onChange={(e) => updateLine(index, 'qty', e.target.value)}
                                                        placeholder="Qty"
                                                        className="text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <select
                                                        value={line.uomId}
                                                        onChange={(e) => updateLine(index, 'uomId', e.target.value)}
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        required
                                                    >
                                                        <option value="">UOM...</option>
                                                        {uoms?.map((uom) => (
                                                            <option key={uom.id} value={uom.id}>
                                                                {uom.code}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeLine(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <Button type="button" onClick={() => setDialogOpen(false)} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating...' : 'Create Prep Item'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>
        </AppShell>
    );
}

/**
 * M81: Cost Display Component
 * Fetches and displays cost breakdown for a prep item
 * Only shown to users with appropriate permissions (Accountant/Manager)
 */
function PrepItemCostDisplay({ prepItemId, branchId, yieldUomCode }: { prepItemId: string; branchId: string; yieldUomCode: string }) {
    const { data: costData, isLoading, isError } = useQuery({
        queryKey: ['prep-item-cost', prepItemId, branchId],
        queryFn: async () => {
            try {
                const response = await apiClient.get<PrepItemCost>(
                    `/inventory/prep-items/${prepItemId}/cost`,
                    { params: { branchId } }
                );
                return response.data;
            } catch (error) {
                // Gracefully handle 403/404 (permission denied or not found)
                console.warn(`Cost data not available for prep item ${prepItemId}:`, error);
                return null;
            }
        },
        enabled: !!prepItemId, // Only fetch when prepItemId is available
        retry: false, // Don't retry on permission errors
    });

    // Don't show anything if loading, error, or no data
    if (isLoading || isError || !costData || costData.totalCost === 0) {
        return null;
    }

    return (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Estimated Cost Breakdown</h4>
            
            {/* Total Cost Summary */}
            <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-white rounded">
                <div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                    <div className="text-xl font-bold text-blue-900">${costData.totalCost.toFixed(2)}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Cost per {yieldUomCode}</div>
                    <div className="text-xl font-bold text-blue-900">${costData.costPerYieldUnit.toFixed(2)}</div>
                </div>
            </div>

            {/* Ingredient Cost Details */}
            <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700 mb-1">Ingredient Costs:</div>
                {costData.ingredientCosts.map((ingredient, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-1 px-2 bg-white rounded">
                        <span className="text-gray-700">{ingredient.itemName}</span>
                        <span className="text-gray-600">
                            {ingredient.qty} × ${ingredient.unitCost.toFixed(2)} = ${ingredient.lineCost.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-2 text-xs text-gray-500 italic">
                * Cost based on latest stock batch unit costs
            </div>
        </div>
    );
}
