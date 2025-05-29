import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "../components/DataTable";

const columns = [
  { field: "createdAt", headerName: "Created At", width: 180 },
  { field: "_id", headerName: "ID", width: 90 },
  { field: "customerName", headerName: "Name", width: 150 },
  { field: "customerEmail", headerName: "Email", width: 200 },
  {field: "status",headerName: "Status",width: 130},
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch campaign details using the id
  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/campaign/campaign-records/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error("Failed to fetch campaign details:", response.statusText);
        alert("Failed to fetch campaign details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      alert("Failed to fetch campaign details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  return (
    <div className="min-h-screen  py-8 px-2">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700 drop-shadow">
        Campaign Details
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

        <div className="bg-white rounded-2xl  p-6 lg:col-span-9">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
            Records
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          ) : (
            <DataTable
              rows={data.records || []}
              columns={columns}
              enableDelete={false}
            />
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-3 flex flex-col gap-3">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Campaign Info</h2>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Campaign ID:</span>
            <span className="ml-2 text-gray-600 break-all">{id}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="ml-2 text-gray-800">{data.campaign?.name}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Created At:</span>
            <span className="ml-2 text-gray-600">
              {data.campaign?.createdAt
                ? new Date(data.campaign.createdAt).toLocaleString()
                : ""}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Matched Customers:</span>
            <span className="ml-2 text-green-700 font-semibold">
              {data.records?.length || 0}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Message:</span>
            <span className="ml-2 text-gray-600">{data.campaign?.message}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Rules:</span>
            <pre className="bg-gray-100 rounded p-2 mt-1 text-xs text-gray-700 overflow-x-auto">
              {data.campaign?.rules
                ? JSON.stringify(data.campaign.rules, null, 2)
                : ""}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}