const API_URL = import.meta.env.VITE_API_URL || "https://invoice-backend-p7be.onrender.com";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Backend URL wrong or server returned HTML");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};