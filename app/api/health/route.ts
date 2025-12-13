import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Health Check Endpoint
 *
 * This endpoint provides information about the application's health status.
 * It checks:
 * - Basic API responsiveness
 * - Database connectivity
 * - Environment configuration
 *
 * Use this for:
 * - Uptime monitoring services
 * - Load balancer health checks
 * - Status page integrations
 * - CI/CD pipeline verification
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    api: {
      status: 'up';
      responseTime: number;
    };
  };
}

export async function GET() {
  const startTime = Date.now();
  const checks: HealthCheckResponse['checks'] = {
    database: { status: 'down' },
    api: { status: 'up', responseTime: 0 },
  };

  // Check database connectivity
  try {
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStartTime;

    checks.database = {
      status: 'up',
      responseTime: dbResponseTime,
    };
  } catch (error) {
    checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Database connection failed',
    };
  }

  // Calculate API response time
  checks.api.responseTime = Date.now() - startTime;

  // Determine overall health status
  const isHealthy = checks.database.status === 'up';
  const status: HealthCheckResponse['status'] = isHealthy ? 'healthy' : 'degraded';

  const response: HealthCheckResponse = {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks,
  };

  // Return appropriate HTTP status code
  const httpStatus = isHealthy ? 200 : 503;

  return NextResponse.json(response, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
