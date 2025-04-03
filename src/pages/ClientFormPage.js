import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ClientFormPage = () => {
  const { id: clientId } = useParams(); // Get clientId from URL params (null for Create)
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch existing client data if editing
  useEffect(() => {
    if (clientId) {
      setLoading(true);
      axiosInstance
        .get(`/get-client/${clientId}`)
        .then((response) => {
          const { name, mobile, email, address } = response.data.data;
          setName(name);
          setMobile(mobile);
          setEmail(email);
          setAddress(address);
        })
        .catch(() => {
          setError("Failed to fetch client details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (clientId) {
        // Update client
        await axiosInstance.post("/update-client/", {
          id: clientId,
          name,
          mobile,
          email,
          address,
        });
      } else {
        // Create new client
        await axiosInstance.post("/create-client", {
          name,
          mobile,
          email,
          address,
        });
      }
      navigate("/clients");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {clientId ? "Edit Client" : "Create New Client"}
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Mobile</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Address</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {clientId ? "Update Client" : "Create Client"}
        </button>
      </form>
    </div>
  );
};

export default ClientFormPage;
