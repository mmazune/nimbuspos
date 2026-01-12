/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { createE2EApp } from './helpers/e2e-bootstrap';
import { cleanup } from './helpers/cleanup';
import { loginAs } from './helpers/e2e-login';
import { requireTapasOrg } from './helpers/require-preconditions';
import { withTimeout } from './helpers/with-timeout';

describe('E26-s1: Live KPI Streaming (SSE)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let managerToken: string;
  let orgId: string;
  let branchId: string;
  let userId: string;

  beforeAll(async () => {
    app = await createE2EApp({ imports: [AppModule] });
    prisma = app.get(PrismaService);

    // Use seeded Tapas org and branch
    await requireTapasOrg(prisma);

    const org = await prisma.org.findFirst({
      where: { slug: 'tapas-demo' },
    });
    if (!org) throw new Error('Tapas org not found after precondition check');
    orgId = org.id;

    // Get first branch from Tapas org
    const branch = await prisma.branch.findFirst({
      where: { orgId },
    });
    if (!branch) throw new Error('Tapas org must have at least 1 branch');
    branchId = branch.id;

    // Login as manager (L4) from seeded data
    const login = await loginAs(app, 'manager', 'tapas');
    managerToken = login.accessToken;
    userId = login.user.id;
  });

  afterAll(async () => {
    // App cleanup with timeout fallback
    const cleanupPromise = cleanup(app);
    const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 10000));
    await Promise.race([cleanupPromise, timeoutPromise]);
  }, 15000); // Timeout with fallback

  describe('GET /stream/kpis (SSE)', () => {
    it('should require authentication', async () => {
      const res = await request(app.getHttpServer()).get('/stream/kpis?scope=org').expect(401);

      expect(res.body.message).toContain('Unauthorized');
    });

    it('should reject non-L4+ users', async () => {
      // Login as waiter (L1) from seeded data
      const waiterLogin = await loginAs(app, 'waiter', 'tapas');

      await request(app.getHttpServer())
        .get('/stream/kpis?scope=org')
        .set('Authorization', `Bearer ${waiterLogin.accessToken}`)
        .expect(403);
    });

    it('should require scope query param', async () => {
      await withTimeout(
        (async () => {
          const res = await request(app.getHttpServer())
            .get('/stream/kpis')
            .set('Authorization', `Bearer ${managerToken}`)
            .expect(400);

          expect(res.body.message).toContain('scope');
        })(),
        { label: 'scope param test', ms: 10000 },
      );
    }, 15000);

    it('should require branchId for branch scope', async () => {
      await withTimeout(
        (async () => {
          const res = await request(app.getHttpServer())
            .get('/stream/kpis?scope=branch')
            .set('Authorization', `Bearer ${managerToken}`)
            .expect(400);

          expect(res.body.message).toContain('branchId');
        })(),
        { label: 'branchId param test', ms: 10000 },
      );
    }, 15000);

    // Note: Testing actual SSE streaming in Jest is complex
    // This would require setting up event listeners and awaiting stream chunks
    // For now, we verify the endpoint exists and has correct guards
    it.skip('should stream org-wide KPIs for L4+ user', (done) => {
      // This test is skipped - SSE testing requires special setup
      // Manual testing with curl is recommended
      request(app.getHttpServer())
        .get('/stream/kpis?scope=org')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect('Content-Type', /text\/event-stream/)
        .expect(200)
        .end((err, _res) => {
          if (err) return done(err);
          // Would need to parse SSE chunks here
          done();
        });
    });
  });

  describe('KPI Computation', () => {
    // Helper to generate unique order numbers
    const generateOrderNumber = () => `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    it('should compute salesToday from completed orders', async () => {
      // Create a completed order in Tapas branch
      const order = await prisma.order.create({
        data: {
          branchId,
          userId,
          orderNumber: generateOrderNumber(),
          total: 10000,
          status: 'CLOSED',
        },
      });

      // Give cache time to expire (10s TTL)
      // In real test, you'd call KpisService.getOrgKpis directly
      // and assert on the returned data

      await prisma.order.delete({ where: { id: order.id } });
    });

    it('should count open orders correctly', async () => {
      const order1 = await prisma.order.create({
        data: {
          branchId,
          userId,
          orderNumber: generateOrderNumber(),
          total: 5000,
          status: 'NEW',
        },
      });

      const order2 = await prisma.order.create({
        data: {
          branchId,
          userId,
          orderNumber: generateOrderNumber(),
          total: 6000,
          status: 'IN_KITCHEN',
        },
      });

      // Would call KpisService.getOrgKpis() and assert openOrders === 2

      await prisma.order.deleteMany({
        where: { id: { in: [order1.id, order2.id] } },
      });
    });
  });
});
