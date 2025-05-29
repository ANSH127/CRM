import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CampaignHistoryPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchCampaignHistory = async () => {
    try {
      setLoading(true);
      if (!localStorage.getItem("user")) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/campaign/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
      });

      if (response.status === 200) {
        setCampaigns(response.data);
      } else {
        console.error("Failed to fetch campaign history:", response.statusText);
        alert("Failed to fetch campaign history. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching campaign history:", error);
      alert("Failed to fetch campaign history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCampaignHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          Campaign History
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {campaign.name}
                  </h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {campaign.description
                    ? campaign.description.slice(0, 100)
                    : ""}
                  {campaign.description && campaign.description.length > 100
                    ? "..."
                    : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Matched: {campaign.matchedCustomersCount}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    Status: {campaign.status || "Created"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-gray-500">No campaigns found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
