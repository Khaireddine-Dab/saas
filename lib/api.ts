/**
 * Service centralisé pour les appels API vers le backend Django.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
    useAuth?: boolean;
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

    const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`;

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
function clearAuthAndRedirect() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // Redirection côté client
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}


/**
 * Auth API
 */
export const authApi = {
    signup: (userData: any) =>
        apiRequest<any>('/api/users/signup/', {
            method: 'POST',
            body: JSON.stringify(userData),
            useAuth: false
        }),

    login: (credentials: any) =>
        apiRequest<any>('/api/users/login/', {
            method: 'POST',
            body: JSON.stringify(credentials),
            useAuth: false
        }),

    getMe: () =>
        apiRequest<any>('/api/users/me/', {
            method: 'GET'
        }),

    updateMe: (userData: any) =>
        apiRequest<any>('/api/users/me/', {
            method: 'PATCH',
            body: JSON.stringify(userData)
        }),

    getUsers: () =>
        apiRequest<any[]>('/api/users/list/', {
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
 * Orders API
 */
export const ordersApi = {
    getAll: () =>
        apiRequest<any[]>('/api/orders/', {
            method: 'GET'
        }),

    getByStore: (storeId: number) =>
        apiRequest<any[]>(`/api/orders/store/${storeId}/`, {
            method: 'GET'
        }),

    getById: (orderId: number) =>
        apiRequest<any>(`/api/orders/${orderId}/`, {
            method: 'GET'
        }),

    updateStatus: (orderId: number, status: string) =>
        apiRequest<any>(`/api/orders/${orderId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),
};

/**
 * Autres modules API peuvent être ajoutés ici (ex: subscriptionsApi, storesApi, etc.)
 */
