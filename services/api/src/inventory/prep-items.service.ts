/**
 * M80 Prep Items Service
 * 
 * Manages semi-finished goods (prep items) with ingredient composition:
 * - Prep item CRUD with line management
 * - Ingredient quantities with UOM support
 * - Yield quantity and prep time tracking
 * - Cost computation from ingredient costs
 */
import {
    Injectable,
    Logger,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@chefcloud/db';

const Decimal = Prisma.Decimal;
type Decimal = Prisma.Decimal;

// DTOs
export interface CreatePrepItemDto {
    branchId: string;
    name: string;
    yieldQty: number | string;
    yieldUomId: string;
    prepMinutes?: number;
    notes?: string;
    lines: CreatePrepLineDto[];
}

export interface CreatePrepLineDto {
    inventoryItemId: string;
    qty: number | string;
    uomId: string;
    notes?: string;
}

export interface UpdatePrepItemDto {
    name?: string;
    yieldQty?: number | string;
    yieldUomId?: string;
    prepMinutes?: number;
    notes?: string;
    isActive?: boolean;
}

export interface PrepItemQueryOptions {
    branchId?: string;
    isActive?: boolean;
    search?: string;
    includeLines?: boolean;
    limit?: number;
    offset?: number;
}

@Injectable()
export class PrepItemsService {
    private readonly logger = new Logger(PrepItemsService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Create a prep item with lines
     */
    async create(
        orgId: string,
        userId: string,
        dto: CreatePrepItemDto,
    ) {
        this.logger.log(`Creating prep item "${dto.name}" for branch ${dto.branchId}`);

        // Validate branch exists
        const branch = await this.prisma.client.branch.findFirst({
            where: { id: dto.branchId, orgId },
        });

        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        // Validate inventory items exist
        const itemIds = dto.lines.map(line => line.inventoryItemId);
        const items = await this.prisma.client.inventoryItem.findMany({
            where: { id: { in: itemIds }, orgId },
            select: { id: true },
        });

        if (items.length !== itemIds.length) {
            throw new BadRequestException('One or more inventory items not found');
        }

        // Validate UOMs exist
        const uomIds = [dto.yieldUomId, ...dto.lines.map(line => line.uomId)];
        const uoms = await this.prisma.client.unitOfMeasure.findMany({
            where: { id: { in: uomIds }, orgId },
            select: { id: true },
        });

        if (uoms.length !== new Set(uomIds).size) {
            throw new BadRequestException('One or more units of measure not found');
        }

        // Create prep item with lines in transaction
        const prepItem = await this.prisma.client.$transaction(async (tx) => {
            const created = await tx.prepItem.create({
                data: {
                    orgId,
                    branchId: dto.branchId,
                    name: dto.name,
                    yieldQty: new Decimal(dto.yieldQty),
                    yieldUomId: dto.yieldUomId,
                    prepMinutes: dto.prepMinutes || 0,
                    notes: dto.notes,
                    createdById: userId,
                    lines: {
                        create: dto.lines.map((line) => ({
                            inventoryItemId: line.inventoryItemId,
                            qty: new Decimal(line.qty),
                            uomId: line.uomId,
                            notes: line.notes,
                        })),
                    },
                },
                include: {
                    branch: { select: { id: true, name: true } },
                    yieldUom: { select: { id: true, code: true, name: true } },
                    createdBy: { select: { id: true, firstName: true, lastName: true } },
                    lines: {
                        include: {
                            inventoryItem: { select: { id: true, name: true, sku: true } },
                            uom: { select: { id: true, code: true, name: true } },
                        },
                    },
                },
            });

            return created;
        });

        this.logger.log(`Prep item ${prepItem.id} created with ${dto.lines.length} lines`);
        return prepItem;
    }

    /**
     * Get prep item by ID
     */
    async getById(orgId: string, prepItemId: string) {
        const prepItem = await this.prisma.client.prepItem.findFirst({
            where: { id: prepItemId, orgId },
            include: {
                branch: { select: { id: true, name: true } },
                yieldUom: { select: { id: true, code: true, name: true } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
                lines: {
                    include: {
                        inventoryItem: { 
                            select: { 
                                id: true, 
                                name: true, 
                                sku: true,
                                unit: true,
                            } 
                        },
                        uom: { select: { id: true, code: true, name: true } },
                    },
                },
            },
        });

        if (!prepItem) {
            throw new NotFoundException('Prep item not found');
        }

        return prepItem;
    }

    /**
     * List prep items with filters
     */
    async list(orgId: string, options: PrepItemQueryOptions = {}) {
        const {
            branchId,
            isActive = true,
            search,
            includeLines = false,
            limit = 50,
            offset = 0,
        } = options;

        const where: Prisma.PrepItemWhereInput = {
            orgId,
            ...(branchId && { branchId }),
            ...(isActive !== undefined && { isActive }),
            ...(search && {
                name: {
                    contains: search,
                    mode: 'insensitive' as Prisma.QueryMode,
                },
            }),
        };

        const [items, total] = await Promise.all([
            this.prisma.client.prepItem.findMany({
                where,
                include: {
                    branch: { select: { id: true, name: true } },
                    yieldUom: { select: { id: true, code: true, name: true } },
                    createdBy: { select: { id: true, firstName: true, lastName: true } },
                    ...(includeLines && {
                        lines: {
                            include: {
                                inventoryItem: { 
                                    select: { 
                                        id: true, 
                                        name: true, 
                                        sku: true,
                                        unit: true,
                                    } 
                                },
                                uom: { select: { id: true, code: true, name: true } },
                            },
                        },
                    }),
                },
                orderBy: { name: 'asc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.client.prepItem.count({ where }),
        ]);

        return {
            items,
            total,
            limit,
            offset,
        };
    }

    /**
     * Update prep item (basic fields only - no lines update in Phase 1)
     */
    async update(
        orgId: string,
        userId: string,
        prepItemId: string,
        dto: UpdatePrepItemDto,
    ) {
        const existing = await this.prisma.client.prepItem.findFirst({
            where: { id: prepItemId, orgId },
        });

        if (!existing) {
            throw new NotFoundException('Prep item not found');
        }

        const updated = await this.prisma.client.prepItem.update({
            where: { id: prepItemId },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.yieldQty && { yieldQty: new Decimal(dto.yieldQty) }),
                ...(dto.yieldUomId && { yieldUomId: dto.yieldUomId }),
                ...(dto.prepMinutes !== undefined && { prepMinutes: dto.prepMinutes }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
            include: {
                branch: { select: { id: true, name: true } },
                yieldUom: { select: { id: true, code: true, name: true } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
                lines: {
                    include: {
                        inventoryItem: { select: { id: true, name: true, sku: true } },
                        uom: { select: { id: true, code: true, name: true } },
                    },
                },
            },
        });

        this.logger.log(`Prep item ${prepItemId} updated`);
        return updated;
    }

    /**
     * M81: Compute estimated cost for a prep item
     * Cost = Σ(ingredient qty × ingredient unit cost)
     * Uses latest StockBatch unitCost as fallback
     */
    async computeCost(orgId: string, branchId: string, prepItemId: string): Promise<{
        totalCost: number;
        costPerYieldUnit: number;
        ingredientCosts: Array<{
            inventoryItemId: string;
            itemName: string;
            qty: string;
            unitCost: number;
            lineCost: number;
        }>;
    }> {
        // Fetch prep item with lines
        const prepItem = await this.prisma.client.prepItem.findFirst({
            where: { id: prepItemId, orgId },
            include: {
                lines: {
                    include: {
                        inventoryItem: { select: { id: true, name: true } },
                    },
                },
            },
        });

        if (!prepItem) {
            throw new NotFoundException('Prep item not found');
        }

        // Compute cost for each ingredient line
        const ingredientCosts = await Promise.all(
            prepItem.lines.map(async (line) => {
                // Get latest stock batch unit cost for this item
                const latestBatch = await this.prisma.client.stockBatch.findFirst({
                    where: {
                        branchId,
                        itemId: line.inventoryItemId,
                        remainingQty: { gt: 0 },
                    },
                    orderBy: { receivedAt: 'desc' },
                    select: { unitCost: true },
                });

                const unitCost = latestBatch
                    ? Number(latestBatch.unitCost)
                    : 0;

                const qty = Number(line.qty);
                const lineCost = qty * unitCost;

                return {
                    inventoryItemId: line.inventoryItemId,
                    itemName: line.inventoryItem.name,
                    qty: line.qty.toString(),
                    unitCost,
                    lineCost,
                };
            }),
        );

        const totalCost = ingredientCosts.reduce((sum, item) => sum + item.lineCost, 0);
        const yieldQty = Number(prepItem.yieldQty);
        const costPerYieldUnit = yieldQty > 0 ? totalCost / yieldQty : 0;

        return {
            totalCost,
            costPerYieldUnit,
            ingredientCosts,
        };
    }
}
