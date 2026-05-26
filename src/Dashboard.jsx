import { useState } from "react";
import CompanyProfile from "./CompanyProfile";
import ProductManager from "./ProductManager";
import InvoiceGenerator from "./InvoiceGenerator";
import InvoiceHistory from "./InvoiceHistory";

function Dashboard({ user, onLogout }) {
  const isOwner = user?.role === "owner";
  const [activeTab, setActiveTab] = useState("invoice");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="print:hidden sticky top-0 z-50 bg-white shadow px-4 py-3 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("invoice")}
            className={`px-4 py-2 rounded ${
              activeTab === "invoice"
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Create Invoice
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded ${
                activeTab === "profile"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Company Profile
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded ${
                activeTab === "products"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Product Manager
            </button>
          )}

          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded ${
              activeTab === "history"
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Invoice History
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{user?.name}</span>
            <span className="ml-1">({user?.role})</span>
          </div>

          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <main className="p-4 pt-6 print:p-0">
        {activeTab === "invoice" && <InvoiceGenerator />}
        {activeTab === "history" && <InvoiceHistory />}

        {isOwner && activeTab === "profile" && <CompanyProfile />}
        {isOwner && activeTab === "products" && <ProductManager />}
      </main>
    </div>
  );
}

export default Dashboard;