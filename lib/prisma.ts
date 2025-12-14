/**
 * Prisma Client Configuration
 *
 * This module provides a singleton instance of Prisma Client for database operations.
 * It prevents multiple instances in development (hot reload) and ensures proper
 * connection pooling in production.
 *
 * @module lib/prisma
 * @author Ruslan Magana (ruslanmv.com)
 * @license MIT
 */

import { PrismaClient } from "@prisma/client";

/**
 * Global type augmentation for Prisma Client singleton
 * Prevents TypeScript errors when accessing global.prisma
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client configuration options
 * - In development: Enable query logging for debugging
 * - In production: Only log errors to reduce noise
 */
const prismaClientOptions = {
  log:
    process.env.NODE_ENV === "development"
      ? (["query", "error", "warn"] as any)
      : (["error"] as any),
};

/**
 * Singleton Prisma Client Instance
 *
 * In development, Next.js hot-reloading can cause multiple Prisma Client instances,
 * leading to connection pool exhaustion. We store the client in global scope to
 * prevent this issue.
 *
 * In production, we create a new instance that will be reused across requests.
 *
 * @example
 * ```typescript
 * import { prisma } from '@/lib/prisma';
 *
 * const users = await prisma.user.findMany();
 * ```
 */
export const prisma = global.prisma ?? new PrismaClient(prismaClientOptions);

/**
 * Store Prisma Client in global scope during development
 * This prevents creating multiple instances during hot reloads
 */
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma Client on application shutdown
 * This ensures all database connections are properly closed
 *
 * @example
 * ```typescript
 * process.on('SIGTERM', disconnectPrisma);
 * ```
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("✓ Prisma Client disconnected successfully");
  } catch (error) {
    console.error("✗ Error disconnecting Prisma Client:", error);
    throw error;
  }
}

/**
 * Test database connection
 * Useful for health checks and startup validation
 *
 * @returns {Promise<boolean>} True if connection is successful
 * @throws {Error} If connection fails
 *
 * @example
 * ```typescript
 * const isConnected = await testDatabaseConnection();
 * console.log('Database connected:', isConnected);
 * ```
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database connection successful");
    return true;
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    return false;
  }
}

/**
 * Export Prisma Client type for use in other modules
 * Useful for dependency injection and testing
 */
export type PrismaClientType = typeof prisma;

// Handle graceful shutdown
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    await disconnectPrisma();
  });
}
