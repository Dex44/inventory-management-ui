import React, { useState, useEffect, use } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreateInvoice = () => {
  const { id: userId, pageType } = useParams();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const currentDate = new Date().toLocaleDateString("en-GB");
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getClients = () => {
    axiosInstance
      .post("/list-clients", {
        page: 1,
        limit: 100,
      })
      .then((response) => {
        setClients(response?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getProducts = () => {
    axiosInstance
      .post("/list-products", {
        page: 0,
        limit: 0,
      })
      .then((response) => {
        setProducts(response?.data?.data?.products || []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getClients();
    getProducts();
    const userData = JSON.parse(localStorage.getItem("userData"));
    setRole(userData.Role.role_name);
    setUserData(userData);
    if (userId) {
      setLoading(true);
      axiosInstance
        .get(`/get-invoice/${userId}`)
        .then((response) => {
          const data = response.data.data;
          setSelectedClient(data.client_id);
          setInvoiceProducts([
            ...data.products.map((data) => ({
              id: data.id,
              qty: data.quantity,
              price: data.price,
            })),
          ]);
        })
        .catch(() => {
          setError("Failed to fetch invoice details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const addProduct = () => {
    setInvoiceProducts([...invoiceProducts, { id: "", qty: 1, price: 0 }]);
  };

  const handleProductChange = (index, productId) => {
    const product = products.find((p) => p.product_id === parseInt(productId));
    console.log("selected product", product);

    if (!product) return;
    if (product.quantity < 1) {
      console.log("Product is out of stock.", product);
      toast.error("Product is out of stock.");
      return;
    }
    setInvoiceProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = {
        id: product.product_id,
        qty: 1,
        price: product.price,
      };
      return updatedProducts;
    });
  };

  const handleQtyChange = (index, qty) => {
    setInvoiceProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index].qty = qty;
      return updatedProducts;
    });
  };

  const handlePriceChange = (index, price) => {
    setInvoiceProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index].price = price;
      return updatedProducts;
    });
  };

  const deleteProduct = (index) => {
    setInvoiceProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = invoiceProducts
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  const handleSubmit = (is_approved) => {
    if (!selectedClient) {
      setError("Please select a client.");
      return;
    }
    if (invoiceProducts.length === 0 || invoiceProducts.some((p) => !p.id)) {
      setError("Please add at least one product with a valid selection.");
      return;
    }
    setError("");
    const InvoiceParams = {
      created_by: +userData.user_id,
      amount: +totalAmount,
      client_id: +selectedClient,
      is_approved: is_approved,
      products: invoiceProducts.map((value) => {
        return {
          id: value.id,
          quantity: value.qty,
          price: value.price,
        };
      }),
    };
    if (is_approved) {
      InvoiceParams.approved_by = +userData.user_id;
    } else {
      delete InvoiceParams.approved_by;
    }
    if (userId) {
      InvoiceParams.id = userId;
      delete InvoiceParams.created_by;
      delete InvoiceParams.client_id;
      axiosInstance
        .post("/update-invoice", InvoiceParams)
        .then(() => {
          navigate("/invoice");
        })
        .catch((error) => {
          setError(error.response?.data?.message || "An error occurred.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axiosInstance
        .post("/create-invoice", InvoiceParams)
        .then(() => {
          navigate("/invoice");
        })
        .catch((error) => {
          setError(error.response?.data?.message || "An error occurred.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4">
        <label className="block font-semibold">Select Client:</label>
        <select
          className="w-full p-2 border rounded"
          disabled={userId}
          value={selectedClient}
          onChange={(e) => {
            setSelectedClient(e.target.value);
          }}
        >
          <option value="">Select Client</option>
          {clients.map((client, index) => (
            <option key={index} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4">Date: {currentDate}</p>
      {selectedClient && (
        <div>
          <div className="flex justify-between">
            <p className="mb-4">
              Mobile No:{" "}
              {clients.find((client) => client.id == selectedClient)?.mobile}
            </p>
            <p className="mb-4">
              Email:{" "}
              {clients.find((client) => client.id == selectedClient)?.email}
            </p>
          </div>
          <p className="mb-4">
            Address:{" "}
            {clients.find((client) => client.id == selectedClient)?.address}
          </p>
        </div>
      )}
      {!userId && (
        <button
          className="bg-blue-500 text-white p-2 rounded mb-4"
          onClick={addProduct}
        >
          Add Product
        </button>
      )}
      {invoiceProducts.map((product, index) => (
        <div key={index} className="border p-2 mb-2 rounded">
          <select
            disabled={userId}
            value={product.id}
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => handleProductChange(index, e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.product_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            disabled={userId}
            className="w-full p-2 border rounded mb-2"
            value={product.qty}
            onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
          />
          <input
            type="number"
            disabled={role == "Staff"}
            className="w-full p-2 border rounded mb-2"
            value={product.price}
            onChange={(e) =>
              handlePriceChange(index, parseFloat(e.target.value))
            }
          />
          <div className="flex justify-between">
            <p className="font-semibold">
              Total: ${(product.qty * product.price).toFixed(2)}
            </p>

            {pageType === "create" && (
              <button
                onClick={() => deleteProduct(index)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      ))}
      <h2 className="text-xl font-bold mt-4">Total Amount: ${totalAmount}</h2>
      {(pageType === "create" || pageType === "edit") && (
        <div className="flex justify-between gap-2">
          {!userId && (
            <button
              disabled={loading}
              onClick={() => handleSubmit(false)}
              className="bg-blue-500 text-white p-2 rounded w-full mt-4"
            >
              Send For Approval
            </button>
          )}
          <button
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="bg-green-500 text-white p-2 rounded w-full mt-4"
          >
            Create Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
