// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaEdit, FaTrash, FaPlus, FaRupeeSign } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import SearchBar from "../../components/SearchBar";
import DashboardCards from "./DashboardCards";
import DashboardChart from "./DashboardChart";
import FormatDate from "../../utils/formatDate";

const DashboardPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteproductId, setDeleteProductId] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [role, setRole] = useState(null);

  // // Fetch products from API
  // const getProducts = (search) => {
  //   const params = {
  //     product_name: search,
  //     page: 1,
  //     limit: 100,
  //   };
  //   if (search) {
  //     params.product_name = search;
  //   } else {
  //     delete params.product_name;
  //   }

  //   axiosInstance
  //     .post("/list-products", params)
  //     .then((response) => {
  //       const data = response.data.data?.products.map((value) => {
  //         return {
  //           id: value?.product_id || "",
  //           name: value?.product_name || "",
  //           created_at: value?.created_at || "",
  //           price: value?.price || "",
  //           description: value?.description || "",
  //           quantity: value?.quantity || "",
  //           image: value?.image,
  //         };
  //       });
  //       setProducts(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching products:", error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const getInvoices = () => {
    axiosInstance
      .post("/list-invoice", {
        // client_id: 1,
        page: 1,
        limit: 5,
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
    // getProducts();
    getInvoices();
  }, []);

  // Handle delete product
  // const handleDelete = async () => {
  //   try {
  //     await axiosInstance.post("/delete-product", {
  //       product_id: deleteproductId,
  //     });
  //     setShowDeletePrompt(false);
  //     getProducts();
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // };
  // const handleSearch = (searchTerm) => {
  //   getProducts(searchTerm);
  // };
  return (
    <div>
      <DashboardCards />
      <DashboardChart />

      <div className="w-full md:w-3/4 lg:w-1/2 mx-auto bg-white p-4 rounded-lg mt-4">
        {/* Dropdown for selecting months */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-700">Latest Invoices</h2>
          <Link
            to="/invoice"
            className="bg-blue-600 px-2 py-1 text-sm rounded text-white items-center flex gap-1"
          >
            View All <IoIosArrowDown />
          </Link>
        </div>
        {loading ? (
          <p>Loading invoices...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {invoices.length > 0 &&
              invoices.map((invoice) => (
                <div
                  key={invoice?.id}
                  className="bg-white p-4 rounded-lg shadow-md border"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {invoice?.client.name}
                      </h2>
                      <p className="text-gray-500">
                        Amount: ₹{invoice?.amount}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-2 py-1 text-sm rounded text-white ${
                          invoice?.approver ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      >
                        {invoice?.approver ? "Approved" : "Pending"}
                      </span>
                      {(!invoice?.approver && role != "Staff" ) ? (
                        <Link
                          to={`/invoice/edit/${invoice?.id}`}
                          className={`px-2 py-1 text-sm rounded text-white bg-indigo-500 flex items-center justify-between`}
                        >
                          Edit <MdOutlineEdit />
                        </Link>
                      ) : <Link
                      to={`/invoice/view/${invoice?.id}`}
                      className={`px-2 py-1 text-sm rounded text-white bg-indigo-500 flex items-center justify-between`}
                    >
                      View
                    </Link>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Date: {FormatDate(invoice?.updated_at)}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
