'use client'

import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";
import { FaUsers, FaBoxOpen, FaMoneyBillWave, FaStar, FaCartPlus } from "react-icons/fa";
import { translations } from "@/constants";
import { useLanguage } from "@/context/LanguageProvider";


const Sales = () => {
  const { language } = useLanguage();

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
        <h1 className="text-3xl font-bold text-blue-600 mb-6">{translations[language].salesOverview}</h1>

        {/* Statistics Section */}
        {stats && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Customers */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaUsers className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500">{translations[language].totalCustomers}</p>
              <h2 className="text-2xl font-bold">{stats.numberOfCustomers}</h2>
            </div>
          </div>

          {/* Products Sold */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaBoxOpen className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500">{translations[language].totalProductsSold}</p>
              <h2 className="text-2xl font-bold">{stats.numberOfProductsSold}</h2>
            </div>
          </div>

          {/* Revenue Generated */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaMoneyBillWave className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500">{translations[language].revenueGenerated}</p>
              <h2 className="text-2xl font-bold">Rs. {stats.revenueGenerated.toLocaleString()}</h2>
            </div>
          </div>

          {/* Most Sold Product */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaCartPlus className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500">{translations[language].mostSoldProduct}</p>
              <h2 className="text-2xl font-bold">{stats.mostSoldProduct}</h2>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaStar className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500">{translations[language].totalReviews}</p>
              <h2 className="text-2xl font-bold">{stats.totalReviews}</h2>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <FaStar className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500">{translations[language].averageRating}</p>
              <h2 className="text-2xl font-bold">{stats.averageRating} / 5</h2>
            </div>
          </div>
        </div>)}

        {/* Products Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{translations[language].products}</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 text-left">{translations[language].product}</th>
                  <th className="p-3 text-left">{translations[language].price}</th>
                  <th className="p-3 text-left">{translations[language].totalSales}</th>
                  <th className="p-3 text-left">{translations[language].totalReviews}</th>
                  <th className="p-3 text-left">{translations[language].rating}</th>
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
