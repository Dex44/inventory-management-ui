// src/pages/UserPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  // Fetch users from API
  const getUsers = () => {
    axiosInstance
      .get("/list-users/1/10")
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getUsers();
  }, []);

  // Handle delete user
  const handleDelete = async () => {
    try {
      await axiosInstance.post("/delete-user", { user_id: deleteUserId });
      setShowDeletePrompt(false);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <Link
        to="/users/create"
        className="bg-blue-600 text-white p-2 rounded mb-4 inline-block"
      >
        Create New User
      </Link>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.user_id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.Role.role_name}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/users/edit/${user.user_id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteUserId(user.user_id);
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
              Are you sure you want to delete this user?
            </h2>
            <p className="mb-4">
              Username:{" "}
              {users.find((user) => user.user_id === deleteUserId)?.username}
            </p>
            <p className="mb-4">
              Email:{" "}
              {users.find((user) => user.user_id === deleteUserId)?.email}
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

export default UserPage;
