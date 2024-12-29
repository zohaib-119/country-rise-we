'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { FaProductHunt, FaUserGraduate, FaUsers, FaMoneyBill, FaChartLine, FaWarehouse } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,  // Import PointElement for line chart
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import LoadingComponent from '@/components/LoadingComponent';
import { translations } from '@/constants';
import { useLanguage } from '@/context/LanguageProvider';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const {language} = useLanguage();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user-dashboard');
      const data = await response.json();
      setUserData(data.user_dashboard);
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <LoadingComponent/>;
  }

  // Data for product sales chart
  const productSalesData = {
    labels: userData.products.map((product) => product.name),
    datasets: [
      {
        label: 'Sales',
        data: userData.products.map((product) => product.sales),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Stock',
        data: userData.products.map((product) => product.stock),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Data for course enrollments chart (using Line chart)
  const courseEnrollmentsData = {
    labels: userData.courses.map((course) => course.title),
    datasets: [
      {
        label: 'Enrollments',
        data: userData.courses.map((course) => course.enrollments),
        borderColor: 'rgba(75, 192, 192, 1)', 
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        fill: true, 
        tension: 0.4, 
      },
    ],
  };

  return (
    <div className="flex bg-white text-gray-800">
      <Sidebar />
      <div className="w-5/6 h-screen overflow-auto p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">{`${translations[language].welcome} ${userData.name}`}</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center justify-between p-4 rounded shadow">
            <FaProductHunt className="text-blue-500 text-3xl" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">{userData.totalProducts}</h3>
              <p className="text-sm text-blue-500">{translations[language].totalProducts}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded shadow">
            <FaUsers className="text-blue-500 text-3xl" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">{userData.totalCustomers}</h3>
              <p className="text-sm text-blue-500">{translations[language].totalCustomers}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded shadow">
            <FaUserGraduate className="text-blue-500 text-3xl" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">{userData.enrollments}</h3>
              <p className="text-sm text-blue-500">{translations[language].totalEnrollments}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded shadow">
            <FaMoneyBill className="text-blue-500 text-3xl" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">Rs. {userData.totalRevenue}</h3>
              <p className="text-sm text-blue-500">{translations[language].totalRevenue}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded shadow">
            <FaChartLine className="text-blue-500 text-3xl" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">{userData.totalSales}</h3>
              <p className="text-sm text-blue-500">{translations[language].totalSales}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded shadow">
            <FaWarehouse className="text-blue-500 text-3xl" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">{userData.totalStock}</h3>
              <p className="text-sm text-blue-500">{translations[language].totalStock}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Sales Chart */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold text-blue-600 mb-4">{translations[language].productSalesVsStock}</h2>
            <div className="h-64">
              <Bar data={productSalesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Course Enrollments Chart (Line Chart) */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold text-blue-600 mb-4">{translations[language].courseEnrollments}</h2>
            <div className="h-64">
              <Line data={courseEnrollmentsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
