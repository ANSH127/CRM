import React from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import Chip from "@mui/material/Chip";
import axios from "axios";
import {useNavigate} from "react-router-dom";
  import { toast } from 'react-toastify';


const fields = [
  { name: "total_spent", label: "Total Spent" },
  { name: "visits", label: "Visits" },
  { name: "last_order_date", label: "Last Order Date" },
];

export default function CreateCampaignPage() {
  const [query, setQuery] = React.useState({
    combinator: "or",
    rules: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [matchcount, setMatchCount] = React.useState(0);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();

  const fetchAudienceCount = async () => {
    const queryData = formatQuery(query, "mongodb_query");
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/campaign/matched-customers-count",
        { rules: queryData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch audience count");
      }
      setMatchCount(response.data.count);
    } catch (error) {
      console.error("Error fetching audience count:", error);
      toast.error("Failed to fetch audience count. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myquery = formatQuery(query, "mongodb_query");
    console.log(name, description, myquery, message);
    if (!name || !description || !myquery || !message) {
      toast.warning("Please fill all fields before submitting.");
      return;
    }
    try {
      setLoading2(true);
      const response = await axios.post(
        "http://localhost:3000/api/campaign/create",
        {
          name,
          description,
          rules: myquery,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Campaign created successfully!");
        navigate("/campaign-history");
        
      } else {
        throw new Error("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid input, please check your details");
      } else {
        toast.error("Campaign creation failed, please try again later");
      }
    }
    finally {
      setLoading2(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center mt-10">
      <div className="flex flex-col md:flex-row bg-white  rounded-lg overflow-hidden w-full lg:w-[90%]">
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src="/images/create-campaign.jpg"
            alt="Campaign"
            className="object-cover w-full h-[80%] max-h-[500px]"
          />
        </div>
        <div className="md:w-1/2 w-full p-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            Create a New Campaign
          </h1>
          <p className="text-center mb-6 text-lg">
            Fill out the form below to create a new campaign.
          </p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="Enter campaign name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter campaign description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Query Builder
            </label>
            <QueryBuilder
              fields={fields}
              query={query}
              onQueryChange={setQuery}
            />
            <div className="mt-4 flex items-center">
              <Chip
                label="Fetch Audience Count"
                color="primary"
                className="cursor-pointer"
                onClick={fetchAudienceCount}
              />
              <span className="ml-2 text-gray-600">
                {query.rules.length > 0
                  ? `Matched Audience: ${loading ? "Loading..." : matchcount}`
                  : "No rules defined yet"}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Campaign Message
            </label>
            <textarea
              placeholder="Enter campaign message"
              className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              style={{ minHeight: "120px" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleSubmit}
            disabled={loading2}
          >
            {loading2 ? "Creating Campaign..." : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}
