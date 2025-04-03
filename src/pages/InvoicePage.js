// src/pages/InvoicePage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import FormatDate from "../utils/formatDate";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [role, setRole] = useState(null);

  // Fetch invoices from API
  const getInvoices = () => {
    axiosInstance
      .post("/list-invoice", {
        // client_id: 1,
        page: 1,
        limit: 100,
      })
      .then((response) => {
        setInvoices(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setRole(userData.Role.role_name);
    getInvoices();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Invoices</h1>
      <Link
        to="/invoice/create"
        className="bg-blue-600 text-white p-2 rounded mb-4 inline-block"
      >
        Create New Invoice
      </Link>

      {loading ? (
        <p>Loading invoices...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Approved By</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 &&
                invoices.map((invoice) => (
                  <tr key={invoice?.id} className="border-b">
                    <td className="px-4 py-2">{invoice?.id}</td>
                    <td className="px-4 py-2">{invoice?.client.name}</td>
                    <td className="px-4 py-2">{invoice?.amount}</td>
                    <td className="px-4 py-2">
                      {invoice?.approver ? "Approved" : "Pending"}
                    </td>
                    <td className="px-4 py-2">{invoice?.creator?.username}</td>
                    <td className="px-4 py-2">{invoice?.approver?.username}</td>
                    <td className="px-4 py-2">
                      {FormatDate(invoice?.updated_at)}
                    </td>
                    {role == "Admin" ? (
                      <td className="px-4 py-2">
                        {invoice?.approver ? (
                          <Link
                            to={`/invoice/view/${invoice?.id}`}
                            className="text-green-600"
                          >
                            View
                          </Link>
                        ) : (
                          <>
                            <Link
                              to={`/invoice/edit/${invoice?.id}`}
                              className="text-blue-600"
                            >
                              Edit
                            </Link>
                          </>
                        )}
                      </td>
                    ) : (
                      <td className="px-4 py-2">
                        <Link
                          to={`/invoice/view/${invoice?.id}`}
                          className="text-blue-600"
                        >
                          View Invoice
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
