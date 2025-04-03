import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const UserFormPage = () => {
  const { id: userId } = useParams(); // Get userId from URL params (null for Create)
  const [roleOptions, setRoleOptions] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState(""); // Only used for creating users
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch existing user data if editing
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/list-roles/1/10")
      .then((response) => {
        return response.data.data.map((data) => {
          return { id: data.role_id, label: data.role_name };
        });
      })
      .then((data) => setRoleOptions(data))
      .catch(() => {
        setError("Failed to fetch roles.");
      })
      .finally(() => {
        setLoading(false);
      });

    if (userId) {
      setLoading(true);
      axiosInstance
        .get(`/get-user/${userId}`)
        .then((response) => {
          setUsername(response.data.data.username);
          setEmail(response.data.data.email);
          setRole(response.data.data.role_id);
        })
        .catch(() => {
          setError("Failed to fetch user details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (userId) {
        // Update user
        await axiosInstance.post("/update-user/", {
          name: username,
          email,
          role,
          user_id: userId,
        });
      } else {
        // Create new user
        await axiosInstance.post("/create-user", {
          name: username,
          email,
          role,
          password,
        });
      }
      navigate("/users");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {userId ? "Edit User" : "Create New User"}
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <label className="block text-sm">Role</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            {roleOptions.map((role) => {
              return <option value={role.id}>{role.label}</option>;
            })}
          </select>
        </div>
        {!userId && (
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {userId ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default UserFormPage;
