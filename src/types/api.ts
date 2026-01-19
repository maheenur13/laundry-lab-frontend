/**
 * Standard API response structure.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * API error response.
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
  timestamp: string;
  path: string;
}

/**
 * Paginated response.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
