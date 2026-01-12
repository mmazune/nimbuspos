import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { usePosCachedMenu } from '@/hooks/usePosCachedMenu';
import { usePosCachedOpenOrders } from '@/hooks/usePosCachedOpenOrders';
import { useOfflineStorageEstimate } from '@/hooks/useOfflineStorageEstimate';
import { clearPosSnapshots } from '@/lib/posIndexedDb';
import { PosSyncStatusPanel } from '@/components/pos/PosSyncStatusPanel';
import { PosSplitBillDrawer } from '@/components/pos/PosSplitBillDrawer';
import { KioskToggleButton } from '@/components/common/KioskToggleButton';
import { useDeviceRole } from '@/hooks/useDeviceRole';
import { DEVICE_ROLE_LABELS } from '@/types/deviceRole';
import { useAppUpdateBanner } from '@/hooks/useAppUpdateBanner';
import { APP_VERSION } from '@/version';
import { PosItemModifiersDrawer } from '@/components/pos/PosItemModifiersDrawer';
import { buildModifierSummary } from '@/lib/posModifiers';
import type { PosMenuItem } from '@/hooks/usePosCachedMenu';
import Link from 'next/link';
import type { PosSplitPaymentsDto, PosOrderLineModifier, PosOrderTabInfo } from '@/types/pos';
import { PosTabsSidebar } from '@/components/pos/PosTabsSidebar';
import { PosTabNameDialog } from '@/components/pos/PosTabNameDialog';
import { SystemDiagnosticsPanel } from '@/components/common/SystemDiagnosticsPanel';
import { DiagnosticsToggleButton } from '@/components/common/DiagnosticsToggleButton';
import { definePageMeta } from '@/lib/pageMeta';

