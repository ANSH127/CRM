import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

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

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/campaign/`, {
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
        toast.error("Failed to fetch campaign history. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching campaign history:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Error fetching campaign history. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCampaignHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-900 drop-shadow-lg tracking-tight">
          Campaign History
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
            <span className="ml-4 text-xl text-gray-500 font-medium">Loading...</span>
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all flex flex-col border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-black truncate">
                    {campaign.name}
                  </h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium shadow">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-base mb-3 line-clamp-3">
                  {campaign.description
                    ? campaign.description.slice(0, 120)
                    : ""}
                  {campaign.description && campaign.description.length > 120
                    ? "..."
                    : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-auto mb-4">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
                    Audience: {campaign.matchedCustomersCount}
                  </span>
                  <span className="inline-block bg-red-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow">
                    Tag: {campaign.tag || "Created"}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/campaign-detail/${campaign._id}`)}
                  className="w-full mt-auto bg-gradient-to-r bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-md"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-60">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl text-gray-500 font-medium">No campaigns found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
