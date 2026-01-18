/**
 * E42-s1: Bookings Controller (Private/Admin)
 *
 * Authenticated endpoints for event management and booking administration.
 * Requires L2+ for booking operations, L4+ for event management.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { IdempotencyInterceptor } from '../common/idempotency.interceptor';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  /**
   * GET /bookings/list
   * List all bookings for the org (L2+)
   */
  @Get('list')
  @Roles('L2', 'L3', 'L4', 'L5')
  async listBookings(@Request() req: any): Promise<any> {
    return this.bookingsService.prisma.client.eventBooking.findMany({
      where: {
        event: {
          orgId: req.user.orgId,
        },
      },
      include: {
        event: true,
        eventTable: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  /**
   * POST /bookings/events
   * Create or update event with tables (L4+)
   */
  @Post('events')
  @Roles('L4', 'L5')
  async upsertEvent(
    @Body()
    body: {
      id?: string;
      orgId: string;
      branchId: string;
      title: string;
      slug?: string;
      description?: string;
      startsAt: string;
      endsAt: string;
      tables: Array<{
        id?: string;
        label: string;
        capacity: number;
        price: number;
        minSpend?: number;
        deposit: number;
      }>;
    },
  ): Promise<any> {
    return this.bookingsService.upsertEvent({
      ...body,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
      tables: body.tables.map((t) => ({
        ...t,
        minSpend: t.minSpend ?? 0, // Default to 0 if not provided
      })),
    });
  }

  /**
   * POST /bookings/events/:id/publish
   * Publish event (L4+)
   */
  @Post('events/:id/publish')
  @Roles('L4', 'L5')
  async publishEvent(@Param('id') id: string): Promise<any> {
    return this.bookingsService.publishEvent(id);
  }

  /**
   * POST /bookings/events/:id/unpublish
   * Unpublish event (L4+)
   */
  @Post('events/:id/unpublish')
  @Roles('L4', 'L5')
  async unpublishEvent(@Param('id') id: string): Promise<any> {
    return this.bookingsService.unpublishEvent(id);
  }

  /**
   * GET /bookings/events/:id
   * Get event details with all bookings (L2+)
   */
  @Get('events/:id')
  @Roles('L2', 'L3', 'L4', 'L5')
  async getEvent(@Param('id') id: string, @Request() req: any): Promise<any> {
    const event = await this.bookingsService.prisma.client.event.findUnique({
      where: {
        id,
        orgId: req.user.orgId,
      },
      include: {
        tables: {
          include: {
            bookings: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  /**
   * POST /bookings/:id/confirm
   * Manually confirm booking (L2+)
   */
  @Post(':id/confirm')
  @Roles('L2', 'L3', 'L4', 'L5')
  @UseInterceptors(IdempotencyInterceptor)
  async confirmBooking(@Param('id') id: string, @Request() req: any): Promise<any> {
    return this.bookingsService.confirmBooking(id, req.user.id);
  }

  /**
   * POST /bookings/:id/cancel
   * Cancel booking (L2+)
   */
  @Post(':id/cancel')
  @Roles('L2', 'L3', 'L4', 'L5')
  @UseInterceptors(IdempotencyInterceptor)
  async cancelBooking(@Param('id') id: string): Promise<any> {
    return this.bookingsService.cancelBooking(id);
  }

  /**
   * GET /bookings/:id
   * Get full booking details (L2+)
   * IMPORTANT: This route MUST come after /bookings/list to avoid conflicts
   */
  @Get(':id')
  @Roles('L2', 'L3', 'L4', 'L5')
  async getBooking(@Param('id') id: string, @Request() req: any): Promise<any> {
    // Guard against 'list' being captured as ID
    if (id === 'list' || id === 'events') {
      throw new Error('Invalid booking ID');
    }

    const booking = await this.bookingsService.prisma.client.eventBooking.findUnique({
      where: { id },
      include: {
        event: true,
        eventTable: true,
        credits: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Verify org access
    const event = await this.bookingsService.prisma.client.event.findUnique({
      where: { id: booking.eventId },
    });

    if (event?.orgId !== req.user.orgId) {
      throw new Error('Access denied');
    }

    return booking;
  }
}
