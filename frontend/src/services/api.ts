// Central API service — all fetch calls go through here.
// The Vite dev server proxies /api/* → http://localhost:5000
// so no CORS issues during development.

const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** Build headers with the Flask-Security auth token */
const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authentication-Token": token } : {}),
  };
};

async function request<T>(
  method: string,
  url: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: authHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data as T;
}

// ── Role mapping ─────────────────────────────────────────────────────────────
// Backend roles: owner / server / customer
// Frontend roles: admin / waiter / customer

export type FrontendRole = "admin" | "waiter" | "customer";
type BackendRole = "owner" | "server" | "customer";

export const toBackendRole = (r: FrontendRole): BackendRole => {
  if (r === "admin") return "owner";
  if (r === "waiter") return "server";
  return "customer";
};

export const toFrontendRole = (r: string): FrontendRole => {
  if (r === "owner") return "admin";
  if (r === "server") return "waiter";
  return "customer";
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginResponse {
  id: number;
  email: string;
  role: string;
  name?: string;
  "auth-token": string;
  message: string;
}

export const apiLogin = (email: string, password: string) =>
  request<LoginResponse>("POST", "/api/login", { email, password });

export const apiRegister = (
  name: string,
  email: string,
  password: string,
  role: FrontendRole
) =>
  request<{ message: string }>("POST", "/api/register", {
    name,
    email,
    password,
    role: toBackendRole(role),
  });

export const apiLogout = () =>
  request<{ message: string }>("POST", "/api/logout");

export const apiGetCurrentUser = () =>
  request<{ name: string; email: string; role: string }>("GET", "/api/user");

// ── Categories ───────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
}

export const apiGetCategories = () =>
  request<{ categories: Category[] }>("GET", "/api/categories");

export const apiCreateCategory = (name: string) =>
  request<{ message: string; id: number }>("POST", "/api/categories", { name });

export const apiDeleteCategory = (id: number) =>
  request<{ message: string }>("DELETE", `/api/categories/${id}`);

// ── Menu ─────────────────────────────────────────────────────────────────────
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  description?: string;
  category?: string;
  category_id?: number;
}

export const apiGetMenu = () =>
  request<{ menu: MenuItem[] }>("GET", "/api/menu");

export const apiCreateMenuItem = (item: {
  name: string;
  description: string;
  price: number;
  category_id: number;
  is_available: boolean;
}) => request<{ message: string; id: number }>("POST", "/api/menu", item);

export const apiUpdateMenuItem = (
  id: number,
  item: Partial<{
    name: string;
    description: string;
    price: number;
    category_id: number;
    is_available: boolean;
  }>
) => request<{ message: string }>("PUT", `/api/menu/${id}`, item);

export const apiDeleteMenuItem = (id: number) =>
  request<{ message: string }>("DELETE", `/api/menu/${id}`);

// ── Tables ───────────────────────────────────────────────────────────────────
export interface Table {
  id: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
}

export const apiGetTables = () =>
  request<{ tables: Table[] }>("GET", "/api/tables");

export const apiCreateTable = (capacity: number, status = "available") =>
  request<{ message: string; table_id: number }>("POST", "/api/tables", {
    capacity,
    status,
  });

export const apiUpdateTable = (
  id: number,
  updates: { capacity?: number; status?: string }
) => request<{ message: string }>("PUT", `/api/tables/${id}`, updates);

export const apiDeleteTable = (id: number) =>
  request<{ message: string }>("DELETE", `/api/tables/${id}`);

// ── Orders ───────────────────────────────────────────────────────────────────
export interface Order {
  id: number;
  status: string;
  total?: number;
  table_id?: number;
}

export const apiGetOrders = () =>
  request<{ orders: Order[] }>("GET", "/api/orders");

export const apiCreateOrder = (table_id: number) =>
  request<{ message: string; order_id: number }>("POST", "/api/orders", {
    table_id,
  });

export const apiCompleteOrder = (order_id: number) =>
  request<{ message: string }>("PUT", `/api/orders/${order_id}`);

// ── Order Items ───────────────────────────────────────────────────────────────
export const apiAddOrderItem = (
  order_id: number,
  menu_item_id: number,
  quantity: number
) =>
  request<{ message: string }>("POST", "/api/order_items", {
    order_id,
    menu_item_id,
    quantity,
  });

// ── Feedback ─────────────────────────────────────────────────────────────────
export interface Feedback {
  rating: number;
  comment: string;
}

export const apiGetFeedback = () =>
  request<{ feedback: Feedback[] }>("GET", "/api/feedback");

export const apiPostFeedback = (
  user_id: number,
  menu_item_id: number | null,
  rating: number,
  comment: string
) =>
  request<{ message: string }>("POST", "/api/feedback", {
    user_id,
    menu_item_id,
    rating,
    comment,
  });
