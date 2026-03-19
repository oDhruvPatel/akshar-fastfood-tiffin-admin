// ============================================
// API Service — Akshar Fast Food Frontend
// Centralised fetch helpers for the backend API
// ============================================

const API_BASE = 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `API error: ${res.status}`);
    }
    return res.json();
}

// ---------- Dashboard ----------
export const dashboardApi = {
    getStats: () => request<{ totalOrders: number; pending: number; confirmed: number; revenue: number }>('/dashboard/stats'),
    getRevenue: () => request<{ day: string; revenue: number }[]>('/dashboard/revenue'),
    getRecentOrders: () => request<any[]>('/dashboard/recent-orders'),
};

// ---------- Orders ----------
export interface OrderItem { menuItemId: string; name: string; quantity: number; price: number; }
export interface Order { id: string; orderId: string; customerName: string; phone: string; address: string; orderType: 'Delivery' | 'Pickup'; items: OrderItem[]; total: number; status: string; assignedDriverId?: string; createdAt: string; updatedAt: string; }

export const ordersApi = {
    list: (params?: { status?: string; search?: string }) => {
        const q = new URLSearchParams();
        if (params?.status) q.set('status', params.status);
        if (params?.search) q.set('search', params.search);
        const qs = q.toString();
        return request<Order[]>(`/orders${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) => request<Order>(`/orders/${id}`),
    create: (data: { customerName: string; items: OrderItem[] }) =>
        request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
        request<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    remove: (id: string) =>
        request<{ message: string }>(`/orders/${id}`, { method: 'DELETE' }),
    assignDriver: (orderId: string, driverId: string) =>
        request<Order>(`/orders/${orderId}/assign-driver`, { method: 'PATCH', body: JSON.stringify({ driverId }) }),
};

// ---------- Menu ----------
export interface MenuItem { id: string; name: string; price: number; category: string; available: boolean; veg: boolean; outOfStock: boolean; bestseller: boolean; color: string; comment?: string; createdAt: string; }

export const menuApi = {
    list: (params?: { category?: string; search?: string }) => {
        const q = new URLSearchParams();
        if (params?.category) q.set('category', params.category);
        if (params?.search) q.set('search', params.search);
        const qs = q.toString();
        return request<MenuItem[]>(`/menu${qs ? `?${qs}` : ''}`);
    },
    getCategories: () => request<string[]>('/menu/categories'),
    getStats: () => request<{ totalItems: number; lowStock: number; mostOrdered: string }>('/menu/stats'),
    get: (id: string) => request<MenuItem>(`/menu/${id}`),
    create: (data: Partial<MenuItem>) =>
        request<MenuItem>('/menu', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<MenuItem>) =>
        request<MenuItem>(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleAvailability: (id: string) =>
        request<MenuItem>(`/menu/${id}/availability`, { method: 'PATCH' }),
    remove: (id: string) =>
        request<{ message: string }>(`/menu/${id}`, { method: 'DELETE' }),
};

// ---------- Drivers ----------
export interface Driver { id: string; driverId: string; name: string; initials: string; car: string; status: string; rating: number; phone: string; trip?: string; lastActive?: string; issue?: string; createdAt: string; }

export const driversApi = {
    list: (params?: { status?: string }) => {
        const q = new URLSearchParams();
        if (params?.status) q.set('status', params.status);
        const qs = q.toString();
        return request<Driver[]>(`/drivers${qs ? `?${qs}` : ''}`);
    },
    getStats: () => request<{ totalDrivers: number; activeNow: number; avgDeliveryTime: string }>('/drivers/stats'),
    get: (id: string) => request<Driver>(`/drivers/${id}`),
    create: (data: { name: string; car: string; phone: string }) =>
        request<Driver>('/drivers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Driver>) =>
        request<Driver>(`/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
        request<Driver>(`/drivers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    remove: (id: string) =>
        request<{ message: string }>(`/drivers/${id}`, { method: 'DELETE' }),
    getOrders: (id: string) => request<Order[]>(`/drivers/${id}/orders`),
    sendList: (id: string) =>
        request<{ message: string; text: string; orderCount: number; phone: string }>(`/drivers/${id}/send-list`, { method: 'POST' }),
};

// ---------- Payments ----------
export interface Transaction { id: string; date: string; time: string; orderId: string; amount: number; status: string; }

export const paymentsApi = {
    getSummary: () => request<{ balance: number; totalEarnings: number; pendingPayouts: number; completedPayouts: number }>('/payments/summary'),
    getTransactions: (params?: { status?: string }) => {
        const q = new URLSearchParams();
        if (params?.status) q.set('status', params.status);
        const qs = q.toString();
        return request<Transaction[]>(`/payments/transactions${qs ? `?${qs}` : ''}`);
    },
    getEarnings: () => request<{ totalEarnings: number; settledAmount: number; pendingAmount: number; refundedAmount: number; transactionCount: number }>('/payments/earnings'),
};
