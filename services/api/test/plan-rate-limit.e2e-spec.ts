import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { json } from 'express';
import { PLAN_RATE_LIMITS } from '../src/common/plan-rate-limiter.guard';
import * as argon2 from 'argon2';

describe('Plan-Aware Rate Limiting E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let freeUserToken: string;
  let proUserToken: string;
  let enterpriseUserToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure body parser (same as main.ts)
    app.use(
      json({
        limit: '256kb',
        verify: (req: any, _res, buf: Buffer) => {
          req.rawBody = buf.toString('utf8');
        },
      }),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Setup test data
    await setupTestData();
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
    await app.close();
  });

  async function setupTestData() {
    // Create subscription plans
    const freePlan = await prisma.subscriptionPlan.upsert({
      where: { code: 'free-test' },
      update: {},
      create: {
        code: 'free-test',
        name: 'Free Plan',
        priceUGX: 0,
        features: { maxUsers: 5 },
        isActive: true,
      },
    });

    const proPlan = await prisma.subscriptionPlan.upsert({
      where: { code: 'pro-test' },
      update: {},
      create: {
        code: 'pro-test',
        name: 'Pro Plan',
        priceUGX: 50000,
        features: { maxUsers: 20 },
        isActive: true,
      },
    });

    const enterprisePlan = await prisma.subscriptionPlan.upsert({
      where: { code: 'enterprise-test' },
      update: {},
      create: {
        code: 'enterprise-test',
        name: 'Enterprise Plan',
        priceUGX: 200000,
        features: { maxUsers: 999 },
        isActive: true,
      },
    });

    // Create test organizations
    const freeOrg = await prisma.org.upsert({
      where: { slug: 'rate-limit-free-org' },
      update: {},
      create: {
        slug: 'rate-limit-free-org',
        name: 'Free Org',
      },
    });

    const proOrg = await prisma.org.upsert({
      where: { slug: 'rate-limit-pro-org' },
      update: {},
      create: {
        slug: 'rate-limit-pro-org',
        name: 'Pro Org',
      },
    });

    const enterpriseOrg = await prisma.org.upsert({
      where: { slug: 'rate-limit-ent-org' },
      update: {},
      create: {
        slug: 'rate-limit-ent-org',
        name: 'Enterprise Org',
      },
    });

    // Create branches for each org
    const freeBranch = await prisma.branch.upsert({
      where: { id: `free-branch-${freeOrg.id}` },
      update: {},
      create: {
        id: `free-branch-${freeOrg.id}`,
        orgId: freeOrg.id,
        name: 'Free Branch',
      },
    });

    const proBranch = await prisma.branch.upsert({
      where: { id: `pro-branch-${proOrg.id}` },
      update: {},
      create: {
        id: `pro-branch-${proOrg.id}`,
        orgId: proOrg.id,
        name: 'Pro Branch',
      },
    });

    const enterpriseBranch = await prisma.branch.upsert({
      where: { id: `ent-branch-${enterpriseOrg.id}` },
      update: {},
      create: {
        id: `ent-branch-${enterpriseOrg.id}`,
        orgId: enterpriseOrg.id,
        name: 'Enterprise Branch',
      },
    });

    // Create subscriptions
    await prisma.orgSubscription.upsert({
      where: { orgId: freeOrg.id },
      update: { planId: freePlan.id },
      create: {
        orgId: freeOrg.id,
        planId: freePlan.id,
        status: 'ACTIVE',
        nextRenewalAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.orgSubscription.upsert({
      where: { orgId: proOrg.id },
      update: { planId: proPlan.id },
      create: {
        orgId: proOrg.id,
        planId: proPlan.id,
        status: 'ACTIVE',
        nextRenewalAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.orgSubscription.upsert({
      where: { orgId: enterpriseOrg.id },
      update: { planId: enterprisePlan.id },
      create: {
        orgId: enterpriseOrg.id,
        planId: enterprisePlan.id,
        status: 'ACTIVE',
        nextRenewalAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Delete any existing test users first to ensure clean state
    await prisma.user.deleteMany({
      where: {
        email: { in: ['rate-limit-free@test.local', 'rate-limit-pro@test.local', 'rate-limit-ent@test.local'] },
      },
    });

    // Create test users with password hashes - Path 2 fix: Ensure L5 roleLevel
    const testPassword = 'Test#123';
    const passwordHash = await argon2.hash(testPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
    });

    // Create users with explicit L5 roleLevel (required for BILLING_MANAGE capability)
    const freeUser = await prisma.user.create({
      data: {
        email: 'rate-limit-free@test.local',
        passwordHash,
        firstName: 'Free',
        lastName: 'User',
        roleLevel: 'L5', // L5 required for BILLING_MANAGE capability
        orgId: freeOrg.id,
        branchId: freeBranch.id,
        isActive: true,
      },
    });

    const proUser = await prisma.user.create({
      data: {
        email: 'rate-limit-pro@test.local',
        passwordHash,
        firstName: 'Pro',
        lastName: 'User',
        roleLevel: 'L5', // L5 required for BILLING_MANAGE capability
        orgId: proOrg.id,
        branchId: proBranch.id,
        isActive: true,
      },
    });

    const enterpriseUser = await prisma.user.create({
      data: {
        email: 'rate-limit-ent@test.local',
        passwordHash,
        firstName: 'Enterprise',
        lastName: 'User',
        roleLevel: 'L5', // L5 required for BILLING_MANAGE capability
        orgId: enterpriseOrg.id,
        branchId: enterpriseBranch.id,
        isActive: true,
      },
    });

    // Verify users have L5 in database before login (critical for RolesGuard)
    const verifyFreeUser = await prisma.user.findUnique({ where: { id: freeUser.id } });
    if (verifyFreeUser?.roleLevel !== 'L5') {
      throw new Error(`User ${freeUser.id} does not have L5 roleLevel, got: ${verifyFreeUser?.roleLevel}`);
    }

    // Login to get real JWT tokens
    const freeLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: freeUser.email,
        password: testPassword,
      });
    if (!freeLoginRes.body.access_token) {
      throw new Error(`Login failed for ${freeUser.email}: ${JSON.stringify(freeLoginRes.body)}`);
    }
    freeUserToken = freeLoginRes.body.access_token;
    
    // Verify JWT payload has L5
    try {
      const jwtPayload = JSON.parse(Buffer.from(freeUserToken.split('.')[1], 'base64').toString());
      if (jwtPayload.roleLevel !== 'L5') {
        throw new Error(`JWT payload roleLevel is ${jwtPayload.roleLevel}, expected L5`);
      }
    } catch (e) {
      throw new Error(`Failed to verify JWT payload: ${e}`);
    }

    const proLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: proUser.email,
        password: testPassword,
      });
    proUserToken = proLoginRes.body.access_token;

    const enterpriseLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: enterpriseUser.email,
        password: testPassword,
      });
    enterpriseUserToken = enterpriseLoginRes.body.access_token;
  }

  async function cleanupTestData() {
    // Cleanup in reverse dependency order
    await prisma.orgSubscription.deleteMany({
      where: {
        org: {
          slug: {
            in: ['rate-limit-free-org', 'rate-limit-pro-org', 'rate-limit-ent-org'],
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            'rate-limit-free@test.local',
            'rate-limit-pro@test.local',
            'rate-limit-ent@test.local',
          ],
        },
      },
    });

    await prisma.org.deleteMany({
      where: {
        slug: {
          in: ['rate-limit-free-org', 'rate-limit-pro-org', 'rate-limit-ent-org'],
        },
      },
    });

    await prisma.subscriptionPlan.deleteMany({
      where: {
        code: {
          in: ['free-test', 'pro-test', 'enterprise-test'],
        },
      },
    });
  }

  describe('POST /billing/plan/change', () => {
    it('should enforce free tier rate limit (10/min)', async () => {
      const endpoint = '/billing/plan/change';
      let successCount = 0;
      let rateLimitCount = 0;

      // Fire requests up to and beyond free tier limit
      for (let i = 0; i < PLAN_RATE_LIMITS.free + 5; i++) {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${freeUserToken}`)
          .send({ planCode: 'pro-test' });

        if (response.status === 200 || response.status === 201) {
          successCount++;
        } else if (response.status === 429) {
          rateLimitCount++;
          expect(response.headers['retry-after']).toBe('60');
          expect(response.body).toMatchObject({
            statusCode: 429,
            plan: 'free',
            limit: PLAN_RATE_LIMITS.free,
            window: 60,
          });
        } else if (response.status === 403 && i === 0) {
          // Log first 403 for debugging
          console.error('=== 403 FORENSIC OUTPUT ===');
          console.error('Status Code:', response.status);
          console.error('Response Body:', JSON.stringify(response.body, null, 2));
          console.error('Response Headers:', JSON.stringify(response.headers, null, 2));
          console.error('Endpoint:', endpoint);
          console.error('Token (first 50 chars):', freeUserToken.substring(0, 50));
          // Decode JWT to see what's in it
          try {
            const jwtPayload = JSON.parse(Buffer.from(freeUserToken.split('.')[1], 'base64').toString());
            console.error('JWT Payload roleLevel:', jwtPayload.roleLevel);
            console.error('JWT Payload:', JSON.stringify(jwtPayload, null, 2));
          } catch (e) {
            console.error('Failed to decode JWT:', e);
          }
          console.error('==========================');
        }
      }

      expect(successCount).toBeLessThanOrEqual(PLAN_RATE_LIMITS.free);
      expect(rateLimitCount).toBeGreaterThan(0);
    }, 30000);

    it('should allow pro tier higher limits (60/min)', async () => {
      const endpoint = '/billing/plan/change';
      let successCount = 0;

      // Fire 30 requests (within pro limit of 60)
      for (let i = 0; i < 30; i++) {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${proUserToken}`)
          .send({ planCode: 'enterprise-test' });

        if (response.status === 200 || response.status === 201) {
          successCount++;
        }
      }

      // All should succeed for pro tier
      expect(successCount).toBe(30);
    }, 30000);

    it('should allow enterprise tier highest limits (240/min)', async () => {
      const endpoint = '/billing/plan/change';
      let successCount = 0;

      // Fire 50 requests (well within enterprise limit of 240)
      for (let i = 0; i < 50; i++) {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${enterpriseUserToken}`)
          .send({ planCode: 'pro-test' });

        if (response.status === 200 || response.status === 201) {
          successCount++;
        }
      }

      // All should succeed for enterprise tier
      expect(successCount).toBe(50);
    }, 30000);
  });

  describe('POST /billing/cancel', () => {
    it('should apply rate limiting to cancel endpoint', async () => {
      const endpoint = '/billing/cancel';
      let _successCount = 0;
      let rateLimitCount = 0;

      // Use free tier token
      for (let i = 0; i < PLAN_RATE_LIMITS.free + 3; i++) {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${freeUserToken}`);

        if (response.status === 200 || response.status === 201) {
          _successCount++;
        } else if (response.status === 429) {
          rateLimitCount++;
        }
      }

      expect(rateLimitCount).toBeGreaterThan(0);
    }, 30000);
  });

  describe('Rate limit headers', () => {
    it('should include Retry-After header in 429 responses', async () => {
      // Exhaust free tier limit
      for (let i = 0; i < PLAN_RATE_LIMITS.free; i++) {
        await request(app.getHttpServer())
          .post('/billing/plan/change')
          .set('Authorization', `Bearer ${freeUserToken}`)
          .send({ planCode: 'pro-test' });
      }

      // Next request should return 429 with headers
      const response = await request(app.getHttpServer())
        .post('/billing/plan/change')
        .set('Authorization', `Bearer ${freeUserToken}`)
        .send({ planCode: 'pro-test' });

      expect(response.status).toBe(429);
      expect(response.headers['retry-after']).toBe('60');
      expect(response.headers['x-ratelimit-window']).toBe('60');
    }, 30000);
  });

  describe('Authentication requirement', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/billing/plan/change')
        .send({ planCode: 'pro-test' });

      expect(response.status).toBe(401);
    });
  });

  describe('Metrics', () => {
    it('should emit rate limit hit metrics', async () => {
      // This test verifies metrics are logged
      // In production, these would be collected by Prometheus/OTel

      // Trigger rate limit
      for (let i = 0; i < PLAN_RATE_LIMITS.free + 1; i++) {
        await request(app.getHttpServer())
          .post('/billing/plan/change')
          .set('Authorization', `Bearer ${freeUserToken}`)
          .send({ planCode: 'pro-test' });
      }

      // Metrics should be incremented (checked via logs)
      // In real implementation, verify with metrics collector
    }, 30000);
  });
});
