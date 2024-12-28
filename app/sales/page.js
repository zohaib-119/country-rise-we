'use client'

import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";
import { FaUsers, FaBoxOpen, FaMoneyBillWave, FaStar, FaCartPlus } from "react-icons/fa";

const mockData = {
  numberOfCustomers: 1200,
  numberOfProductsSold: 4500,
  mostSoldProduct: "Elegant Wooden Chair",
  revenueGenerated: 1250000,
  totalReviews: 850,
  averageRating: 4.3,
};

const Sales = () => {

  const [products, setProducts] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/get-stats`);

        // Check if the response is okay
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Failed to fetch products");
        }

        // Parse the response JSON
        const { products } = await response.json();

        // Update state with the fetched products
        setProducts(products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(()=>{
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/sale-overview`);

        // Check if the response is okay
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Failed to fetch products");
        }

        // Parse the response JSON
        const { stats } = await response.json();

        // Update state with the fetched products
        setStats(stats);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!products || !stats) 
    return <LoadingComponent/>

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-5/6 h-screen overflow-auto bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Sales Overview</h1>

        {/* Statistics Section */}
        {stats && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Customers */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaUsers className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500">Total Customers</p>
              <h2 className="text-2xl font-bold">{stats.numberOfCustomers}</h2>
            </div>
          </div>

          {/* Products Sold */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaBoxOpen className="text-green-500 text-3xl" />
            <div>
              <p className="text-gray-500">Products Sold</p>
              <h2 className="text-2xl font-bold">{stats.numberOfProductsSold}</h2>
            </div>
          </div>

          {/* Revenue Generated */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaMoneyBillWave className="text-yellow-500 text-3xl" />
            <div>
              <p className="text-gray-500">Revenue Generated</p>
              <h2 className="text-2xl font-bold">Rs. {stats.revenueGenerated.toLocaleString()}</h2>
            </div>
          </div>

          {/* Most Sold Product */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaCartPlus className="text-purple-500 text-3xl" />
            <div>
              <p className="text-gray-500">Most Sold Product</p>
              <h2 className="text-2xl font-bold">{stats.mostSoldProduct}</h2>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaStar className="text-orange-500 text-3xl" />
            <div>
              <p className="text-gray-500">Total Reviews</p>
              <h2 className="text-2xl font-bold">{stats.totalReviews}</h2>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaStar className="text-yellow-500 text-3xl" />
            <div>
              <p className="text-gray-500">Average Rating</p>
              <h2 className="text-2xl font-bold">{stats.averageRating} / 5</h2>
            </div>
          </div>
        </div>)}

        {/* Products Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Products</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Total Sales</th>
                  <th className="p-3 text-left">Total Reviews</th>
                  <th className="p-3 text-left">Rating</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-100">
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span>{product.name}</span>
                    </td>
                    <td className="p-3 text-blue-500 font-semibold">
                      Rs. {product.price.toLocaleString()}
                    </td>
                    <td className="p-3">{product.totalSales}</td>
                    <td className="p-3">{product.totalReviews}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 font-semibold">
                          {"★".repeat(Math.floor(product.avgRating))}
                          {"☆".repeat(5 - Math.floor(product.avgRating))}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
