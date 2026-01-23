/**
 * M80 Prep Items Controller
 * 
 * REST API for prep items management:
 * - RBAC: L2+ read (chef, accountant), L3+ write (chef)
 * - List and detail views
 * - Optional create/update in Phase 1
 */
import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
    PrepItemsService,
    CreatePrepItemDto,
    UpdatePrepItemDto,
} from './prep-items.service';

@Controller('inventory/prep-items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PrepItemsController {
    constructor(private readonly prepItemsService: PrepItemsService) { }

    /**
     * List prep items with optional filters
     */
    @Get()
    @Roles('L2') // Chef + Accountant can view
    async listPrepItems(
        @Request() req: any,
        @Query('branchId') branchId?: string,
        @Query('isActive') isActive?: string,
        @Query('search') search?: string,
        @Query('includeLines') includeLines?: string,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    ): Promise<object> {
        return this.prepItemsService.list(req.user.orgId, {
            branchId,
            isActive: isActive === undefined ? undefined : isActive === 'true',
            search,
            includeLines: includeLines === 'true',
            limit,
            offset,
        });
    }

    /**
     * Get prep item by ID
     */
    @Get(':prepItemId')
    @Roles('L2') // Chef + Accountant can view details
    async getPrepItem(
        @Request() req: any,
        @Param('prepItemId') prepItemId: string,
    ): Promise<object | null> {
        return this.prepItemsService.getById(req.user.orgId, prepItemId);
    }

    /**
     * M81: Get prep item cost breakdown
     * Returns estimated cost based on latest stock batch unit costs
     */
    @Get(':prepItemId/cost')
    @Roles('L2') // Chef + Accountant can view cost
    async getPrepItemCost(
        @Request() req: any,
        @Param('prepItemId') prepItemId: string,
        @Query('branchId') branchId?: string,
    ): Promise<object> {
        // Use branch from prep item if not specified
        const prepItem = await this.prepItemsService.getById(req.user.orgId, prepItemId);
        if (!prepItem) {
            return { error: 'Prep item not found' };
        }
        
        const effectiveBranchId = branchId || prepItem.branchId;
        return this.prepItemsService.computeCost(req.user.orgId, effectiveBranchId, prepItemId);
    }

    /**
     * Create a new prep item (optional in Phase 1)
     */
    @Post()
    @Roles('L3') // Chef can create
    async createPrepItem(
        @Request() req: any,
        @Body() dto: CreatePrepItemDto,
    ): Promise<object> {
        return this.prepItemsService.create(req.user.orgId, req.user.userId, dto);
    }

    /**
     * Update prep item basic fields (optional in Phase 1)
     */
    @Patch(':prepItemId')
    @Roles('L3') // Chef can update
    async updatePrepItem(
        @Request() req: any,
        @Param('prepItemId') prepItemId: string,
        @Body() dto: UpdatePrepItemDto,
    ): Promise<object> {
        return this.prepItemsService.update(req.user.orgId, req.user.userId, prepItemId, dto);
    }
}
