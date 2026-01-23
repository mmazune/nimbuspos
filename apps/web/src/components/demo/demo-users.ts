/**
 * Demo Users Registry
 * 
 * Source of truth for demo account auto-login buttons.
 * Sourced from services/api/prisma/demo/constants.ts
 */

import {
    ChefHat,
    Building2,
    Wallet,
    ShoppingCart,
    Package,
    Users,
    MonitorCheck,
    UtensilsCrossed,
    Coffee,
    CalendarDays
} from 'lucide-react';

export interface DemoUser {
    email: string;
    role: string;
    name: string;
    icon: any;
    color: string;
    bgColor: string;
}

export interface DemoGroup {
    id: string;
    label: string;
    description: string;
    users: DemoUser[];
}

export const DEMO_GROUPS: DemoGroup[] = [
    {
        id: 'tapas',
        label: 'Individual Restaurant',
        description: 'Tapas Bar & Restaurant (Single Branch)',
        users: [
            {
                email: 'owner@tapas.demo.local',
                role: 'Owner',
                name: 'Joshua Owner',
                icon: ChefHat,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
            },
            {
                email: 'manager@tapas.demo.local',
                role: 'Manager',
                name: 'Bob Manager',
                icon: Users,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            },
            {
                email: 'accountant@tapas.demo.local',
                role: 'Accountant',
                name: 'Carol Accountant',
                icon: Wallet,
                color: 'text-green-600',
                bgColor: 'bg-green-50 border-green-200 hover:bg-green-100',
            },
            {
                email: 'procurement@tapas.demo.local',
                role: 'Procurement',
                name: 'Dan Procurement',
                icon: ShoppingCart,
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
            },
            {
                email: 'stock@tapas.demo.local',
                role: 'Stock Manager',
                name: 'Eve Stock',
                icon: Package,
                color: 'text-amber-600',
                bgColor: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
            },
            {
                email: 'supervisor@tapas.demo.local',
                role: 'Supervisor',
                name: 'Frank Supervisor',
                icon: MonitorCheck,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
            },
            {
                email: 'cashier@tapas.demo.local',
                role: 'Cashier',
                name: 'Grace Cashier',
                icon: Wallet,
                color: 'text-cyan-600',
                bgColor: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
            },
            {
                email: 'chef@tapas.demo.local',
                role: 'Chef',
                name: 'Iris Chef',
                icon: UtensilsCrossed,
                color: 'text-red-600',
                bgColor: 'bg-red-50 border-red-200 hover:bg-red-100',
            },
            {
                email: 'waiter@tapas.demo.local',
                role: 'Waiter',
                name: 'Henry Waiter',
                icon: Coffee,
                color: 'text-slate-600',
                bgColor: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
            },
            {
                email: 'eventmgr@tapas.demo.local',
                role: 'Event Manager',
                name: 'Kelly Events',
                icon: CalendarDays,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            },
            {
                email: 'bartender@tapas.demo.local',
                role: 'Bartender',
                name: 'Jack Bartender',
                icon: Coffee, // reusing Coffee icon
                color: 'text-amber-700',
                bgColor: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
            },
        ]
    },
    {
        id: 'cafesserie',
        label: 'Franchise Chain',
        description: 'Cafesserie (4 Branches)',
        users: [
            {
                email: 'owner@cafesserie.demo.local',
                role: 'Owner',
                name: 'Joshua Owner',
                icon: Building2,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            },
            {
                email: 'manager@cafesserie.demo.local',
                role: 'Manager',
                name: 'Mike Manager',
                icon: Users,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            },
            {
                email: 'accountant@cafesserie.demo.local',
                role: 'Accountant',
                name: 'Nina Accountant',
                icon: Wallet,
                color: 'text-green-600',
                bgColor: 'bg-green-50 border-green-200 hover:bg-green-100',
            },
            {
                email: 'procurement@cafesserie.demo.local',
                role: 'Procurement',
                name: 'Oscar Procurement',
                icon: ShoppingCart,
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
            },
            {
                email: 'supervisor@cafesserie.demo.local',
                role: 'Supervisor',
                name: 'Paula Supervisor',
                icon: MonitorCheck,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
            },
            {
                email: 'cashier@cafesserie.demo.local',
                role: 'Cashier',
                name: 'Quinn Cashier',
                icon: Wallet,
                color: 'text-cyan-600',
                bgColor: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
            },
            {
                email: 'chef@cafesserie.demo.local',
                role: 'Chef',
                name: 'Sam Chef',
                icon: UtensilsCrossed,
                color: 'text-red-600',
                bgColor: 'bg-red-50 border-red-200 hover:bg-red-100',
            },
            {
                email: 'waiter@cafesserie.demo.local',
                role: 'Waiter',
                name: 'Rachel Waiter',
                icon: Coffee,
                color: 'text-slate-600',
                bgColor: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
            },
        ]
    }
];
