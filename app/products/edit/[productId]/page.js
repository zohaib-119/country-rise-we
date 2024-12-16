"use client";

import React, { useEffect, useState } from "react";
import CustomInput from "@/components/CustomInput";
import { useRouter, useParams } from "next/navigation";
import LoadingComponent from "@/components/LoadingComponent";

const EditProduct = () => {
  const router = useRouter();
  const { productId } = useParams(); // Extract productId from the dynamic route

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial product fetch

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch the product by productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const {product} = await response.json();
        console.log(product);
        setForm({
          title: product.title,
          description: product.description,
          price: product.price,
          categoryId: product.category,
          stockQuantity: product.stock_quantity,
          images: product.images || [],
        });
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching product:", error);
        router.replace('/products')
      }
    };

    fetchProduct();
  }, [productId]);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setForm({ ...form, title: value });
    }
  };

  const handleDescriptionChange = (e) => {
    setForm({ ...form, description: e.target.value });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^(?!0$)\d+(\.\d+)?$/.test(value)) {
      setForm({ ...form, price: value });
    } else if (value === "") {
      setForm({ ...form, price: "" });
    }
  };

  const handleCategoryChange = (e) => {
    setForm({ ...form, categoryId: e.target.value });
  };

  const handleStockQuantityChange = (e) => {
    const value = e.target.value;
    if (/^(?!0$)\d+$/.test(value)) {
      setForm({ ...form, stockQuantity: value });
    } else if (value === "") {
      setForm({ ...form, stockQuantity: "" });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...form.images, ...files];

    if (updatedFiles.length > 4) {
      alert("Only add up to 4 images.");
      updatedFiles.splice(4);
    }

    e.target.value = "";

    setForm({ ...form, images: updatedFiles });
  };

  const handleRemoveFile = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare image upload if new files are added
      const formData = new FormData();
      form.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("files", file);
        }
      });

      let uploadedImageUrls = form.images.filter((img) => !(img instanceof File)); // Retain existing URLs

      if (formData.has("files")) {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to upload images");
        }

        const { result } = await res.json();
        uploadedImageUrls = [...uploadedImageUrls, ...result];
      }

      // Update product
      const productRes = await fetch(`/api/product/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.title,
          description: form.description,
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stockQuantity, 10),
          category_id: form.categoryId,
          images: uploadedImageUrls, // Use uploaded URLs
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!productRes.ok) {
        throw new Error("Failed to update product");
      }

      const { message } = await productRes.json();
      console.log(message);

      router.push("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Edit Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label="Product Name"
            placeholder="Enter the product name"
            value={form.title}
            handleChange={handleTitleChange}
            className="w-full"
          />

          <CustomInput
            label="Description"
            placeholder="Enter the product description"
            value={form.description}
            handleChange={handleDescriptionChange}
            className="w-full"
          />

          <CustomInput
            label="Price"
            placeholder="Enter the product price"
            value={form.price}
            handleChange={handlePriceChange}
            className="w-full"
          />

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-lg font-semibold mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={form.categoryId}
              onChange={handleCategoryChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <CustomInput
            label="Stock Quantity"
            placeholder="Enter the stock quantity"
            value={form.stockQuantity}
            handleChange={handleStockQuantityChange}
            className="w-full"
          />

          <div className="space-y-2">
            <label
              htmlFor="images"
              className="block text-lg font-semibold mb-2"
            >
              Upload Images (1 to 4)
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {form.images && form.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {form.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border border-gray-300 rounded-md overflow-hidden"
                  >
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image.url
                      }
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 right-0 text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
