import React from "react";
import { FaUsers, FaBoxOpen, FaMoneyBillWave, FaStar, FaCartPlus } from "react-icons/fa";

const mockData = {
  numberOfCustomers: 1200,
  numberOfProductsSold: 4500,
  mostSoldProduct: "Elegant Wooden Chair",
  revenueGenerated: 1250000, // in PKR
  totalReviews: 850,
  averageRating: 4.3,
};

const products = [
  {
    id: 1,
    name: "Elegant Wooden Chair",
    image: "https://via.placeholder.com/150", // Replace with real image URLs
    totalSales: 120,
    totalReviews: 45,
    avgRating: 4.5,
    price: 3500, // in PKR
  },
  {
    id: 2,
    name: "Modern Office Desk",
    image: "https://via.placeholder.com/150",
    totalSales: 95,
    totalReviews: 30,
    avgRating: 4.2,
    price: 12500,
  },
  {
    id: 3,
    name: "Classic Table Lamp",
    image: "https://via.placeholder.com/150",
    totalSales: 200,
    totalReviews: 70,
    avgRating: 4.8,
    price: 1500,
  },
];

const Sales = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Sales Overview</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaUsers className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500">Total Customers</p>
            <h2 className="text-2xl font-bold">{mockData.numberOfCustomers}</h2>
          </div>
        </div>

        {/* Products Sold */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaBoxOpen className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500">Products Sold</p>
            <h2 className="text-2xl font-bold">{mockData.numberOfProductsSold}</h2>
          </div>
        </div>

        {/* Revenue Generated */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaMoneyBillWave className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500">Revenue Generated</p>
            <h2 className="text-2xl font-bold">Rs. {mockData.revenueGenerated.toLocaleString()}</h2>
          </div>
        </div>

        {/* Most Sold Product */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaCartPlus className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500">Most Sold Product</p>
            <h2 className="text-2xl font-bold">{mockData.mostSoldProduct}</h2>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaStar className="text-orange-500 text-3xl" />
          <div>
            <p className="text-gray-500">Total Reviews</p>
            <h2 className="text-2xl font-bold">{mockData.totalReviews}</h2>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaStar className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500">Average Rating</p>
            <h2 className="text-2xl font-bold">{mockData.averageRating.toFixed(1)} / 5</h2>
          </div>
        </div>
      </div>

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
  );
};

export default Sales;
