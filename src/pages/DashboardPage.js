// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import 'swiper/css/pagination';
import { FaEdit, FaTrash, FaPlus, FaRupeeSign } from "react-icons/fa";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteproductId, setDeleteProductId] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  // Fetch products from API
  const getProducts = () => {
    axiosInstance
      .get("/list-products/1/10")
      .then((response) => {
        const data = response.data.data?.products.map((value) => {
          return {
            id: value?.dataValues?.product_id || "",
            name: value?.dataValues?.product_name || "",
            created_at: value?.dataValues?.created_at || "",
            price: value?.dataValues?.price || "",
            description: value?.dataValues?.description || "",
            quantity: value?.dataValues?.quantity || "",
            images: value?.images.map((img) => {
              return {
                id: img?.id,
                image_url: img?.image_url,
              };
            }),
          };
        });
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
    getProducts();
  }, []);

  // Handle delete product
  const handleDelete = async () => {
    try {
      await axiosInstance.post("/delete-product", {
        product_id: deleteproductId,
      });
      setShowDeletePrompt(false);
      getProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex justify-between mt-2">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <Link
              to="/products/create"
              className="bg-blue-600 text-white p-2 rounded mb-4 inline-block items-center flex gap-1"
            >
              <FaPlus /> Add Product
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-md bg-white"
              >
                <Swiper
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: true,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  modules={[Autoplay, Pagination]}
                  className="w-full h-56"
                >
                  {product.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="p-2">
                  <div className="flex justify-between mt-2">
                    <h2 className="text-md">{product.name}</h2>
                    {/* <p className="text-sm text-gray-600">Color: {product.color}</p> */}
                    <p className="text-sm font-semibold flex items-center">
                      <FaRupeeSign /> {product.price}
                    </p>
                  </div>
                  <p className="text-xs">Quantity: {product.quantity}</p>
                  <div className="flex justify-between mt-2">
                    <Link
                      to={`/products/edit/${product.id}`}
                      className="text-blue-600 flex items-center"
                    >
                      {/* <button className="text-blue-600 flex items-center"> */}
                      <FaEdit className="mr-1" /> Edit
                      {/* </button> */}
                    </Link>
                    <button
                      className="text-red-600 flex items-center"
                      onClick={() => {
                        setDeleteProductId(product.id);
                        setShowDeletePrompt(true);
                      }}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        // <div className="overflow-x-auto mt-4">
        //   <table className="min-w-full bg-white border border-gray-300">
        //     <thead>
        //       <tr className="bg-gray-100 border-b">
        //         <th className="px-4 py-2 text-left">ID</th>
        //         <th className="px-4 py-2 text-left">Product Name</th>
        //         <th className="px-4 py-2 text-left">Price</th>
        //         <th className="px-4 py-2 text-left">Quantity</th>
        //         <th className="px-4 py-2 text-left">Actions</th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {products.length > 0 && products.map((product) => (
        //         <tr key={product.id} className="border-b">
        //           <td className="px-4 py-2">{product.product_id}</td>
        //           <td className="px-4 py-2">{product.product_name}</td>
        //           <td className="px-4 py-2">{product.price}</td>
        //           <td className="px-4 py-2">{product.quantity}</td>
        //           <td className="px-4 py-2">
        //             <Link
        //               to={`/products/edit/${product.product_id}`}
        //               className="text-blue-600"
        //             >
        //               Edit
        //             </Link>
        //             <button
        //               onClick={() => {
        //                 setDeleteProductId(product.product_id);
        //                 setShowDeletePrompt(true);
        //               }}
        //               className="text-red-600 ml-4"
        //             >
        //               Delete
        //             </button>
        //           </td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </table>
        // </div>
      )}

      {showDeletePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete this product?
            </h2>
            <p className="mb-4">
              Product Name:{" "}
              {
                products.find((product) => product.id === deleteproductId)
                  ?.product_name
              }
            </p>
            <p className="mb-4">
              Quantity:{" "}
              {
                products.find((product) => product.id === deleteproductId)
                  ?.quantity
              }
            </p>
            <p className="mb-4">
              Price:{" "}
              {
                products.find((product) => product.id === deleteproductId)
                  ?.price
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

export default DashboardPage;
