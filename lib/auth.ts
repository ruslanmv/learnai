/**
 * NextAuth Authentication Configuration
 *
 * This module configures NextAuth.js with Google OAuth and Credentials providers,
 * handles JWT sessions, and implements role-based access control.
 *
 * @module lib/auth
 * @author Ruslan Magana (ruslanmv.com)
 * @license MIT
 */

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

/**
 * Extended user interface with role information
 */
interface ExtendedUser extends User {
  role: Role;
}

/**
 * NextAuth Configuration Options
 *
 * Configures authentication providers, session strategy, callbacks,
 * and custom pages for the authentication flow.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database sessions and accounts
  adapter: PrismaAdapter(prisma),

  // Required secret for JWT encryption and session cookies
  secret: process.env.NEXTAUTH_SECRET,

  // Use JWT strategy for stateless sessions (better for serverless)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom authentication pages
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },

  // Authentication providers
  providers: [
    /**
     * Google OAuth Provider
     * Allows users to sign in with their Google account
     *
     * Setup: https://console.cloud.google.com/apis/credentials
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    /**
     * Credentials Provider
     * Allows users to sign in with email and password
     *
     * @param {Object} credentials - User credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise<User|null>} Authenticated user or null
     */
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your@email.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              role: true,
            },
          });

          // User not found or no password set (OAuth user)
          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          // Return user without password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          } as ExtendedUser;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  /**
   * Callbacks allow customization of authentication behavior
   */
  callbacks: {
    /**
     * JWT Callback
     * Adds custom data to the JWT token
     *
     * @param {Object} params
     * @param {JWT} params.token - JWT token
     * @param {User} params.user - User object (only on sign in)
     * @returns {Promise<JWT>} Modified JWT token
     */
    async jwt({ token, user }) {
      // Initial sign in - add role to token
      if (user) {
        token.role = (user as ExtendedUser).role;
        token.id = user.id;
        return token;
      }

      // Subsequent requests - fetch fresh role from database
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { role: true, id: true },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }

      return token;
    },

    /**
     * Session Callback
     * Adds custom data to the session object
     *
     * @param {Object} params
     * @param {Session} params.session - Session object
     * @param {JWT} params.token - JWT token
     * @returns {Promise<Session>} Modified session
     */
    async session({ session, token }) {
      if (session.user) {
        // Add custom fields to session
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },

    /**
     * Sign In Callback
     * Controls whether user is allowed to sign in
     *
     * @param {Object} params
     * @returns {Promise<boolean>} Whether sign in is allowed
     */
    async signIn({ user, account }) {
      // Allow all sign ins for now
      // Add custom logic here (e.g., email verification, banned users)
      return true;
    },
  },

  /**
   * Events for logging and monitoring
   */
  events: {
    async signIn({ user }) {
      console.log(`✓ User signed in: ${user.email}`);
    },
    async signOut({ session }) {
      console.log(`✓ User signed out: ${session?.user?.email}`);
    },
  },

  /**
   * Enable debug mode in development
   */
  debug: process.env.NODE_ENV === "development",
};

/**
 * Hash password using bcrypt
 *
 * @param {string} password - Plain text password
 * @param {number} rounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} Hashed password
 *
 * @example
 * ```typescript
 * const hashed = await hashPassword('mypassword');
 * ```
 */
export async function hashPassword(
  password: string,
  rounds: number = 12
): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  return await bcrypt.hash(password, rounds);
}

/**
 * Verify password against hash
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Whether password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword('mypassword', hashedPassword);
 * ```
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
