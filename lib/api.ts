/**
 * Service centralisé pour les appels API vers le backend Django.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
    useAuth?: boolean;
    params?: Record<string, any>;
}

/**
 * Helper générique pour effectuer des requêtes fetch.
 * Gère automatiquement le rafraîchissement du token sur les erreurs 401.
 */
async function apiRequest<T>(endpoint: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
    const { useAuth = true, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Ajouter le token si demandé
    if (useAuth) {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    let url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`;

    // Append query parameters if present
    if (options.params) {
        const query = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, String(value));
            }
        });
        const queryString = query.toString();
        if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString;
        }
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });

    // Si 401 et pas déjà en retry → tenter de rafraîchir le token
    if (response.status === 401 && useAuth && !isRetry) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            // Relancer la requête originale avec le nouveau token
            return apiRequest<T>(endpoint, options, true);
        } else {
            // Refresh échoué → déconnecter et rediriger
            clearAuthAndRedirect();
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        // Extraire le message d'erreur le plus pertinent
        let errorMessage = "Une erreur est survenue";

        if (data.error) {
            errorMessage = data.error;
        } else if (data.detail) {
            errorMessage = data.detail;
        } else if (typeof data === 'object') {
            // Pour les erreurs de validation Django (ex: { email: ["..."] })
            const firstError = Object.values(data)[0];
            if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
            }
        }

        throw new Error(errorMessage);
    }

    return data as T;
}

/**
 * Tente de rafraîchir le token d'accès en utilisant le refresh_token.
 * Retourne true en cas de succès, false sinon.
 */
async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${BACKEND_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

/**
 * Nettoie les données d'authentification et redirige vers la page de connexion.
 */
export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // Redirection côté client
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}

function clearAuthAndRedirect() {
    logout();
}


/**
 * Auth & Users API
 * API endpoints for user management, authentication, and user operations
 */
export const authApi = {
    // Authentication endpoints
    signup: (userData: { email: string; password: string; full_name?: string; phone?: string }) =>
        apiRequest<any>('/api/users/signup/', {
            method: 'POST',
            body: JSON.stringify(userData),
            useAuth: false
        }),

    login: (credentials: { email: string; password: string }) =>
        apiRequest<any>('/api/users/login/', {
            method: 'POST',
            body: JSON.stringify(credentials),
            useAuth: false
        }),

    // Current user endpoints
    getMe: () =>
        apiRequest<any>('/api/users/me/', {
            method: 'GET'
        }),

    updateMe: (userData: any) =>
        apiRequest<any>('/api/users/me/', {
            method: 'PATCH',
            body: JSON.stringify(userData)
        }),

    // User management endpoints (admin only)
    getUsers: () =>
        apiRequest<any[]>('/api/users/list/', {
            method: 'GET'
        }),

    getUser: (userId: string) =>
        apiRequest<any>(`/api/users/${userId}/`, {
            method: 'GET'
        }),

    updateUser: (userId: string, userData: any) =>
        apiRequest<any>(`/api/users/${userId}/`, {
            method: 'PATCH',
            body: JSON.stringify(userData)
        }),

    deleteUser: (userId: string) =>
        apiRequest<any>(`/api/users/${userId}/`, {
            method: 'DELETE'
        }),

    updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned' | 'inactive') =>
        apiRequest<any>(`/api/users/${userId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    addUser: (userData: { email: string; password: string; full_name?: string; phone?: string; role?: string }) =>
        apiRequest<any>('/api/users/add/', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
};

/**
 * Stores API
 */
export const storesApi = {
    getAll: () =>
        apiRequest<any[]>('/api/stores/', {
            method: 'GET'
        }),

    getPending: () =>
        apiRequest<any[]>('/api/stores/pending/', {
            method: 'GET'
        }),

    validate: (id: number) =>
        apiRequest<any>(`/api/stores/${id}/validate/`, {
            method: 'POST',
            body: JSON.stringify({})
        }),

    reject: (id: number) =>
        apiRequest<any>(`/api/stores/${id}/reject/`, {
            method: 'POST',
            body: JSON.stringify({})
        }),

    getProducts: (storeId: number) =>
        apiRequest<any[]>(`/api/products/store/${storeId}/`, {
            method: 'GET'
        }),
};

/**
 * Products API
 */
export const productsApi = {
    getAll: () =>
        apiRequest<any[]>('/api/products/', {
            method: 'GET'
        }),

    getByStore: (storeId: number) =>
        apiRequest<any[]>(`/api/products/store/${storeId}/`, {
            method: 'GET'
        }),
};

/**
 * Items API (Products and Services)
 */
export const itemsApi = {
    getAll: () =>
        apiRequest<any[]>('/api/items/', {
            method: 'GET'
        }),

    getByStore: (storeId: number) =>
        apiRequest<any[]>(`/api/items/store/${storeId}/`, {
            method: 'GET'
        }),

    listOrphaned: () =>
        apiRequest<any[]>('/api/items/orphaned/', {
            method: 'GET'
        }),

    deleteOrphaned: () =>
        apiRequest<any>('/api/items/orphaned/delete/', {
            method: 'DELETE'
        }),
};

/**
 * Orders API
 * API endpoints for order management and operations
 */
export const ordersApi = {
    // Get all orders (admin only)
    getAll: () =>
        apiRequest<any[]>('/api/orders/', {
            method: 'GET'
        }),

    // Get orders by store
    getByStore: (storeId: number | string) =>
        apiRequest<any[]>(`/api/orders/store/${storeId}/`, {
            method: 'GET'
        }),

    // Get single order by ID
    getById: (orderId: number | string) =>
        apiRequest<any>(`/api/orders/${orderId}/`, {
            method: 'GET'
        }),

    // Update order status
    updateStatus: (orderId: number | string, status: string) =>
        apiRequest<any>(`/api/orders/${orderId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    // Update full order
    update: (orderId: number | string, data: any) =>
        apiRequest<any>(`/api/orders/${orderId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    // Create order
    create: (data: any) =>
        apiRequest<any>('/api/orders/', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Delete order
    delete: (orderId: number | string) =>
        apiRequest<any>(`/api/orders/${orderId}/`, {
            method: 'DELETE'
        }),
};

/**
 * Drivers API
 * API endpoints for driver management and operations
 */
export const driversApi = {
    // Get all drivers (admin only)
    getAll: () =>
        apiRequest<any[]>('/api/drivers/list/', {
            method: 'GET'
        }),

    // Get single driver by ID
    getById: (driverId: string) =>
        apiRequest<any>(`/api/drivers/${driverId}/`, {
            method: 'GET'
        }),

    // Update driver status
    updateStatus: (driverId: string, status: string) =>
        apiRequest<any>(`/api/drivers/${driverId}/status/`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    // Update full driver
    update: (driverId: string, data: any) =>
        apiRequest<any>(`/api/drivers/${driverId}/update/`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    // Create driver
    create: (data: any) =>
        apiRequest<any>('/api/drivers/add/', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Delete driver
    delete: (driverId: string) =>
        apiRequest<any>(`/api/drivers/${driverId}/delete/`, {
            method: 'DELETE'
        }),

    // Search drivers
    search: (query: string) =>
        apiRequest<any[]>(`/api/drivers/search/?q=${encodeURIComponent(query)}`, {
            method: 'GET'
        }),

    // Get drivers by status
    getByStatus: (status: string) =>
        apiRequest<any[]>(`/api/drivers/by-status/${status}/`, {
            method: 'GET'
        }),

    // Get drivers by vehicle type
    getByVehicleType: (vehicleType: string) =>
        apiRequest<any[]>(`/api/drivers/by-vehicle/${vehicleType}/`, {
            method: 'GET'
        }),
};

/**
 * Reviews API
 * API endpoints for review management, moderation, and operations
 */
export const reviewsApi = {
    // Get all reviews (admin only)
    getAll: () =>
        apiRequest<any[]>('/api/reviews/list/', {
            method: 'GET'
        }),

    // Get single review by ID
    getById: (reviewId: string) =>
        apiRequest<any>(`/api/reviews/${reviewId}/`, {
            method: 'GET'
        }),

    // Update review (content changes)
    update: (reviewId: string, data: any) =>
        apiRequest<any>(`/api/reviews/${reviewId}/update/`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    // Create review
    create: (data: any) =>
        apiRequest<any>('/api/reviews/add/', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Delete review
    delete: (reviewId: string) =>
        apiRequest<any>(`/api/reviews/${reviewId}/delete/`, {
            method: 'DELETE'
        }),

    // Moderate review (change status)
    moderate: (reviewId: string, data: any) =>
        apiRequest<any>(`/api/reviews/${reviewId}/moderate/`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    // Flag review as spam/inappropriate
    flag: (reviewId: string, data: any) =>
        apiRequest<any>(`/api/reviews/${reviewId}/flag/`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Mark review as helpful/unhelpful
    markHelpful: (reviewId: string, action: 'helpful' | 'unhelpful') =>
        apiRequest<any>(`/api/reviews/${reviewId}/helpful/`, {
            method: 'PATCH',
            body: JSON.stringify({ action })
        }),

    // Search reviews
    search: (query: string) =>
        apiRequest<any[]>(`/api/reviews/search/?q=${encodeURIComponent(query)}`, {
            method: 'GET'
        }),

    // Get reviews by status
    getByStatus: (status: string) =>
        apiRequest<any[]>(`/api/reviews/by-status/${status}/`, {
            method: 'GET'
        }),

    // Get reviews by product
    getByProduct: (productId: string) =>
        apiRequest<any[]>(`/api/reviews/by-product/${productId}/`, {
            method: 'GET'
        }),

    // Get reviews by store/business
    getByStore: (storeId: string) =>
        apiRequest<any[]>(`/api/reviews/by-store/${storeId}/`, {
            method: 'GET'
        }),

    // Get reviews by user
    getByUser: (userId: string) =>
        apiRequest<any[]>(`/api/reviews/by-user/${userId}/`, {
            method: 'GET'
        }),
};

/**
 * Fraud API
 */
export const fraudApi = {
    // Get all fraud alerts (combined bookings and orders)
    getAll: () =>
        apiRequest<any[]>('/api/fraud/alerts/', {
            method: 'GET'
        }),

    // Get fraud metrics
    getMetrics: () =>
        apiRequest<any>('/api/fraud/alerts/metrics/', {
            method: 'GET'
        }),

    // Approve an alert
    approve: (id: string) =>
        apiRequest<any>(`/api/fraud/alerts/${id}/approve/`, {
            method: 'POST'
        }),

    // Reject an alert
    reject: (id: string) =>
        apiRequest<any>(`/api/fraud/alerts/${id}/reject/`, {
            method: 'POST'
        }),

    // Send an alert to review (optionally with notes/reasoning)
    review: (id: string, reasoning?: string) =>
        apiRequest<any>(`/api/fraud/alerts/${id}/review/`, {
            method: 'POST',
            body: reasoning ? JSON.stringify({ reasoning }) : undefined
        }),
};

/**
 * Bookings API
 */
export const bookingsApi = {
    // Get all bookings (admin only)
    getAll: () =>
        apiRequest<any[]>('/api/bookings/', {
            method: 'GET'
        }),

    // Get single booking by ID
    getById: (id: number | string) =>
        apiRequest<any>(`/api/bookings/${id}/`, {
            method: 'GET'
        }),

    // Create a new booking
    create: (data: any) =>
        apiRequest<any>('/api/bookings/', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Update booking status
    updateStatus: (id: number | string, status: string) =>
        apiRequest<any>(`/api/bookings/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    // Delete booking
    delete: (id: number | string) =>
        apiRequest<any>(`/api/bookings/${id}/`, {
            method: 'DELETE'
        }),
};

/**
 * Support API
 */
export const supportApi = {
    // Tickets
    getTickets: (filters: any = {}) =>
        apiRequest<any[]>('/api/support/tickets/', {
            method: 'GET',
            params: filters
        }),

    getTicket: (id: string) =>
        apiRequest<any>(`/api/support/tickets/${id}/`, {
            method: 'GET'
        }),

    createTicket: (data: any) =>
        apiRequest<any>('/api/support/tickets/', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    updateTicket: (id: string, data: any) =>
        apiRequest<any>(`/api/support/tickets/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    // Messages (Chat)
    getMessages: (ticketId: string) =>
        apiRequest<any[]>(`/api/support/messages/?ticket_id=${ticketId}`, {
            method: 'GET'
        }),

    sendMessage: (data: { ticket: string; content: string; sender_type?: string }) =>
        apiRequest<any>('/api/support/messages/', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
};

export const transactionsApi = {
    getTransactions: (params?: { 
        status?: string; 
        type?: string; 
        merchant_id?: string | number;
        customer_id?: string;
        search?: string;
    }) =>
        apiRequest<{ count: number; results: any[] }>('/api/transactions/', {
            params
        }),

    getTransactionStats: (params?: { merchant_id?: string | number }) =>
        apiRequest<any>('/api/transactions/stats/', {
            params
        }),

    updateTransactionStatus: (id: string, status: string) =>
        apiRequest<any>(`/api/transactions/${id}/`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        }),
};

// Aliases for backward compatibility or semantic clarity
export const payoutsApi = {
    getPayouts: (params?: any) => transactionsApi.getTransactions({ ...params, type: 'payout' }),
    getPayoutStats: () => transactionsApi.getTransactionStats({ type: 'payout' } as any),
    updatePayoutStatus: transactionsApi.updateTransactionStatus,
};

/**
 * Promotions API
 */
export const promotionsApi = {
    getAll: (params?: { store_id?: number | string; active?: boolean | string }) =>
        apiRequest<any[]>('/api/promotions/', {
            method: 'GET',
            params
        }),

    getById: (id: number | string) =>
        apiRequest<any>(`/api/promotions/${id}/`, {
            method: 'GET'
        }),

    create: (data: any) =>
        apiRequest<any>('/api/promotions/', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    update: (id: number | string, data: any) =>
        apiRequest<any>(`/api/promotions/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    delete: (id: number | string) =>
        apiRequest<any>(`/api/promotions/${id}/`, {
            method: 'DELETE'
        }),

    getStats: () =>
        apiRequest<any>('/api/promotions/stats/', {
            method: 'GET'
        }),
};

