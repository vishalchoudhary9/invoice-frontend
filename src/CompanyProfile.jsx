import { useState } from "react";

function CompanyProfile() {
  const savedCompany = JSON.parse(localStorage.getItem("companyProfile"));

  const [company, setCompany] = useState(
    savedCompany || {
      ownerName: "",
      companyName: "",
      phone: "",
      email: "",
      gstNo: "",
      address: "",
      logo: "",
      bankName: "",
      accountNo: "",
      ifscCode: "",
      branchName: "",
      stampSign: "",
    }
  );

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

  const saveCompany = () => {
    localStorage.setItem("companyProfile", JSON.stringify(company));
    alert("Company profile saved successfully!");
  };

  const clearCompany = () => {
    localStorage.removeItem("companyProfile");
    setCompany({
      ownerName: "",
      companyName: "",
      phone: "",
      email: "",
      gstNo: "",
      address: "",
      logo: "",
      bankName: "",
      accountNo: "",
      ifscCode: "",
      branchName: "",
      stampSign: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Company Profile</h2>

      <h3 className="font-bold mb-3 text-blue-700">Company Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-3 rounded"
          placeholder="Owner Name"
          value={company.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Company Name"
          value={company.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
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

        <input
          className="border p-3 rounded"
          placeholder="GST Number"
          value={company.gstNo}
          onChange={(e) => handleChange("gstNo", e.target.value)}
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
      </div>

      <textarea
        className="border p-3 rounded w-full mt-4"
        placeholder="Company Address"
        value={company.address}
        onChange={(e) => handleChange("address", e.target.value)}
      />

      <h3 className="font-bold mt-6 mb-3 text-blue-700">
        Stamp / Signature Permission
      </h3>

      <div className="border rounded-xl p-4 bg-gray-50">
        <label className="font-semibold text-sm">
          Upload Stamp / Signature Image
        </label>

        <input
          className="border p-3 rounded w-full mt-2 bg-white"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload("stampSign", e)}
        />

        {company.stampSign ? (
          <div className="mt-3">
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
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            Owner can upload stamp/sign image here.
          </p>
        )}
      </div>

      {company.logo && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Logo Preview:</p>
          <img
            src={company.logo}
            alt="Company Logo"
            className="w-28 h-28 object-contain border rounded p-2"
          />
        </div>
      )}

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
          value={company.accountNo}
          onChange={(e) => handleChange("accountNo", e.target.value)}
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
          value={company.branchName}
          onChange={(e) => handleChange("branchName", e.target.value)}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={saveCompany}
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>

        <button
          onClick={clearCompany}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default CompanyProfile;