import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaRupeeSign,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import SearchBar from "../components/SearchBar";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [role, setRole] = useState(null);

  // Fetch products from API
  const getProducts = (search) => {
    const params = {
      product_name: search,
      page: 1,
      limit: 100,
    };
    if (search) {
      params.product_name = search;
    } else {
      delete params.product_name;
    }

    axiosInstance
      .post("/list-products", params)
      .then((response) => {
        const data = response.data.data?.products.map((value) => ({
          id: value?.product_id || "",
          name: value?.product_name || "",
          created_at: value?.created_at || "",
          price: value?.price || "",
          description: value?.description || "",
          quantity: value?.quantity || "",
          image: value?.image || "",
          created_by: value?.created_by || "Unknown",
        }));
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setRole(userData?.Role?.role_name);
    getProducts();
  }, []);

  // Toggle row expansion
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle delete product
  const handleDelete = async () => {
    try {
      await axiosInstance.post("/delete-product", {
        product_id: deleteProductId,
      });
      setShowDeletePrompt(false);
      getProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = (searchTerm) => {
    getProducts(searchTerm);
  };

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {/* Page Header */}
          <div className="flex justify-between mt-2">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="flex">
              <SearchBar onSearch={handleSearch} />
              <Link
                to="/products/create"
                className="bg-blue-600 text-white p-2 rounded mb-4 flex items-center gap-1"
              >
                <FaPlus /> Add Product
              </Link>
            </div>
          </div>

          {/* Table for Desktop */}
          <div className="hidden md:block overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 py-2">{product.id}</td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2 flex items-center">
                      <FaRupeeSign className="mr-1" /> {product.price}
                    </td>
                    <td className="px-4 py-2">{product.quantity > 0 ? product.quantity : "Out of Stock"}</td>
                    <td className="px-4 py-2 flex gap-4">
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => {
                          setDeleteProductId(product.id);
                          setShowDeletePrompt(true);
                        }}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Collapsible Rows) */}
          <div className="md:hidden mt-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border p-3 mb-2 bg-white rounded-lg shadow-md"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRow(product.id)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold">{product.name}</span>
                      <span className="text-gray-700">
                        Qty: {product.quantity > 0 ? product.quantity : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaRupeeSign className="inline" /> {product.price}
                    <div className="ml-4">
                      {expandedRows[product.id] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Section */}
                {expandedRows[product.id] && (
                  <div className="mt-3 border-t pt-3 text-sm text-gray-700">
                    <p>
                      <strong>Product ID:</strong> {product.id}
                    </p>
                    <p>
                      <strong>Description:</strong> {product.description}
                    </p>
                    <p>
                      <strong>Created At:</strong> {product.created_at}
                    </p>
                    <div className="mt-3 flex gap-4">
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="text-blue-600 flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => {
                          setDeleteProductId(product.id);
                          setShowDeletePrompt(true);
                        }}
                        className="text-red-600 flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeletePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete this product?
            </h2>
            <p className="mb-4">
              Product Name:{" "}
              {products.find((p) => p.id === deleteProductId)?.name}
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

export default ProductsPage;
