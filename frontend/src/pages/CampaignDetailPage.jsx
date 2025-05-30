import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "../components/DataTable";
import { toast } from "react-toastify";
import Chip from "@mui/material/Chip";
import { initializeChat, fetchModelResponse } from "../config/AI";

const columns = [
  { field: "createdAt", headerName: "Created At", width: 180 },
  { field: "_id", headerName: "ID", width: 90 },
  { field: "customerName", headerName: "Name", width: 150 },
  { field: "customerEmail", headerName: "Email", width: 200 },
  { field: "status", headerName: "Status", width: 130 },
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(false);
  const [aimsg, setAIMsg] = React.useState("");

  // Fetch campaign details using the id
  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/campaign/campaign-records/${id}`,
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
        const sent = response.data.records.filter(
          (record) => record.status === "sent"
        ).length;
        const failed = response.data.records.filter(
          (record) => record.status === "failed"
        ).length;

        initializeChat([
          {
            role: "user",
            message: `You are a campaign analyst assistant. Given the campaign delivery metrics and segment rules, generate a concise, human-readable summary (1–2 sentences) for a marketing dashboard.

            Use a friendly, professional tone. Highlight total audience, delivery rate, and any performance insights.

            Data:
            - Total audience: ${response?.data?.records?.length}
            - Messages sent: ${sent}
            - Messages failed: ${failed}
            - Campaign message sent to audience: ${
              response?.data?.campaign?.message || "N/A"
            }
            - Segment rule: ${JSON.stringify(
              response?.data?.campaign?.rules || {}
            )}
            `,
          },
        ]);

        setData(response.data);
      } else {
        console.error("Failed to fetch campaign details:", response.statusText);
        toast.error("Failed to fetch campaign details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please log in again.");
      } else {
        toast.error(
          "Error fetching campaign details. Please check your connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const generateAIMsg = async () => {
    try {
      setLoading2(true);
      const response = await fetchModelResponse(
        "Generate a concise summary of the campaign performance based on the provided data."
      );
      if (response) {
        setAIMsg(response);
      } else {
        setAIMsg("Failed to generate AI summary. Please try again.");
      }
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAIMsg("Error generating AI summary. Please try again.");
    }finally {
      setLoading2(false);
    }
  };

  React.useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  return (
    <div className="min-h-screen  py-8 px-2">
      <h3 className="text-3xl font-bold text-center mb-8 text-black drop-shadow">
        Campaign Details
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl  p-6 lg:col-span-9">
          <h2 className="text-2xl font-bold mb-4 text-black flex items-center gap-2">
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
          <h2 className="text-xl font-bold mb-4 text-black">Campaign Info</h2>
          <div>
            <Chip
              label={loading2 ? "Generating AI Summary..." : "Generate AI Summary"}
              onClick={generateAIMsg}
              className="cursor-pointer "
              color="primary"
              variant="outlined"
            />

            <p className="text-gray-600 mt-2 bg-gray-100 p-2 rounded">
              {aimsg || "Click the button to generate AI summary."}
            </p>
          </div>

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
            <span className="font-semibold text-gray-700">Audience Size:</span>
            <span className="ml-2 text-green-700 font-semibold">
              {data.records?.length || 0}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Message:</span>
            <span className="ml-2 text-gray-600">
            {data.campaign?.message.slice(0, 300)+ "..."|| "N/A"}
            </span>
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
