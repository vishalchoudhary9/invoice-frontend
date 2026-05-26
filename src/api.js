const API_URL = "https://invoice-backend-p7be.onrender.com";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server returned HTML. Check VITE_API_URL.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const apiRequest = request;

export const setAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const registerUser = (formData) => {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

export const loginUser = (formData) => {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

export const createInvoice = (formData) => {
  return request("/api/invoices", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

export const getInvoices = () => {
  return request("/api/invoices");
};

export const getInvoiceById = (id) => {
  return request(`/api/invoices/${id}`);
};

export const deleteInvoice = (id) => {
  return request(`/api/invoices/${id}`, {
    method: "DELETE",
  });
};