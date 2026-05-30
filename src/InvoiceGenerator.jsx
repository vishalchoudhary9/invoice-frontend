import { useState, useEffect } from "react";
import { apiRequest } from "./api";

const InvoiceGenerator = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    customerName: "",
    customerPhone: "",
    customerGstNumber: "",
    customerPan: "",
    customerAddress: "",
    placeOfSupply: "",
    poNumber: "",
    items: [
      {
        productName: "",
        hsnSac: "",
        qty: "1",
        rate: "",
        discountPercent: "0",
        taxPercent: "18"
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

    // Fetch products for autocomplete/dropdown
    const [products, setProducts] = useState([]);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const data = await apiRequest("/products", {
            method: "GET",
          });
          setProducts(data.products || []);
        } catch (err) {
          console.warn("Could not load products for autocomplete:", err);
        }
      };

      fetchProducts();
    }, []);

  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      // Updating an item in the items array
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else {
      // Updating a top-level field
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productName: "",
          hsnSac: "",
          qty: "1",
          rate: "",
          discountPercent: "0",
          taxPercent: "18"
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) {
      alert("At least one item is required");
      return;
    }
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!formData.invoiceNumber || !formData.invoiceDate || !formData.customerName || formData.items.length === 0) {
        setError("Please fill in all required fields and add at least one item");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const data = await apiRequest("/invoices", {
          method: "POST",
          body: JSON.stringify({
            invoiceNumber: formData.invoiceNumber,
            invoiceDate: formData.invoiceDate,
            customerName: formData.customerName,
            customerPhone: formData.customerPhone || "",
            customerGstNumber: formData.customerGstNumber || "",
            customerPan: formData.customerPan || "",
            customerAddress: formData.customerAddress || "",
            placeOfSupply: formData.placeOfSupply || "",
            poNumber: formData.poNumber || "",
            items: formData.items.map(item => ({
              productName: item.productName,
              hsnSac: item.hsnSac || "",
              qty: Number(item.qty) || 0,
              rate: Number(item.rate) || 0,
              discountPercent: Number(item.discountPercent) || 0,
              taxPercent: Number(item.taxPercent) || 0
            }))
          })
        });

        setSuccess(true);
        setError(null);

        // Reset form after successful submission
        setFormData({
          invoiceNumber: "",
          invoiceDate: "",
          customerName: "",
          customerPhone: "",
          customerGstNumber: "",
          customerPan: "",
          customerAddress: "",
          placeOfSupply: "",
          poNumber: "",
          items: [
            {
              productName: "",
              hsnSac: "",
              qty: "1",
              rate: "",
              discountPercent: "0",
              taxPercent: "18",
              amount: 0
            }
          ]
        });
      } catch (err) {
        setError(err.message);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Creating Invoice...</h2>
        <p className="text-gray-500">Please wait while we create your invoice.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Invoice Created Successfully!</h2>
        <p className="text-gray-600">Your invoice has been saved.</p>
        <button 
          onClick={() => {
            setSuccess(false);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Another Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Invoice</h2>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => handleChange("invoiceNumber", e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="Enter invoice number"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => handleChange("invoiceDate", e.target.value)}
              className="border p-3 rounded w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="Enter customer name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Phone
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="Enter customer phone"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer GST Number
            </label>
            <input
              type="text"
              value={formData.customerGstNumber}
              onChange={(e) => handleChange("customerGstNumber", e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="Enter GST number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer PAN
            </label>
            <input
              type="text"
              value={formData.customerPan}
              onChange={(e) => handleChange("customerPan", e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="Enter PAN number"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Address
          </label>
          <textarea
            value={formData.customerAddress}
            onChange={(e) => handleChange("customerAddress", e.target.value)}
            className="border p-3 rounded w-full"
            placeholder="Enter customer address"
            rows={3}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place of Supply
            </label>
            <input
              type="text"
              value={formData.placeOfSupply}
              onChange={(e) => handleChange("placeOfSupply", e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="Enter place of supply"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO Number
            </label>
            <input
              type="text"
              value={formData.poNumber}
              onChange={(e) => handleChange("poNumber", e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="Enter PO number"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Invoice Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
          
          {formData.items.map((item, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">Item {index + 1}</h4>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    list="product-list"
                    value={item.productName}
                    onChange={(e) => handleChange("productName", e.target.value, index)}
                    className="border p-3 rounded w-full"
                    placeholder="Select or enter product name"
                  />
                  <datalist id="product-list">
                    {products.map(product => (
                      <option key={product._id} value={product.productName}>
                        {product.productName} ({product.hsnSac || 'No HSN/SAC'}) - ₹{Number(product.rate || 0).toFixed(2)}
                      </option>
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSN/SAC
                  </label>
                  <input
                    type="text"
                    value={item.hsnSac}
                    onChange={(e) => handleChange("hsnSac", e.target.value, index)}
                    className="border p-3 rounded w-full"
                    placeholder="Enter HSN/SAC code"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleChange("qty", e.target.value, index)}
                    className="border p-3 rounded w-full"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleChange("rate", e.target.value, index)}
                    className="border p-3 rounded w-full"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={item.discountPercent}
                    onChange={(e) => handleChange("discountPercent", e.target.value, index)}
                    className="border p-3 rounded w-full"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) => handleChange("taxPercent", e.target.value, index)}
                    className="border p-3 rounded w-full"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded disabled:bg-gray-400"
          >
            {loading ? "Creating Invoice..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceGenerator;