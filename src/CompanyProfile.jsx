import { useEffect, useState } from "react";
import { apiRequest } from "./api";

function CompanyProfile() {
  const [company, setCompany] = useState({
    companyName: "",
    gstNumber: "",
    phone: "",
    email: "",
    address: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    logo: "",
    stampSign: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCompany = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/company");

      if (data.company) {
        setCompany({
          companyName: data.company.companyName || "",
          gstNumber: data.company.gstNumber || "",
          phone: data.company.phone || "",
          email: data.company.email || "",
          address: data.company.address || "",
          bankName: data.company.bankName || "",
          accountNumber: data.company.accountNumber || "",
          ifscCode: data.company.ifscCode || "",
          branch: data.company.branch || "",
          logo: data.company.logo || "",
          stampSign: data.company.stampSign || "",
        });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleChange = (field, value) => {
    setCompany({ ...company, [field]: value });
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setCompany((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const saveCompany = async () => {
    if (!company.companyName) {
      alert("Please enter company name");
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/company", {
        method: "POST",
        body: JSON.stringify(company),
      });

      alert("Company profile saved successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const clearForm = () => {
    setCompany({
      companyName: "",
      gstNumber: "",
      phone: "",
      email: "",
      address: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      logo: "",
      stampSign: "",
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p>Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Company Profile</h2>

      <h3 className="font-bold mb-3 text-blue-700">Company Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-3 rounded"
          placeholder="Company Name"
          value={company.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="GST Number"
          value={company.gstNumber}
          onChange={(e) => handleChange("gstNumber", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Phone Number"
          value={company.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Email"
          value={company.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <div>
          <label className="font-semibold text-sm">Company Logo</label>
          <input
            className="border p-3 rounded w-full"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload("logo", e)}
          />
        </div>

        <div>
          <label className="font-semibold text-sm">Stamp / Signature Image</label>
          <input
            className="border p-3 rounded w-full"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload("stampSign", e)}
          />
        </div>
      </div>

      <textarea
        className="border p-3 rounded w-full mt-4"
        placeholder="Company Address"
        value={company.address}
        onChange={(e) => handleChange("address", e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {company.logo && (
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="font-semibold mb-2">Logo Preview:</p>
            <img
              src={company.logo}
              alt="Company Logo"
              className="w-32 h-32 object-contain border rounded p-2 bg-white"
            />

            <button
              onClick={() => handleChange("logo", "")}
              className="bg-red-500 text-white px-3 py-1 rounded mt-3"
            >
              Remove Logo
            </button>
          </div>
        )}

        {company.stampSign && (
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="font-semibold mb-2">Stamp / Signature Preview:</p>
            <img
              src={company.stampSign}
              alt="Stamp Signature"
              className="w-48 h-28 object-contain border rounded p-2 bg-white"
            />

            <button
              onClick={() => handleChange("stampSign", "")}
              className="bg-red-500 text-white px-3 py-1 rounded mt-3"
            >
              Remove Stamp / Sign
            </button>
          </div>
        )}
      </div>

      <h3 className="font-bold mt-6 mb-3 text-blue-700">Bank Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-3 rounded"
          placeholder="Bank Name"
          value={company.bankName}
          onChange={(e) => handleChange("bankName", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Account Number"
          value={company.accountNumber}
          onChange={(e) => handleChange("accountNumber", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="IFSC Code"
          value={company.ifscCode}
          onChange={(e) => handleChange("ifscCode", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Branch Name"
          value={company.branch}
          onChange={(e) => handleChange("branch", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={saveCompany}
          disabled={saving}
          className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

        <button
          onClick={clearForm}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}

export default CompanyProfile;