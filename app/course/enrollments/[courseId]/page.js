import React from "react";

const Enrollments = () => {
  const courseDetails = {
    course_name: "Full-Stack Development",
    start_date: "2024-11-15",
    end_date: "2025-02-15",
  };

  const enrolledUsers = [
    {
      id: 1,
      profile_pic: "https://via.placeholder.com/50",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Main Street, City, Country",
      fee_paid: "Rs. 10,000",
      enrollment_date: "2024-12-01",
    },
    {
      id: 2,
      profile_pic: "https://via.placeholder.com/50",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      address: "456 Elm Street, City, Country",
      fee_paid: "Rs. 12,000",
      enrollment_date: "2024-12-05",
    },
    {
      id: 3,
      profile_pic: "https://via.placeholder.com/50",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "555-123-4567",
      address: "789 Oak Avenue, City, Country",
      fee_paid: "Rs. 8,500",
      enrollment_date: "2024-12-10",
    },
  ];

  return (
    <div className="m-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          {courseDetails.course_name}
        </h1>
        <p className="text-gray-600">
          Start Date: {courseDetails.start_date} | End Date:{" "}
          {courseDetails.end_date}
        </p>
      </div>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Enrolled Members</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Fee Paid</th>
              <th className="p-3 text-left">Enrollment Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="p-3">
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.address}</td>
                <td className="p-3 text-blue-500 font-semibold">{user.fee_paid}</td>
                <td className="p-3">{user.enrollment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enrollments;