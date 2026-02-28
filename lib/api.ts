/**
 * Service centralisé pour les appels API vers le backend Django.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
    useAuth?: boolean;
}

/**
 * Helper générique pour effectuer des requêtes fetch.
 */
async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
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
};

/**
 * Stores API
 */
export const storesApi = {
    getPending: () =>
        apiRequest<any[]>('/api/stores/pending/', {
            method: 'GET'
        }),

    validate: (id: number) =>
        apiRequest<any>(`/api/stores/${id}/validate/`, {
            method: 'POST'
        }),

    reject: (id: number) =>
        apiRequest<any>(`/api/stores/${id}/reject/`, {
            method: 'POST'
        }),
};

/**
 * Autres modules API peuvent être ajoutés ici (ex: subscriptionsApi, storesApi, etc.)
 */
