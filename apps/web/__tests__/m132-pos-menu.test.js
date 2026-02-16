"use strict";
/**
 * M13.2: POS Menu Hook Tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const usePosMenu_1 = require("@/hooks/usePosMenu");
describe('M13.2 POS Menu Utilities', () => {
    const mockGroups = [
        {
            groupId: 'group-size',
            groupName: 'Size',
            selectionType: 'SINGLE',
            min: 1,
            max: 1,
            required: true,
            options: [
                { id: 'small', name: 'Small', priceDelta: 0 },
                { id: 'medium', name: 'Medium', priceDelta: 1.0 },
                { id: 'large', name: 'Large', priceDelta: 2.0 },
            ],
        },
        {
            groupId: 'group-toppings',
            groupName: 'Toppings',
            selectionType: 'MULTI',
            min: 0,
            max: 3,
            required: false,
            options: [
                { id: 'cheese', name: 'Cheese', priceDelta: 0.5 },
                { id: 'bacon', name: 'Bacon', priceDelta: 1.0 },
                { id: 'onions', name: 'Onions', priceDelta: 0.25 },
            ],
        },
    ];
    describe('validateModifierSelections', () => {
        it('should pass with valid single selection', () => {
            const result = (0, usePosMenu_1.validateModifierSelections)([{ groupId: 'group-size', optionId: 'medium' }], mockGroups);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should fail when required modifier is missing', () => {
            const result = (0, usePosMenu_1.validateModifierSelections)([], mockGroups);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Size is required');
        });
        it('should fail when SINGLE group has multiple selections', () => {
            const result = (0, usePosMenu_1.validateModifierSelections)([
                { groupId: 'group-size', optionId: 'small' },
                { groupId: 'group-size', optionId: 'large' },
            ], mockGroups);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('one selection'))).toBe(true);
        });
        it('should fail when exceeding max selections', () => {
            const result = (0, usePosMenu_1.validateModifierSelections)([
                { groupId: 'group-size', optionId: 'small' },
                { groupId: 'group-toppings', optionId: 'cheese' },
                { groupId: 'group-toppings', optionId: 'bacon' },
                { groupId: 'group-toppings', optionId: 'onions' },
                { groupId: 'group-toppings', optionId: 'cheese' }, // 4th topping
            ], mockGroups);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('at most 3'))).toBe(true);
        });
        it('should fail with invalid option ID', () => {
            const result = (0, usePosMenu_1.validateModifierSelections)([
                { groupId: 'group-size', optionId: 'invalid-size' },
            ], mockGroups);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('Invalid option'))).toBe(true);
        });
        it('should fail with unknown group', () => {
            const result = (0, usePosMenu_1.validateModifierSelections)([
                { groupId: 'group-size', optionId: 'small' },
                { groupId: 'unknown-group', optionId: 'opt1' },
            ], mockGroups);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('Unknown modifier group'))).toBe(true);
        });
        it('should pass with valid multi selections', () => {
            const result = (0, usePosMenu_1.validateModifierSelections)([
                { groupId: 'group-size', optionId: 'large' },
                { groupId: 'group-toppings', optionId: 'cheese' },
                { groupId: 'group-toppings', optionId: 'bacon' },
            ], mockGroups);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });
    describe('calculateItemPrice', () => {
        it('should calculate base price with no modifiers', () => {
            const result = (0, usePosMenu_1.calculateItemPrice)(5.00, 1, [], mockGroups);
            expect(result.unitPrice).toBe(5.00);
            expect(result.lineTotal).toBe(5.00);
        });
        it('should add modifier price delta', () => {
            const result = (0, usePosMenu_1.calculateItemPrice)(5.00, 1, [{ groupId: 'group-size', optionId: 'large' }], mockGroups);
            expect(result.unitPrice).toBe(7.00); // 5 + 2
            expect(result.lineTotal).toBe(7.00);
        });
        it('should calculate with multiple modifiers', () => {
            const result = (0, usePosMenu_1.calculateItemPrice)(5.00, 1, [
                { groupId: 'group-size', optionId: 'medium' },
                { groupId: 'group-toppings', optionId: 'cheese' },
                { groupId: 'group-toppings', optionId: 'bacon' },
            ], mockGroups);
            // 5 + 1 (medium) + 0.5 (cheese) + 1 (bacon) = 7.5
            expect(result.unitPrice).toBe(7.50);
            expect(result.lineTotal).toBe(7.50);
        });
        it('should multiply by quantity', () => {
            const result = (0, usePosMenu_1.calculateItemPrice)(5.00, 3, [{ groupId: 'group-size', optionId: 'large' }], mockGroups);
            expect(result.unitPrice).toBe(7.00);
            expect(result.lineTotal).toBe(21.00); // 7 * 3
        });
        it('should handle unknown group gracefully', () => {
            const result = (0, usePosMenu_1.calculateItemPrice)(5.00, 1, [{ groupId: 'unknown', optionId: 'opt1' }], mockGroups);
            expect(result.unitPrice).toBe(5.00);
            expect(result.lineTotal).toBe(5.00);
        });
    });
});
//# sourceMappingURL=m132-pos-menu.test.js.map