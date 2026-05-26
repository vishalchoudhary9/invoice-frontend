import { useEffect, useState } from "react";
import { apiRequest } from "./api";

function InvoiceHistory() {
  const [company, setCompany] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

  const loadData = async () => {
    try {
      setLoading(true);

      const companyData = await apiRequest("/company");
      const invoiceData = await apiRequest("/invoices");

      setCompany(companyData.company);
      setInvoices(invoiceData.invoices || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const deleteInvoice = async (id) => {
    const confirmDelete = window.confirm("Delete this invoice?");
    if (!confirmDelete) return;

    try {
      await apiRequest(`/invoices/${id}`, {
        method: "DELETE",
      });

      if (selectedInvoice?._id === id) {
        setSelectedInvoice(null);
      }

      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const InvoiceCopy = ({ invoice, copyType }) => {
    return (
      <div className="invoice-copy mx-auto bg-white text-black border-2 border-black text-[11px] leading-tight max-w-[900px] print:max-w-none print:w-full print:break-after-page">
        <div className="grid grid-cols-3 border-b border-black">
          <div></div>

          <div className="text-center font-bold tracking-[6px] text-blue-700 py-1">
            TAX INVOICE
          </div>

          <div className="text-right font-bold tracking-[2px] pr-2 py-1">
            {copyType}
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-3 flex gap-3 min-h-[115px]">
            <div className="w-20 h-20 border flex items-center justify-center shrink-0">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span>LOGO</span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-[15px]">
                {company?.companyName || "COMPANY NAME"}
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
              {invoice.placeOfSupply || "-"}
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
          <p className="font-bold">{invoice.customerName}</p>
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
              <th className="border-r border-b border-black p-1 w-8">#</th>
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
            {(invoice.items || []).map((item, index) => (
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
                  {formatCurrency(item.taxableAmount)}
                </td>
                <td className="border-r border-black p-1 text-right">
                  {formatCurrency(item.taxAmount)}
                </td>
                <td className="p-1 text-right">
                  {formatCurrency(item.totalAmount)}
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
              Rupees {numberToWords(invoice.grandTotal)} Only
            </p>
          </div>

          <div className="p-3">
            <div className="flex justify-between font-bold">
              <span>Taxable Amount</span>
              <span>{formatCurrency(invoice.taxableAmount)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total Discount</span>
              <span>{formatCurrency(invoice.totalDiscount)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>CGST</span>
              <span>{formatCurrency(Number(invoice.totalTax || 0) / 2)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>SGST</span>
              <span>{formatCurrency(Number(invoice.totalTax || 0) / 2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-black mt-1 pt-1">
              <span>Total</span>
              <span>{formatCurrency(invoice.grandTotal)}</span>
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
              <b>IFSC Code:</b> {company?.ifscCode || "-"}
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
                <span className="text-gray-500 border px-4 py-3">
                  Stamp / Sign
                </span>
              )}
            </div>

            <p>Authorized Signatory</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p>Loading invoice history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow print:shadow-none print:p-0">
      <h2 className="text-2xl font-bold mb-4 print:hidden">Invoice History</h2>

      {invoices.length === 0 ? (
        <p className="text-gray-500 print:hidden">No invoice history found.</p>
      ) : (
        <div className="overflow-x-auto print:hidden">
          <table className="w-full border-collapse border min-w-[900px]">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border p-2 text-left">Invoice No</th>
                <th className="border p-2 text-left">Customer</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-right">Total</th>
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="border p-2">{invoice.invoiceNumber}</td>
                  <td className="border p-2">{invoice.customerName}</td>
                  <td className="border p-2">{invoice.customerPhone || "-"}</td>
                  <td className="border p-2">{invoice.invoiceDate}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(invoice.grandTotal)}
                  </td>

                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteInvoice(invoice._id)}
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

      {selectedInvoice && (
        <div className="mt-8">
          <div className="flex gap-3 mb-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Print Original + Duplicate
            </button>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>

          <div className="space-y-6 print:space-y-0">
            <InvoiceCopy
              invoice={selectedInvoice}
              copyType="ORIGINAL FOR RECIPIENT"
            />

            <div className="hidden print:block">
              <InvoiceCopy
                invoice={selectedInvoice}
                copyType="DUPLICATE FOR SUPPLIER"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceHistory;