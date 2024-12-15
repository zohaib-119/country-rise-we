"use client";

import React, { useEffect, useState } from 'react';
import CustomInput from '@/components/CustomInput';
import { useSession } from 'next-auth/react';

const CreateProduct = () => {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    images: [],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      // Update only if the title is alphanumeric
      setForm({ ...form, title: value });
    }
  };

  const handleDescriptionChange = (e) => {
    // No validation required for description
    setForm({ ...form, description: e.target.value });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^(?!0$)\d+(\.\d+)?$/.test(value)) {
      // Update if numeric and does not start with a single zero
      setForm({ ...form, price: value });
    } else if (value === "") {
      // Allow empty input for clearing the field
      setForm({ ...form, price: "" });
    }
  };

  const handleCategoryChange = (e) => {
    // Update categoryId directly
    setForm({ ...form, categoryId: e.target.value });
  };

  const handleStockQuantityChange = (e) => {
    const value = e.target.value;
    if (/^(?!0$)\d+$/.test(value)) {
      // Update if numeric and does not start with a single zero
      setForm({ ...form, stockQuantity: value });
    } else if (value === "") {
      // Allow empty input for clearing the field
      setForm({ ...form, stockQuantity: "" });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    // Combine existing files with new ones
    const updatedFiles = [...form.images, ...files];
  
    // Limit to 4 files if necessary
    if (updatedFiles.length > 4) {
      alert('Only add upto 4 images.')
      // Trim to max 4 files
      updatedFiles.splice(4);
    }
    
    e.target.value = '';
    
  
    setForm({ ...form, images: updatedFiles });
  };
  

  const handleRemoveFile = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updatedImages });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    form.images.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload images');
      }

      const { result } = await res.json();
      console.log('Uploaded URLs:', result);

      // Fetch the session to include in the request headers
      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) {
          throw new Error('Failed to fetch session');
      }

      const sessionData = await sessionRes.json();
      const token = sessionData.token;

      // Now, make another API call to create the product
      const productRes = await fetch('/api/product/create', {
        method: 'POST',
        body: JSON.stringify({
          name: form.title,
          description: form.description,
          price: form.price,
          stock_quantity: form.stockQuantity,
          category_id: form.categoryId,
          user_id: session?.user.id,
          images: result, // Attach uploaded image URLs
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!productRes.ok) {
        throw new Error('Failed to create product');
      }

      const { message, product_id } = await productRes.json();
      console.log(message, product_id);

      // Clear the form on successful submission
      setForm({
        title: '',
        description: '',
        price: '',
        categoryId: '',
        stockQuantity: '',
        images: [],
      });

      // Redirect or give feedback to user here
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Create Product</h2>
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
            <label htmlFor="category" className="block text-lg font-semibold mb-2">Category</label>
            <select
              id="category"
              value={form.categoryId}
              onChange={handleCategoryChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select a category</option>
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
            <label htmlFor="images" className="block text-lg font-semibold mb-2">Upload Images (1 to 4)</label>
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
                  <div key={index} className="relative w-20 h-20 border border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
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
              onClick={() => (window.location.href = '/products')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