/** Phase I2: Page metadata for action catalog */
export const pageMeta = definePageMeta({
  id: '/pos',
  title: 'POS - Point of Sale',
  primaryActions: [
    { label: 'New Order', testId: 'pos-new-order', intent: 'create' },
    { label: 'Add Item', testId: 'pos-add-item', intent: 'create' },
    { label: 'Send to Kitchen', testId: 'pos-send-kitchen', intent: 'update' },
    { label: 'Checkout', testId: 'pos-checkout', intent: 'navigate' },
    { label: 'Void Order', testId: 'pos-void-order', intent: 'delete' },
    { label: 'Split Bill', testId: 'pos-split-bill', intent: 'update' },
  ],
  apiCalls: [
    { method: 'GET', path: '/pos/open', trigger: 'onMount', notes: 'Fetch open orders' },
    { method: 'GET', path: '/pos/menu', trigger: 'onMount', notes: 'Fetch menu items' },
    { method: 'POST', path: '/pos/orders', trigger: 'onAction', notes: 'Create new order' },
    { method: 'POST', path: '/pos/orders/:id/lines', trigger: 'onAction', notes: 'Add item to order' },
    { method: 'POST', path: '/pos/orders/:id/send', trigger: 'onAction', notes: 'Send to kitchen' },
    { method: 'POST', path: '/pos/orders/:id/void', trigger: 'onAction', notes: 'Void order' },
  ],
  risk: 'HIGH',
  allowedRoles: ['OWNER', 'MANAGER', 'SUPERVISOR', 'CASHIER', 'WAITER', 'BARTENDER'],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Order {
  id: string;
  tableName: string | null;
  tabName: string | null;
  status: string;
  subtotal: number;
  total: number;
  createdAt: string;
}

interface OrderDetail extends Order {
  items: OrderItem[];
  tax: number;
  payments: Payment[];
}

interface OrderItem {
  id: string;
  name: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
  notes: string | null;
  modifiers?: PosOrderLineModifier[]; // M26-EXT2: Applied modifiers
}

interface Payment {
  id: string;
  amount: number;
  method: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  SENT: 'bg-amber-100 text-amber-800',
  IN_KITCHEN: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  SERVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  VOIDED: 'bg-red-100 text-red-800',
};

// M27-S1: Helper to generate idempotency keys
function generateIdempotencyKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function PosPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'MOBILE'>('CASH');
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  // M26-EXT1: Split bill state
  const [activeSplitOrderId, setActiveSplitOrderId] = useState<string | null>(null);
  const [isSplitSubmitting, setIsSplitSubmitting] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSyncPanelOpen, setIsSyncPanelOpen] = useState(false);

  // M26-EXT2: Modifier drawer state
  const [modifierDrawerOpen, setModifierDrawerOpen] = useState(false);
  const [modifierTarget, setModifierTarget] = useState<{
    orderId: string;
    lineId?: string;
    item: PosMenuItem;
    basePrice: number;
    existingModifiers?: PosOrderLineModifier[];
  } | null>(null);

  // M26-EXT3: Tabs management state
  const [tabsSidebarOpen, setTabsSidebarOpen] = useState(false);
  const [tabNameDialogOpen, setTabNameDialogOpen] = useState(false);
  const [tabNameDialogMode, setTabNameDialogMode] = useState<'create' | 'rename'>('create');
  const [tabNameDialogTarget, setTabNameDialogTarget] = useState<string | null>(null);

  // M30-OPS-S1: Diagnostics panel state
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);

  const queryClient = useQueryClient();

  // M29-PWA-S2: Device role for multi-device deployment
  const { role } = useDeviceRole();

  // M29-PWA-S3: App update detection
  const { hasUpdate, acknowledgeUpdate, reloadWithUpdate } = useAppUpdateBanner();

  // M27-S2: Register POS service worker on mount (now handled in useAppUpdateBanner)
  // useEffect(() => {
  //   registerPosServiceWorker();
  // }, []);

  // M27-S1 + M27-S2 + M27-S4 + M27-S6 + M27-S8: Offline queue for resilient POS operations with sync logging
  const { isOnline, isSyncing, queue, syncLog, addToQueue, syncQueue, clearQueue, clearSyncHistory } = useOfflineQueue();

  // M27-S4 + M27-S7: Derived sync status counts
  const queuedCount = queue.length;
  const failedCount = useMemo(
    () => syncLog.filter(entry => entry.status === 'failed').length,
    [syncLog]
  );
  const conflictCount = useMemo(
    () => syncLog.filter(entry => entry.status === 'conflict').length,
    [syncLog]
  );

  // M27-S3 + M27-S6: Cached open orders with offline support and staleness tracking
  const {
    openOrders: cachedOrders,
    isLoading: ordersLoading,
    source: ordersSource,
    isStale: openOrdersIsStale,
    ageMs: openOrdersAgeMs,
  } = usePosCachedOpenOrders();

  const orders = useMemo(() => cachedOrders ?? [], [cachedOrders]);

  // Fetch selected order details
  const { data: activeOrder, isLoading: orderLoading } = useQuery({
    queryKey: ['pos-order', selectedOrderId],
    queryFn: async () => {
      if (!selectedOrderId) return null;
      const res = await fetch(`${API_URL}/pos/orders/${selectedOrderId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch order');
      return res.json() as Promise<OrderDetail>;
    },
    enabled: !!selectedOrderId,
  });

  // M27-S1: Create new order with offline support
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const url = `${API_URL}/pos/orders`;
      const relativeUrl = '/pos/orders';
      const idempotencyKey = generateIdempotencyKey('pos-create');
      const body = {
        serviceType: 'DINE_IN',
        items: [],
      };

      if (!isOnline) {
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body,
          idempotencyKey,
        });
        // Return mock response for offline mode
        return { id: `offline-${Date.now()}`, status: 'NEW' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to create order');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
      setSelectedOrderId(data.id);
    },
  });

  // M27-S1: Send to kitchen with offline support
  const sendToKitchenMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const url = `${API_URL}/pos/orders/${orderId}/send-to-kitchen`;
      const relativeUrl = `/pos/orders/${orderId}/send-to-kitchen`;
      const idempotencyKey = generateIdempotencyKey(`pos-send-${orderId}`);

      if (!isOnline) {
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body: {},
          idempotencyKey,
        });
        return { status: 'SENT' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to send to kitchen');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
      queryClient.invalidateQueries({ queryKey: ['pos-order', selectedOrderId] });
    },
  });

  // M27-S1: Close order (payment) with offline support
  const closeOrderMutation = useMutation({
    mutationFn: async ({ orderId, amount }: { orderId: string; amount: number }) => {
      const url = `${API_URL}/pos/orders/${orderId}/close`;
      const relativeUrl = `/pos/orders/${orderId}/close`;
      const idempotencyKey = generateIdempotencyKey(`pos-close-${orderId}`);
      const body = { amount, timestamp: new Date().toISOString() };

      if (!isOnline) {
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body,
          idempotencyKey,
        });
        return { status: 'CLOSED' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to close order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
      queryClient.invalidateQueries({ queryKey: ['pos-order', selectedOrderId] });
      setPaymentModalOpen(false);
      setSelectedOrderId(null);
    },
  });

  // M27-S1: Void order with offline support
  const voidOrderMutation = useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      const url = `${API_URL}/pos/orders/${orderId}/void`;
      const relativeUrl = `/pos/orders/${orderId}/void`;
      const idempotencyKey = generateIdempotencyKey(`pos-void-${orderId}`);
      const body = { reason };

      if (!isOnline) {
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body,
          idempotencyKey,
        });
        return { status: 'VOIDED' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to void order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
      setVoidModalOpen(false);
      setSelectedOrderId(null);
    },
  });

  // M26-S2 + M27-S3 + M27-S6: Cached menu items with offline support and staleness tracking
  const {
    menu: cachedMenu,
    isLoading: menuLoading,
    source: menuSource,
    isStale: menuIsStale,
    ageMs: menuAgeMs,
  } = usePosCachedMenu();

  // M27-S6: Storage estimate for offline data
  const storageEstimate = useOfflineStorageEstimate();

  const menuItems = useMemo(() => cachedMenu ?? [], [cachedMenu]);

  // M26-S2: Derive category list
  const categories = useMemo(() => {
    const set = new Set<string>();
    menuItems.forEach((item) => {
      if (item.category?.name) set.add(item.category.name);
    });
    return Array.from(set).sort();
  }, [menuItems]);

  // M26-S2: Filter menu items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Filter by active status
      if (item.isActive === false) return false;

      // Filter by category
      if (selectedCategory !== 'ALL' && item.category?.name !== selectedCategory) {
        return false;
      }

      // Filter by search
      if (!menuSearch.trim()) return true;

      const q = menuSearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q))
      );
    });
  }, [menuItems, selectedCategory, menuSearch]);

  // M26-S2/M27-S1: Add items to order mutation with offline support
  const addItemsMutation = useMutation({
    mutationFn: async (payload: { orderId: string; itemId: string }) => {
      const url = `${API_URL}/pos/orders/${payload.orderId}/modify`;
      const relativeUrl = `/pos/orders/${payload.orderId}/modify`;
      const idempotencyKey = generateIdempotencyKey(
        `pos-add-${payload.orderId}-${payload.itemId}`
      );
      const body = {
        items: [
          {
            menuItemId: payload.itemId,
            qty: 1,
          },
        ],
      };

      if (!isOnline) {
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body,
          idempotencyKey,
        });
        return { status: 'queued' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error('Failed to add item');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pos-order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
    },
  });

  // M26-S3/S4/M27-S1: Update item quantity and/or notes mutation with offline support
  const updateItemsMutation = useMutation({
    mutationFn: async (payload: {
      orderId: string;
      itemId: string;
      quantity?: number;
      notes?: string;
    }) => {
      const url = `${API_URL}/pos/orders/${payload.orderId}/modify`;
      const relativeUrl = `/pos/orders/${payload.orderId}/modify`;
      const idempotencyKey = generateIdempotencyKey(
        `pos-update-${payload.orderId}-${payload.itemId}`
      );
      const body: any = {
        updateItems: [
          {
            orderItemId: payload.itemId,
          },
        ],
      };

      if (typeof payload.quantity === 'number') {
        body.updateItems[0].quantity = payload.quantity;
      }
      if (typeof payload.notes === 'string') {
        body.updateItems[0].notes = payload.notes;
      }

      if (!isOnline) {
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body,
          idempotencyKey,
        });
        return { status: 'queued' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error('Failed to update item');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pos-order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
    },
  });

  // M26-S3/S4: Determine if order items can be edited
  const canEditOrderItems =
    activeOrder &&
    (activeOrder.status === 'NEW' ||
      activeOrder.status === 'SENT' ||
      activeOrder.status === 'IN_PROGRESS');

  // M26-S3/S4: Get selected item details
  const selectedItem =
    activeOrder?.items?.find((item) => item.id === selectedItemId) ?? null;

  // M26-S3: Quantity control handlers
  const handleIncreaseQuantity = (item: OrderItem) => {
    if (!selectedOrderId) return;
    updateItemsMutation.mutate({
      orderId: selectedOrderId,
      itemId: item.id,
      quantity: item.quantity + 1,
    });
  };

  const handleDecreaseQuantity = (item: OrderItem) => {
    if (!selectedOrderId) return;
    const nextQty = item.quantity - 1;
    if (nextQty <= 0) {
      // Treat as remove - ask for confirmation
      if (confirm(`Remove ${item.name} from the order?`)) {
        updateItemsMutation.mutate({
          orderId: selectedOrderId,
          itemId: item.id,
          quantity: 0,
        });
      }
    } else {
      updateItemsMutation.mutate({
        orderId: selectedOrderId,
        itemId: item.id,
        quantity: nextQty,
      });
    }
  };

  const handleRemoveItem = (item: OrderItem) => {
    if (!selectedOrderId) return;
    if (!confirm(`Remove ${item.name} from the order?`)) return;

    updateItemsMutation.mutate({
      orderId: selectedOrderId,
      itemId: item.id,
      quantity: 0,
    });
  };

  // M26-S2: Handle adding menu item to order
  const handleAddItemClick = (item: PosMenuItem) => {
    if (!selectedOrderId) {
      alert('Please create or select an order first.');
      return;
    }

    // M26-EXT2: Open modifier drawer if item has modifier groups
    if (item.modifierGroups && item.modifierGroups.length > 0) {
      setModifierTarget({
        orderId: selectedOrderId,
        item,
        basePrice: item.price,
        existingModifiers: [],
      });
      setModifierDrawerOpen(true);
      return;
    }

    // No modifiers - quick add
    addItemsMutation.mutate({ orderId: selectedOrderId, itemId: item.id });
  };

  const handleOpenPayment = () => {
    if (!activeOrder) return;
    const totalPaid = activeOrder.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = activeOrder.total - totalPaid;
    setPaymentAmount(balance);
    setPaymentModalOpen(true);
  };

  // M27-S6: Cache management handlers
  const handleClearSnapshots = async () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'This will remove cached menu and open orders on this device. Live data will still load when online. Continue?'
      );
      if (!ok) return;
    }
    await clearPosSnapshots(); // Clear all snapshots (no keys = clear all)
    // Reload page to refresh hooks
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleClearQueue = () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'This will remove all pending offline POS actions on this device. Unsynced changes will be lost. Continue?'
      );
      if (!ok) return;
    }
    clearQueue();
  };

  // M27-S8: Clear sync history handler
  const handleClearSyncHistory = () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'This will remove all recorded sync history on this device. Pending actions and cached data will not be affected. Continue?'
      );
      if (!ok) return;
    }
    clearSyncHistory();
  };

  const handleConfirmPayment = () => {
    if (!selectedOrderId) return;
    closeOrderMutation.mutate({ orderId: selectedOrderId, amount: paymentAmount });
  };

  const handleOpenVoid = () => {
    setVoidReason('');
    setVoidModalOpen(true);
  };

  const handleConfirmVoid = () => {
    if (!selectedOrderId || !voidReason.trim()) return;
    voidOrderMutation.mutate({ orderId: selectedOrderId, reason: voidReason });
  };

  // M26-EXT3: Derive tab info from open orders
  const openTabs = useMemo<PosOrderTabInfo[]>(() => {
    return orders
      .filter(order => order.status !== 'CLOSED' && order.status !== 'VOIDED')
      .map(order => ({
        orderId: order.id,
        tabName: order.tabName || null,
        serviceType: 'DINE_IN', // Default - backend should provide this
        tableLabel: order.tableName || null,
        guestCount: null, // Not available in order list
        createdAt: order.createdAt,
        lastModifiedAt: order.createdAt,
        itemCount: 0, // Not available in order list
        orderTotal: order.total,
        status: 'OPEN' as const,
      }));
  }, [orders]);

  // M26-EXT3: Tab management handlers
  const handleResumeTab = (tabId: string) => {
    setSelectedOrderId(tabId);
  };

  const handleRenameTab = (tabId: string) => {
    setTabNameDialogMode('rename');
    setTabNameDialogTarget(tabId);
    setTabNameDialogOpen(true);
  };

  const handleDetachTab = (tabId: string) => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'Close this tab without payment? The order will be voided.'
      );
      if (!ok) return;
    }
    voidOrderMutation.mutate({ orderId: tabId, reason: 'Tab detached' });
  };

  const handleTabNameConfirm = (tabName: string) => {
    if (!tabNameDialogTarget) return;

    // Update tab name via offline queue
    const orderId = tabNameDialogTarget;
    const url = `${API_URL}/pos/orders/${orderId}/tab-name`;
    const relativeUrl = `/pos/orders/${orderId}/tab-name`;
    const idempotencyKey = generateIdempotencyKey(`pos-update-tab-${orderId}`);
    const body = { tabName };

    if (!isOnline) {
      addToQueue({
        url: relativeUrl,
        method: 'PATCH',
        body,
        idempotencyKey,
      });
      // Optimistically update local cache
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
    } else {
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update tab name');
          return res.json();
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
        })
        .catch(err => {
          console.error('Update tab name failed:', err);
        });
    }

    setTabNameDialogOpen(false);
    setTabNameDialogTarget(null);
  };

  // M26-EXT2: Handle modifier confirmation
  const handleModifierConfirm = (modifiers: PosOrderLineModifier[], _totalPrice: number) => {
    if (!modifierTarget) return;

    const { orderId, lineId, item } = modifierTarget;

    if (lineId) {
      // Editing existing line - update modifiers (will be handled by offline queue)
      // For now, just add as a new item since backend update endpoint may not exist yet
      alert('Modifier editing not yet implemented. Please add as new item.');
    } else {
      // Adding new item with modifiers
      const url = `${API_URL}/pos/orders/${orderId}/items`;
      const relativeUrl = `/pos/orders/${orderId}/items`;
      const idempotencyKey = generateIdempotencyKey(`pos-add-item-${orderId}-${item.id}`);

      const body = {
        itemId: item.id,
        quantity: 1,
        modifiers: modifiers.map(m => ({
          groupId: m.groupId,
          optionId: m.optionId,
          priceDelta: m.priceDelta,
        })),
      };

      if (!isOnline) {
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body,
          idempotencyKey,
        });
      } else {
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': idempotencyKey,
          },
          credentials: 'include',
          body: JSON.stringify(body),
        })
          .then(res => {
            if (!res.ok) throw new Error('Failed to add item');
            return res.json();
          })
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
          })
          .catch(err => {
            console.error('Add item with modifiers failed:', err);
          });
      }
    }

    setModifierDrawerOpen(false);
    setModifierTarget(null);
  };

  // M26-EXT1: Handle split bill submission with offline queue support
  const handleSubmitSplit = async (orderId: string, payload: PosSplitPaymentsDto) => {
    setIsSplitSubmitting(true);
    try {
      const url = `${API_URL}/pos/orders/${orderId}/split-payments`;
      const relativeUrl = `/pos/orders/${orderId}/split-payments`;
      const idempotencyKey = generateIdempotencyKey(`pos-split-${orderId}`);

      if (!isOnline) {
        // Queue for background sync using existing offlineQueue infra
        addToQueue({
          url: relativeUrl,
          method: 'POST',
          body: payload,
          idempotencyKey,
        });
        // Optimistically close drawer and refresh order list
        queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
        queryClient.invalidateQueries({ queryKey: ['pos-order', orderId] });
        setActiveSplitOrderId(null);
        return;
      }

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Split payments failed: ${resp.status}`);
      }

      // Success - refresh order data
      queryClient.invalidateQueries({ queryKey: ['pos-open-orders'] });
      queryClient.invalidateQueries({ queryKey: ['pos-order', orderId] });
      setActiveSplitOrderId(null);
    } finally {
      setIsSplitSubmitting(false);
    }
  };

  const totalPaid = activeOrder?.payments.reduce((sum, p) => sum + p.amount, 0) || 0;
  const balance = activeOrder ? activeOrder.total - totalPaid : 0;

  return (
    <AppShell>
      <PageHeader
        title="POS – Dining Room"
        subtitle="Create orders, send to kitchen, and process payments"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/launch"
              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 border border-slate-700 rounded-full px-2 py-0.5 bg-slate-900/60"
            >
              Device: {DEVICE_ROLE_LABELS[role]}
            </Link>
            <KioskToggleButton size="sm" />
            <DiagnosticsToggleButton onClick={() => setDiagnosticsOpen(true)} />
          </div>
        }
      />

      {/* M29-PWA-S3: App update banner */}
      {hasUpdate && (
        <div className="flex items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-100">
          <div>
            <span className="font-medium">New ChefCloud version available.</span>{' '}
            <span className="text-amber-200/80">
              Current: {APP_VERSION}. Reload to apply updates.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={acknowledgeUpdate}
              className="rounded-md border border-amber-400/60 px-2 py-0.5 text-[10px] text-amber-100 hover:bg-amber-500/20"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => void reloadWithUpdate()}
              className="rounded-md bg-amber-400 px-3 py-1 text-[10px] font-semibold text-slate-900 hover:bg-amber-300"
            >
              Reload now
            </button>
          </div>
        </div>
      )}

      {/* M27-S1 + M27-S2 + M27-S4 + M27-S7: Enhanced Offline/Online Banner */}
      {!isOnline && (
        <div className="mb-3 rounded-md bg-amber-100 border border-amber-300 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <span>You are currently offline. New actions will be queued and sent when you&apos;re back online.</span>
            {queuedCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-semibold uppercase">
                Queued: {queuedCount}
              </span>
            )}
            {failedCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-300 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-800">
                Failed: {failedCount}
              </span>
            )}
            {conflictCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-300 px-2 py-0.5 text-[10px] font-semibold uppercase text-orange-800">
                Conflicts: {conflictCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-[11px] h-6 px-2"
              onClick={() => setIsSyncPanelOpen(true)}
            >
              View sync details
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-[11px] h-6 px-2"
              onClick={() => syncQueue()}
              disabled={queue.length === 0 || isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Sync now'}
            </Button>
          </div>
        </div>
      )}

      {isOnline && queue.length > 0 && (
        <div className="mb-3 rounded-md bg-blue-50 border border-blue-200 px-3 py-2 flex items-center justify-between">
          <div className="text-xs text-blue-900">
            {isSyncing ? 'Syncing pending actions...' : `You're back online. There are ${queue.length} pending actions.`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-[11px] h-6 px-2"
              onClick={() => setIsSyncPanelOpen(true)}
            >
              View details
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-[11px] h-6 px-2"
              onClick={() => syncQueue()}
              disabled={isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Sync now'}
            </Button>
          </div>
        </div>
      )}

      {/* M27-S4 + M27-S7: Failed/Conflict actions warning when online */}
      {isOnline && queue.length === 0 && failedCount > 0 && (
        <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 flex items-center justify-between">
          <div className="text-xs text-red-900">
            Some offline actions failed to sync. Review details and retry when ready.
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-[11px] h-6 px-2"
            onClick={() => setIsSyncPanelOpen(true)}
          >
            View sync details
          </Button>
        </div>
      )}

      {/* M27-S7: Conflict actions warning when online */}
      {isOnline && queue.length === 0 && conflictCount > 0 && (
        <div className="mb-3 rounded-md bg-orange-50 border border-orange-200 px-3 py-2 flex items-center justify-between">
          <div className="text-xs text-orange-900">
            Some offline actions were skipped because the order changed on another device. Review details for more information.
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-[11px] h-6 px-2"
            onClick={() => setIsSyncPanelOpen(true)}
          >
            View sync details
          </Button>
        </div>
      )}

      {/* M27-S3 + M27-S6: Cache status banners with staleness warnings */}
      {!isOnline && (menuSource === 'cache' || ordersSource === 'cache') && (
        <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
          <div className="text-xs text-amber-900">
            Showing last-known POS data from this device. Some changes may not be reflected until you&apos;re back online.
            {(menuIsStale || openOrdersIsStale) && (
              <span className="ml-2 font-semibold">
                Note: some cached data is old; connect soon to refresh.
              </span>
            )}
          </div>
        </div>
      )}

      {!isOnline && menuSource === 'none' && ordersSource === 'none' && (
        <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2">
          <div className="text-xs text-red-900">
            No cached POS data available. Connect to the internet at least once to enable offline mode.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-140px)]">
        {/* Left/Center Area: Menu or Order List */}
        {!selectedOrderId ? (
          <Card className="lg:col-span-12 flex flex-col bg-nimbus-mist/50 dark:bg-nimbus-navy/50 border-none shadow-none">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-nimbus-navy dark:text-white">Open Orders</h3>
                {openTabs.length > 0 && (
                  <span className="bg-nimbus-blue text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {openTabs.length}
                  </span>
                )}
              </div>
              <Button
                variant="default"
                size="lg"
                onClick={() => createOrderMutation.mutate()}
                disabled={createOrderMutation.isPending}
                data-testid="pos-new-order"
                className="bg-nimbus-blue hover:bg-nimbus-blue/90 shadow-lg shadow-nimbus-blue/20"
              >
                + New Order
              </Button>
            </div>

            {ordersLoading && <div className="p-8 text-center text-muted-foreground">Loading orders...</div>}

            {!ordersLoading && orders.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-white dark:bg-nimbus-navy rounded-xl border border-dashed border-nimbus-navy/20 dark:border-white/20 m-1">
                <p className="text-lg font-medium">No open orders</p>
                <p className="text-sm mt-1">Create a new order to get started</p>
              </div>
            )}

            {!ordersLoading && orders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto p-1">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="flex flex-col text-left p-4 bg-white dark:bg-nimbus-navy rounded-xl border border-nimbus-navy/5 dark:border-white/10 hover:border-nimbus-blue hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2 w-full">
                      <span className="font-bold text-lg text-nimbus-navy dark:text-white group-hover:text-nimbus-blue">
                        {order.tableName || order.tabName || 'Walk-in'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-nimbus-ink/60 dark:text-white/60 w-full mt-auto">
                      <span className="font-medium text-nimbus-ink dark:text-white">UGX {order.total.toLocaleString()}</span>
                      <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <>
            {/* MENU BROWSER (Left Side - 8 Cols) */}
            <Card className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-nimbus-navy border-nimbus-navy/10 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-nimbus-navy/5 dark:border-white/5 bg-nimbus-mist/30 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 -ml-2 text-nimbus-navy dark:text-white"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    <span className="sr-only">Back</span>
                    ←
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search menu..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="h-10 text-sm bg-white dark:bg-black/20 border-transparent focus:border-nimbus-blue ring-0 rounded-full pl-4"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                  <Button
                    size="sm"
                    variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('ALL')}
                    className={selectedCategory === 'ALL' ? 'bg-nimbus-navy text-white rounded-full' : 'rounded-full border-nimbus-navy/20 text-nimbus-navy dark:text-white'}
                  >
                    All Items
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat)}
                      className={selectedCategory === cat ? 'bg-nimbus-navy text-white rounded-full' : 'rounded-full border-nimbus-navy/20 text-nimbus-navy dark:text-white'}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-nimbus-mist/20 dark:bg-black/20">
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {menuLoading ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">Loading menu...</div>
                  ) : filteredMenuItems.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">No items match your filters.</div>
                  ) : (
                    filteredMenuItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAddItemClick(item)}
                        disabled={addItemsMutation.isPending}
                        className="flex flex-col text-left h-[120px] p-3 rounded-xl bg-white dark:bg-nimbus-navy border border-nimbus-navy/5 dark:border-white/10 shadow-sm hover:shadow-md hover:border-nimbus-blue/50 dark:hover:border-nimbus-blue transition-all group active:scale-[0.98]"
                      >
                        <div className="font-bold text-sm text-nimbus-navy dark:text-white line-clamp-2 leading-tight mb-1">
                          {item.name}
                        </div>
                        {item.sku && (
                          <div className="text-[10px] text-nimbus-ink/40 dark:text-white/40 mb-auto">
                            {item.sku}
                          </div>
                        )}
                        <div className="mt-auto font-bold text-nimbus-blue dark:text-nimbus-violet">
                          UGX {item.price.toLocaleString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {/* ACTIVE ORDER (Right Side - 4 Cols) */}
            <Card className="lg:col-span-4 flex flex-col h-full bg-white dark:bg-nimbus-navy border-nimbus-navy/10 dark:border-white/10 shadow-md z-10">
              {/* Header */}
              <div className="p-4 border-b border-nimbus-navy/10 dark:border-white/10 flex items-center justify-between bg-nimbus-mist/30 dark:bg-white/5">
                <div>
                  <h3 className="font-bold text-nimbus-navy dark:text-white text-lg">
                    {activeOrder?.tableName || activeOrder?.tabName || 'New Order'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${STATUS_COLORS[activeOrder?.status || 'NEW']}`}>
                      {activeOrder?.status || 'NEW'}
                    </span>
                    <span className="text-xs text-nimbus-ink/50 dark:text-white/50">
                      #{activeOrder?.id.slice(-4) || '----'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {/* Tabs Toggle if needed */}
                  <Button variant="ghost" size="icon" onClick={() => setTabsSidebarOpen(true)} title="Switch Tab">
                    <svg className="h-5 w-5 text-nimbus-navy dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Order Items List */}
              <div className="flex-1 overflow-y-auto p-0">
                {/* Logic for items list (copied/adapted from original center card) */}
                {selectedOrderId && !orderLoading && activeOrder ? (
                  <div>
                    {activeOrder.items.length === 0 && (
                      <div className="p-8 text-center text-sm text-nimbus-ink/40 dark:text-white/40 italic">
                        Items you add will appear here
                      </div>
                    )}

                    {activeOrder.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`relative p-3 border-b border-nimbus-navy/5 dark:border-white/5 transition-colors ${selectedItemId === item.id ? 'bg-nimbus-blue/5 dark:bg-white/10' : 'hover:bg-nimbus-mist/30 dark:hover:bg-white/5'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-nimbus-navy dark:text-white pr-2">{item.name}</span>
                          <span className="font-bold text-sm text-nimbus-navy dark:text-white">UGX {item.total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-nimbus-ink/50 dark:text-white/50">
                          <span>{item.quantity} × {item.unitPrice.toLocaleString()}</span>
                          {/* Qty Controls embedded */}
                          {canEditOrderItems && selectedItemId === item.id && (
                            <div className="flex items-center gap-2 bg-white dark:bg-black rounded-full border shadow-sm px-1 py-0.5 ml-2 absolute right-2 bottom-2">
                              <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full" onClick={(e) => { e.stopPropagation(); handleDecreaseQuantity(item); }}>-</button>
                              <span className="font-bold text-nimbus-navy dark:text-white">{item.quantity}</span>
                              <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full" onClick={(e) => { e.stopPropagation(); handleIncreaseQuantity(item); }}>+</button>
                            </div>
                          )}
                        </div>
                        {item.notes && <div className="text-[10px] text-nimbus-blue mt-1 bg-nimbus-blue/5 px-1 py-0.5 rounded inline-block">{item.notes}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">Select an order</div>
                )}
              </div>

              {/* Totals & Actions Footer */}
              <div className="border-t border-nimbus-navy/10 dark:border-white/10 bg-nimbus-mist/30 dark:bg-white/5 p-4">
                {activeOrder && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-nimbus-ink/60 dark:text-white/60">Total</span>
                      <span className="text-2xl font-bold text-nimbus-navy dark:text-white">UGX {activeOrder.total.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {activeOrder.status === 'NEW' && (
                        <Button
                          className="col-span-2 h-12 text-lg font-bold bg-nimbus-blue hover:bg-nimbus-blue/90"
                          onClick={() => sendToKitchenMutation.mutate(activeOrder.id)}
                          disabled={sendToKitchenMutation.isPending || activeOrder.items.length === 0}
                        >
                          Send to Kitchen
                        </Button>
                      )}
                      {['SENT', 'IN_KITCHEN', 'READY', 'SERVED'].includes(activeOrder.status) && (
                        <>
                          <Button
                            variant="secondary"
                            className="h-12 font-semibold"
                            onClick={() => setActiveSplitOrderId(activeOrder.id)}
                          >
                            Split
                          </Button>
                          <Button
                            className="h-12 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-lg"
                            onClick={handleOpenPayment}
                          >
                            Pay
                          </Button>
                        </>
                      )}
                      {['NEW', 'SENT'].includes(activeOrder.status) && (
                        <Button variant="ghost" className="col-span-2 text-destructive hover:bg-destructive/10" onClick={handleOpenVoid}>
                          Void Order
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Take Payment</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {(['CASH', 'CARD', 'MOBILE'] as const).map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="radio"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleConfirmPayment}
                  disabled={closeOrderMutation.isPending || paymentAmount <= 0}
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Void Modal */}
      {voidModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Void Order</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="e.g. Customer cancelled"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setVoidModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleConfirmVoid}
                  disabled={voidOrderMutation.isPending || !voidReason.trim()}
                >
                  Confirm Void
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* M27-S4 + M27-S6 + M27-S8: Sync Status Panel with cache management and persistent sync history */}
      <PosSyncStatusPanel
        isOpen={isSyncPanelOpen}
        onClose={() => setIsSyncPanelOpen(false)}
        isSyncing={isSyncing}
        syncLog={syncLog}
        onRetryAll={syncQueue}
        onClearSnapshots={handleClearSnapshots}
        onClearQueue={handleClearQueue}
        onClearSyncHistory={handleClearSyncHistory}
        menuAgeMs={menuAgeMs}
        menuIsStale={menuIsStale}
        openOrdersAgeMs={openOrdersAgeMs}
        openOrdersIsStale={openOrdersIsStale}
        storageEstimate={storageEstimate}
      />

      {/* M26-EXT1: Split Bill Drawer */}
      {activeSplitOrderId && activeOrder && (
        <PosSplitBillDrawer
          isOpen={true}
          onClose={() => setActiveSplitOrderId(null)}
          orderId={activeSplitOrderId}
          orderTotal={activeOrder.total}
          currency="UGX"
          isSubmitting={isSplitSubmitting}
          onSubmitSplit={payload => handleSubmitSplit(activeSplitOrderId, payload)}
        />
      )}

      {/* M26-EXT2: Modifier Configuration Drawer */}
      {modifierTarget && (
        <PosItemModifiersDrawer
          open={modifierDrawerOpen}
          onClose={() => {
            setModifierDrawerOpen(false);
            setModifierTarget(null);
          }}
          item={modifierTarget.item}
          existingModifiers={modifierTarget.existingModifiers}
          basePrice={modifierTarget.basePrice}
          onConfirm={handleModifierConfirm}
        />
      )}

      {/* M26-EXT3: Tabs Sidebar */}
      <PosTabsSidebar
        open={tabsSidebarOpen}
        onClose={() => setTabsSidebarOpen(false)}
        tabs={openTabs}
        activeTabId={selectedOrderId}
        onResumeTab={handleResumeTab}
        onRenameTab={handleRenameTab}
        onDetachTab={handleDetachTab}
      />

      {/* M26-EXT3: Tab Name Dialog */}
      <PosTabNameDialog
        open={tabNameDialogOpen}
        onClose={() => {
          setTabNameDialogOpen(false);
          setTabNameDialogTarget(null);
        }}
        mode={tabNameDialogMode}
        currentName={
          tabNameDialogTarget
            ? openTabs.find(t => t.orderId === tabNameDialogTarget)?.tabName || null
            : null
        }
        onConfirm={handleTabNameConfirm}
      />

      {/* M30-OPS-S1: System Diagnostics Panel */}
      <SystemDiagnosticsPanel
        open={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        context="POS"
      />
    </AppShell>
  );
}
