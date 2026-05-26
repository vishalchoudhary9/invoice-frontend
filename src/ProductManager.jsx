import { useEffect, useState } from "react";
import { apiRequest } from "./api";

function ProductManager() {
  const [products, setProducts] = useState([]);

  const [product, setProduct] = useState({
    productName: "",
    hsnSac: "",
    rate: "",
    taxPercent: 18,
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/products");
      setProducts(data.products || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  const resetForm = () => {
    setProduct({
      productName: "",
      hsnSac: "",
      rate: "",
      taxPercent: 18,
    });
    setEditId(null);
  };

  const addProduct = async () => {
    if (!product.productName || !product.rate) {
      alert("Please enter product name and rate");
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          productName: product.productName,
          hsnSac: product.hsnSac,
          rate: Number(product.rate),
          taxPercent: Number(product.taxPercent),
        }),
      });

      resetForm();
      loadProducts();
      alert("Product added successfully");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (item) => {
    setEditId(item._id);

    setProduct({
      productName: item.productName || "",
      hsnSac: item.hsnSac || "",
      rate: item.rate || "",
      taxPercent: item.taxPercent || 18,
    });
  };

  const updateProduct = async () => {
    if (!product.productName || !product.rate) {
      alert("Please enter product name and rate");
      return;
    }

    try {
      setSaving(true);

      await apiRequest(`/products/${editId}`, {
        method: "PUT",
        body: JSON.stringify({
          productName: product.productName,
          hsnSac: product.hsnSac,
          rate: Number(product.rate),
          taxPercent: Number(product.taxPercent),
        }),
      });

      resetForm();
      loadProducts();
      alert("Product updated successfully");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await apiRequest(`/products/${id}`, {
        method: "DELETE",
      });

      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Product Manager</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          className="border p-3 rounded"
          placeholder="Product Name"
          value={product.productName}
          onChange={(e) => handleChange("productName", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="HSN/SAC"
          value={product.hsnSac}
          onChange={(e) => handleChange("hsnSac", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          type="number"
          placeholder="Fixed Rate"
          value={product.rate}
          onChange={(e) => handleChange("rate", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          type="number"
          placeholder="GST %"
          value={product.taxPercent}
          onChange={(e) => handleChange("taxPercent", e.target.value)}
        />

        {editId ? (
          <div className="flex gap-2">
            <button
              onClick={updateProduct}
              disabled={saving}
              className="bg-green-600 text-white rounded px-4 py-2 w-full disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Update"}
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-600 text-white rounded px-4 py-2 w-full"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addProduct}
            disabled={saving}
            className="bg-blue-700 text-white rounded px-4 py-2 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Add Product"}
          </button>
        )}
      </div>

      <input
        className="border p-3 rounded w-full mb-4"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {products.length === 0 ? (
        <p className="text-gray-500">No products added yet.</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">No product found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border min-w-[800px]">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border p-2 text-left">Product Name</th>
                <th className="border p-2 text-left">HSN/SAC</th>
                <th className="border p-2 text-right">Fixed Rate</th>
                <th className="border p-2 text-right">GST %</th>
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2">{item.hsnSac || "-"}</td>

                  <td className="border p-2 text-right">
                    ₹{Number(item.rate || 0).toFixed(2)}
                  </td>

                  <td className="border p-2 text-right">
                    {item.taxPercent || 0}%
                  </td>

                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editProduct(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductManager;