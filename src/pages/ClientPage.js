// src/pages/ClientPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  // Fetch clients from API
  const getClients = () => {
    axiosInstance
      .post("/list-clients", {
        page: 1,
        limit: 100,
      })
      .then((response) => {
        setClients(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getClients();
  }, []);

  // Handle delete client
  const handleDelete = async () => {
    try {
      await axiosInstance.post("/delete-client", { id: deleteClientId });
      setShowDeletePrompt(false);
      getClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Clients</h1>
      <Link
        to="/clients/create"
        className="bg-blue-600 text-white p-2 rounded mb-4 inline-block"
      >
        Create New Client
      </Link>

      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b">
                  <td className="px-4 py-2">{client?.id}</td>
                  <td className="px-4 py-2">{client?.name}</td>
                  <td className="px-4 py-2">{client?.email}</td>
                  <td className="px-4 py-2">{client?.mobile}</td>
                  <td className="px-4 py-2">{client?.address}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/clients/edit/${client?.id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteClientId(client?.id);
                        setShowDeletePrompt(true);
                      }}
                      className="text-red-600 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeletePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete this client?
            </h2>
            <p className="mb-4">
              Clientname:{" "}
              {
                clients.find((client) => client.id === deleteClientId)
                  ?.name
              }
            </p>
            <p className="mb-4">
              Email:{" "}
              {
                clients.find((client) => client.id === deleteClientId)
                  ?.email
              }
            </p>
            <div>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeletePrompt(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
