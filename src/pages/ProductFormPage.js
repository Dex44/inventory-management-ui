import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { AiOutlineClose } from "react-icons/ai";
import axiosInstance from "../utils/axiosInstance";

const ProductFormPage = () => {
  const { id: productId } = useParams();
  const [productname, setProductname] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      setLoading(true);
      axiosInstance
        .get(`/get-product/${productId}`)
        .then((response) => {
          const product = response.data.data;
          setProductname(product.product_name);
          setPrice(product.price);
          setQuantity(product.quantity);
          setDescription(product.description || "");
        })
        .catch(() => {
          setError("Failed to fetch product details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const validFiles = acceptedFiles[0].size <= 2 * 1024 * 1024;
      if (!validFiles) {
        setError("Each image must be 2MB or smaller.");
        return;
      }

      setImage(acceptedFiles[0]);
    },
    [image]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("product_name", productname);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("description", description);
      formData.append("image", image)

      if (productId) {
        formData.delete("image");
        formData.append("product_id", productId);
        formData.append("action", "null");
        await axiosInstance.post("/update-product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // await axiosInstance.post("/update-product", {
        //   product_id: +productId,
        //   product_name: productname,
        //   price: +price,
        //   quantity: +quantity,
        //   description,
        // });
      } else {
        await axiosInstance.post("/create-product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/products");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">
        {productId ? "Edit Product" : "Create New Product"}
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={productname}
            onChange={(e) => setProductname(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
          ></textarea>
        </div>
        {!productId && (
          <div>
            <label className="block text-sm font-medium">
              Upload Images (Max 2MB)
            </label>
            {image ? (
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="upload"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <AiOutlineClose size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="border-2 border-dashed p-4 text-center cursor-pointer rounded-lg"
              >
                <input {...getInputProps()} />
                <p>Drag & drop image here, or click to select file</p>
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {productId ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductFormPage;
