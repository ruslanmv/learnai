/**
 * Shared TypeScript Type Definitions for LearnAI
 *
 * This file contains all shared types, interfaces, and enums used throughout the application.
 * Centralizing types improves maintainability and ensures consistency.
 *
 * @author Ruslan Magana (ruslanmv.com)
 * @license MIT
 */

import type { Role, BookingStatus, TransactionStatus } from "@prisma/client";

// ============================================================================
// User Types
// ============================================================================

/**
 * Extended user type with role information
 */
export interface ExtendedUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: Role;
}

/**
 * User profile data for registration
 */
export interface UserRegistrationData {
  name?: string;
  email: string;
  password: string;
  role?: Role;
}

/**
 * User login credentials
 */
export interface UserLoginCredentials {
  email: string;
  password: string;
}

// ============================================================================
// Teacher Profile Types
// ============================================================================

/**
 * Teacher profile creation/update data
 */
export interface TeacherProfileData {
  title?: string;
  bio?: string;
  subjects: string[];
  languages: string[];
  hourlyRate: number;
  paypalEmail?: string;
  isActive?: boolean;
}

/**
 * Teacher profile with user information
 */
export interface TeacherProfileWithUser {
  id: string;
  userId: string;
  title?: string | null;
  bio?: string | null;
  subjects: string[];
  languages: string[];
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

/**
 * Simplified teacher data for public display
 */
export interface TeacherPublicInfo {
  id: string;
  name?: string | null;
  title?: string | null;
  bio?: string | null;
  subjects: string[];
  rating: number;
  hourlyRate: number;
  image?: string | null;
}

// ============================================================================
// Booking Types
// ============================================================================

/**
 * Booking creation data
 */
export interface BookingCreateData {
  teacherId: string;
  subject: string;
  topic?: string;
  scheduledFor: Date | string;
  durationMinutes: number;
  priceTotal: number;
}

/**
 * Complete booking information
 */
export interface BookingWithDetails {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  topic?: string | null;
  status: BookingStatus;
  scheduledFor: Date;
  durationMinutes: number;
  teamsMeetingUrl?: string | null;
  whiteboardId?: string | null;
  priceTotal: number;
  createdAt: Date;
  updatedAt: Date;
  student: {
    name?: string | null;
    email?: string | null;
  };
  teacher: {
    name?: string | null;
    email?: string | null;
  };
}

// ============================================================================
// Payment Types
// ============================================================================

/**
 * Payment amount split calculation
 */
export interface PaymentSplit {
  amountTeacher: number;
  platformFee: number;
}

/**
 * Payment order creation data
 */
export interface PaymentOrderData {
  bookingId: string;
  amount: number;
  currency?: string;
}

/**
 * Transaction details
 */
export interface TransactionDetails {
  id: string;
  bookingId: string;
  studentId: string;
  teacherId: string;
  amountTotal: number;
  amountTeacher: number;
  platformFee: number;
  currency: string;
  status: TransactionStatus;
  paypalOrderId?: string | null;
  paypalCaptureId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// AI Types
// ============================================================================

/**
 * AI professor recommendation request
 */
export interface ProfessorRecommendationQuery {
  query: string;
  limit?: number;
}

/**
 * AI professor recommendation response
 */
export interface ProfessorRecommendationResponse {
  teachers: TeacherPublicInfo[];
  explanation: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
  statusCode?: number;
}

/**
 * Generic API response type
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Session Types (NextAuth Extension)
// ============================================================================

/**
 * Extended NextAuth session with custom user data
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Search filters for teachers
 */
export interface TeacherSearchFilters {
  subjects?: string[];
  minRating?: number;
  maxHourlyRate?: number;
  languages?: string[];
  isActive?: boolean;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: BookingWithDetails[];
  topTeachers: TeacherProfileWithUser[];
  topStudents: any[]; // Define more specifically if needed
}

// ============================================================================
// Form Types
// ============================================================================

/**
 * Contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Search form data
 */
export interface SearchFormData {
  query: string;
  filters?: TeacherSearchFilters;
}

// ============================================================================
// Environment Variables Type Safety
// ============================================================================

/**
 * Type-safe environment variables
 */
export interface EnvironmentVariables {
  // Database
  DATABASE_URL: string;

  // NextAuth
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;

  // OAuth
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;

  // OpenAI
  OPENAI_API_KEY?: string;

  // PayPal
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_ENVIRONMENT?: "sandbox" | "live";

  // Application
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_APP_URL?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  PLATFORM_FEE_PERCENTAGE: 0.1, // 10%
  MIN_SESSION_DURATION: 30, // minutes
  MAX_SESSION_DURATION: 180, // minutes
  DEFAULT_CURRENCY: "USD",
  MIN_HOURLY_RATE: 10,
  MAX_HOURLY_RATE: 500,
} as const;

/**
 * API routes constants
 */
export const API_ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/signin",
    LOGOUT: "/api/auth/signout",
  },
  AI: {
    RECOMMEND: "/api/ai/recommend-professors",
  },
  BOOKINGS: {
    CREATE: "/api/bookings",
    LIST: "/api/bookings",
    GET: (id: string) => `/api/bookings/${id}`,
  },
  PAYMENTS: {
    CREATE_ORDER: "/api/payments/create-order",
    CAPTURE: "/api/payments/capture",
  },
} as const;
