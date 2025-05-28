import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  let metrics = [
    {
      label: "Total Customers",
      value: 1284,
      color: "bg-blue-100",
      text: "text-blue-700",
    },
    {
      label: "Total Campaigns",
      value: 14,
      color: "bg-green-100",
      text: "text-green-700",
    },
    {
      label: "Last Campaign Delivery Rate",
      value: "91.2%",
      color: "bg-yellow-100",
      text: "text-yellow-700",
    },
    {
      label: "Audience Matched in Last Campaign",
      value: "300 users",
      color: "bg-purple-100",
      text: "text-purple-700",
    },
  ];
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center mt-10">
        <img
          src="/images/campaign.jpg"
          alt="Campaign"
          className="w-auto h-72 object-cover"
        />
      </div>
      <div className="text-center mt-4">
        <h1 className="text-4xl font-bold">
          👋 Welcome back, {JSON.parse(localStorage.getItem("user"))?.name}!
        </h1>
        <p className="mt-3 text-lg">
          Here’s what’s happening in your CRM today.
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition">
            ➕ Create New Campaign
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition cursor-pointer"
          onClick={
            () => navigate("/view-data")
          }>
          
            📥 Upload Customers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-10 max-w-4xl mx-auto">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`rounded-xl shadow ${metric.color} p-6 flex flex-col items-center`}
            >
              <div className={`text-3xl font-bold mb-2 ${metric.text}`}>
                {metric.value}
              </div>
              <div className="text-gray-600 font-medium text-center">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
