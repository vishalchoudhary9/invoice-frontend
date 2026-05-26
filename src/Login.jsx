import { useState } from "react";
import { setAuthData, apiRequest } from "./api";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    if (isSignup && !form.name) {
      alert("Please enter name");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isSignup ? "/auth/signup" : "/auth/login";

      const payload = isSignup
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }
        : {
            email: form.email,
            password: form.password,
          };

      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setAuthData(data.token, data.user);
      onLogin(data.user);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Invoice Generator
        </h1>

        <p className="text-center text-gray-500 mb-6">
          {isSignup ? "Create your account" : "Login to your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              className="border p-3 rounded w-full"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          )}

          <input
            className="border p-3 rounded w-full"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          {isSignup && (
            <select
              className="border p-3 rounded w-full"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="owner">Owner</option>
              <option value="user">User</option>
            </select>
          )}

          <button
            disabled={loading}
            className="bg-blue-700 text-white p-3 rounded w-full disabled:bg-gray-400"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-blue-700 mt-4 w-full"
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Signup"}
        </button>
      </div>
    </div>
  );
}

export default Login;