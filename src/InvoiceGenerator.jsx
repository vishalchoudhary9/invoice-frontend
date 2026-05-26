import { useEffect, useState } from "react";
import { apiRequest } from "./api";

function InvoiceGenerator() {
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);

  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().slice(0, 10),
    customerName: "",
    customerPhone: "",
    customerGstNumber: "",
    customerPan: "",
    customerAddress: "",
    placeOfSupply: "Madhya Pradesh",
    poNumber: "",
  });

  const [items, setItems] = useState([
    {
      productName: "",
      hsnSac: "",
      qty: 1,
      rate: 0,
      discountPercent: 0,
      taxPercent: 18,
    },
  ]);

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const companyData = await apiRequest("/company");
      const productData = await apiRequest("/products");

      setCompany(companyData.company);
      setProducts(productData.products || []);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvoiceChange = (field, value) => {
    setInvoice({ ...invoice, [field]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleProductSelect = (index, productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      productName: product.productName,
      hsnSac: product.hsnSac || "",
      rate: product.rate || 0,
      taxPercent: product.taxPercent || 18,
    };

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productName: "",
        hsnSac: "",
        qty: 1,
        rate: 0,
        discountPercent: 0,
        taxPercent: 18,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      alert("At least one item required");
      return;
    }

    setItems(items.filter((_, i) => i !== index));
  };

  const getGrossAmount = (item) => {
    return Number(item.qty || 0) * Number(item.rate || 0);
  };

  const getDiscountAmount = (item) => {
    return (getGrossAmount(item) * Number(item.discountPercent || 0)) / 100;
  };

  const getTaxableAmount = (item) => {
    return getGrossAmount(item) - getDiscountAmount(item);
  };

  const getTaxAmount = (item) => {
    return (getTaxableAmount(item) * Number(item.taxPercent || 0)) / 100;
  };

  const getItemTotal = (item) => {
    return getTaxableAmount(item) + getTaxAmount(item);
  };

  const taxableAmount = items.reduce(
    (sum, item) => sum + getTaxableAmount(item),
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) => sum + getDiscountAmount(item),
    0
  );

  const totalTax = items.reduce((sum, item) => sum + getTaxAmount(item), 0);
  const grandTotal = taxableAmount + totalTax;

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  const numberToWords = (num) => {
    num = Math.floor(Number(num || 0));

    if (num === 0) return "Zero";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertLessThanThousand = (n) => {
      let word = "";

      if (n >= 100) {
        word += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }

      if (n >= 20) {
        word += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }

      if (n > 0) {
        word += ones[n] + " ";
      }

      return word.trim();
    };

    let word = "";

    if (num >= 10000000) {
      word += convertLessThanThousand(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }

    if (num >= 100000) {
      word += convertLessThanThousand(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }

    if (num >= 1000) {
      word += convertLessThanThousand(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }

    if (num > 0) {
      word += convertLessThanThousand(num);
    }

    return word.trim();
  };

  const saveInvoice = async () => {
    if (!invoice.customerName) {
      alert("Please enter customer name");
      return;
    }

    const validItems = items.filter((item) => item.productName && item.qty);

    if (validItems.length === 0) {
      alert("Please add at least one product");
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/invoices", {
        method: "POST",
        body: JSON.stringify({
          ...invoice,
          items: validItems,
        }),
      });

      alert("Invoice saved successfully");

      setInvoice({
        invoiceNumber: `INV-${Date.now()}`,
        invoiceDate: new Date().toISOString().slice(0, 10),
        customerName: "",
        customerPhone: "",
        customerGstNumber: "",
        customerPan: "",
        customerAddress: "",
        placeOfSupply: "Madhya Pradesh",
        poNumber: "",
      });

      setItems([
        {
          productName: "",
          hsnSac: "",
          qty: 1,
          rate: 0,
          discountPercent: 0,
          taxPercent: 18,
        },
      ]);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const InvoiceCopy = ({ copyType }) => {
    return (
      <div className="bg-white border-2 border-black text-black text-[11px] max-w-[950px] mx-auto print:max-w-none print:w-full print:break-after-page">
        <div className="grid grid-cols-3 border-b border-black">
          <div></div>
          <div className="text-center font-bold tracking-[5px] py-1 text-blue-700">
            TAX INVOICE
          </div>
          <div className="text-right font-bold pr-2 py-1">{copyType}</div>
        </div>

        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-3 flex gap-3 min-h-[120px]">
            <div className="w-20 h-20 border flex items-center justify-center">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                "LOGO"
              )}
            </div>

            <div>
              <h3 className="font-bold text-[15px]">
                {company?.companyName || "Company Name"}
              </h3>
              <p>
                <b>GSTIN:</b> {company?.gstNumber || "-"}
              </p>
              <p>{company?.address || "-"}</p>
              <p>
                <b>Mobile:</b> {company?.phone || "-"}
              </p>
              <p>
                <b>Email:</b> {company?.email || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="border-r border-b border-black p-3">
              <b>Invoice #:</b>
              <br />
              {invoice.invoiceNumber}
            </div>

            <div className="border-b border-black p-3">
              <b>Invoice Date:</b>
              <br />
              {invoice.invoiceDate}
            </div>

            <div className="border-r border-b border-black p-3">
              <b>Place of Supply:</b>
              <br />
              {invoice.placeOfSupply}
            </div>

            <div className="border-b border-black p-3">
              <b>PO Number:</b>
              <br />
              {invoice.poNumber || "-"}
            </div>
          </div>
        </div>

        <div className="border-b border-black p-3 min-h-[95px]">
          <b>Customer Details:</b>
          <p className="font-bold">{invoice.customerName || "Customer Name"}</p>
          <p>
            <b>GSTIN:</b> {invoice.customerGstNumber || "-"}
          </p>
          <p>
            <b>PAN:</b> {invoice.customerPan || "-"}
          </p>
          <p>
            <b>Billing Address:</b> {invoice.customerAddress || "-"}
          </p>
          <p>
            <b>Phone:</b> {invoice.customerPhone || "-"}
          </p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-r border-b border-black p-1">#</th>
              <th className="border-r border-b border-black p-1 text-left">
                Item
              </th>
              <th className="border-r border-b border-black p-1">HSN/SAC</th>
              <th className="border-r border-b border-black p-1">Qty</th>
              <th className="border-r border-b border-black p-1 text-right">
                Rate
              </th>
              <th className="border-r border-b border-black p-1 text-right">
                Disc
              </th>
              <th className="border-r border-b border-black p-1 text-right">
                Taxable
              </th>
              <th className="border-r border-b border-black p-1 text-right">
                Tax
              </th>
              <th className="border-b border-black p-1 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="h-10 align-top">
                <td className="border-r border-black p-1">{index + 1}</td>
                <td className="border-r border-black p-1 font-bold">
                  {item.productName || "-"}
                </td>
                <td className="border-r border-black p-1 text-center">
                  {item.hsnSac || "-"}
                </td>
                <td className="border-r border-black p-1 text-center">
                  {item.qty}
                </td>
                <td className="border-r border-black p-1 text-right">
                  {formatCurrency(item.rate)}
                </td>
                <td className="border-r border-black p-1 text-right">
                  {item.discountPercent || 0}%
                </td>
                <td className="border-r border-black p-1 text-right">
                  {formatCurrency(getTaxableAmount(item))}
                </td>
                <td className="border-r border-black p-1 text-right">
                  {formatCurrency(getTaxAmount(item))}
                </td>
                <td className="p-1 text-right">
                  {formatCurrency(getItemTotal(item))}
                </td>
              </tr>
            ))}

            <tr className="h-24">
              <td className="border-r border-t border-black"></td>
              <td className="border-r border-t border-black"></td>
              <td className="border-r border-t border-black"></td>
              <td className="border-r border-t border-black"></td>
              <td className="border-r border-t border-black"></td>
              <td className="border-r border-t border-black"></td>
              <td className="border-r border-t border-black"></td>
              <td className="border-r border-t border-black"></td>
              <td className="border-t border-black"></td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 border-t border-black">
          <div className="border-r border-black p-3">
            <b>Amount in Words:</b>
            <p className="font-bold">
              Rupees {numberToWords(grandTotal)} Only
            </p>
          </div>

          <div className="p-3">
            <div className="flex justify-between font-bold">
              <span>Taxable Amount</span>
              <span>{formatCurrency(taxableAmount)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total Discount</span>
              <span>{formatCurrency(totalDiscount)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>CGST</span>
              <span>{formatCurrency(totalTax / 2)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>SGST</span>
              <span>{formatCurrency(totalTax / 2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-black mt-1 pt-1">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-black">
          <div className="border-r border-black p-3 col-span-2 min-h-[120px]">
            <b>Bank Details:</b>
            <p>
              <b>Bank:</b> {company?.bankName || "-"}
            </p>
            <p>
              <b>Account #:</b> {company?.accountNumber || "-"}
            </p>
            <p>
              <b>IFSC:</b> {company?.ifscCode || "-"}
            </p>
            <p>
              <b>Branch:</b> {company?.branch || "-"}
            </p>
          </div>

          <div className="p-3 text-center min-h-[120px] flex flex-col justify-between">
            <p>For {company?.companyName || "Company Name"}</p>

            <div className="h-16 flex items-center justify-center">
              {company?.stampSign ? (
                <img
                  src={company.stampSign}
                  alt="Stamp Sign"
                  className="h-16 object-contain"
                />
              ) : (
                <span className="border px-4 py-3">Stamp / Sign</span>
              )}
            </div>

            <p>Authorized Signatory</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow print:hidden">
        <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>

        <h3 className="font-bold text-blue-700 mb-3">Invoice Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border p-3 rounded"
            placeholder="Invoice Number"
            value={invoice.invoiceNumber}
            onChange={(e) =>
              handleInvoiceChange("invoiceNumber", e.target.value)
            }
          />

          <input
            className="border p-3 rounded"
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => handleInvoiceChange("invoiceDate", e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="PO Number"
            value={invoice.poNumber}
            onChange={(e) => handleInvoiceChange("poNumber", e.target.value)}
          />
        </div>

        <h3 className="font-bold text-blue-700 mt-6 mb-3">Customer Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border p-3 rounded"
            placeholder="Customer Name"
            value={invoice.customerName}
            onChange={(e) => handleInvoiceChange("customerName", e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Customer Phone"
            value={invoice.customerPhone}
            onChange={(e) =>
              handleInvoiceChange("customerPhone", e.target.value)
            }
          />

          <input
            className="border p-3 rounded"
            placeholder="Customer GST Number"
            value={invoice.customerGstNumber}
            onChange={(e) =>
              handleInvoiceChange("customerGstNumber", e.target.value)
            }
          />

          <input
            className="border p-3 rounded"
            placeholder="Customer PAN"
            value={invoice.customerPan}
            onChange={(e) => handleInvoiceChange("customerPan", e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Place of Supply"
            value={invoice.placeOfSupply}
            onChange={(e) =>
              handleInvoiceChange("placeOfSupply", e.target.value)
            }
          />

          <textarea
            className="border p-3 rounded"
            placeholder="Customer Address"
            value={invoice.customerAddress}
            onChange={(e) =>
              handleInvoiceChange("customerAddress", e.target.value)
            }
          />
        </div>

        <h3 className="font-bold text-blue-700 mt-6 mb-3">Products</h3>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-8 gap-3 border p-3 rounded"
            >
              <select
                className="border p-2 rounded md:col-span-2"
                onChange={(e) => handleProductSelect(index, e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))}
              </select>

              <input
                className="border p-2 rounded"
                placeholder="Product"
                value={item.productName}
                onChange={(e) =>
                  handleItemChange(index, "productName", e.target.value)
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="HSN/SAC"
                value={item.hsnSac}
                onChange={(e) =>
                  handleItemChange(index, "hsnSac", e.target.value)
                }
              />

              <input
                className="border p-2 rounded"
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) =>
                  handleItemChange(index, "qty", Number(e.target.value))
                }
              />

              <input
                className="border p-2 rounded"
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(index, "rate", Number(e.target.value))
                }
              />

              <input
                className="border p-2 rounded"
                type="number"
                placeholder="Discount %"
                value={item.discountPercent}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "discountPercent",
                    Number(e.target.value)
                  )
                }
              />

              <input
                className="border p-2 rounded"
                type="number"
                placeholder="GST %"
                value={item.taxPercent}
                onChange={(e) =>
                  handleItemChange(index, "taxPercent", Number(e.target.value))
                }
              />

              <div className="flex gap-2 md:col-span-8">
                <button
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>

                <p className="font-bold ml-auto">
                  Total: {formatCurrency(getItemTotal(item))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
        >
          Add Item
        </button>

        <div className="mt-6 border-t pt-4 text-right">
          <p>Taxable Amount: {formatCurrency(taxableAmount)}</p>
          <p>Total Discount: {formatCurrency(totalDiscount)}</p>
          <p>Total Tax: {formatCurrency(totalTax)}</p>
          <p className="text-xl font-bold">Grand Total: {formatCurrency(grandTotal)}</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={saveInvoice}
            disabled={saving}
            className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Invoice"}
          </button>

          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Print Original + Duplicate
          </button>
        </div>
      </div>

      <div className="space-y-6 print:space-y-0">
        <InvoiceCopy copyType="ORIGINAL FOR RECIPIENT" />

        <div className="hidden print:block">
          <InvoiceCopy copyType="DUPLICATE FOR SUPPLIER" />
        </div>
      </div>
    </div>
  );
}

export default InvoiceGenerator;