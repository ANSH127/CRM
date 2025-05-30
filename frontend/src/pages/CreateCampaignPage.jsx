import React from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { initializeChat, fetchModelResponse } from "../config/AI";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

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
  const [loading3, setLoading3] = React.useState(false);
  const [matchcount, setMatchCount] = React.useState(0);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();
  const [toggleaiquery, setToggleAIQuery] = React.useState(false);
  const [aiQuery, setAIQuery] = React.useState("");

  const fetchAudienceCount = async () => {
    var queryData;
    if (toggleaiquery) {
      queryData = JSON.parse(aiQuery);
    } else {
      queryData = formatQuery(query, "mongodb_query");
    }
    if (!queryData || Object.keys(queryData).length === 0) {
      toast.warning("Please define rules to fetch audience count.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaign/matched-customers-count`,
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

  const genrateTag = async (prompt) => {
    if (!prompt) {
      toast.warning("Please enter a prompt to generate tags.");
      return;
    }
    try {
      const response = await fetchModelResponse(prompt);
      return response;
    } catch (error) {
      console.error("Error generating tags:", error);
      toast.error("Failed to generate tags, please try again.");
    }
  };
  const genrateMessages = async (msg) => {
    if (!msg) {
      toast.warning("Please enter a prompt to generate messages.");
      return;
    }

    const prompt=`You're a creative marketing assistant. Given a campaign objective, suggest 1 long, engaging promotional messages that include a personalized {name} placeholder and are suitable for email.

            Make sure:
            - Use emojis sparingly
            - Include promotional offers or call-to-actions if relevant
            - Use {name} instead of the actual name
            - Avoid using the word "you" or "your"
            - Only return the  message text without any additional explanations or formatting
            - Do not include any HTML tags or formatting

            User Input:
            ${msg}
            `

    try {
      setLoading3(true);
      const response = await fetchModelResponse(prompt);
      if (response) {
        setMessage(response);
        toast.success("Messages generated successfully!");
      } else {
        throw new Error("Failed to generate messages");
      }
    } catch (error) {
      console.error("Error generating messages:", error);
      toast.error("Failed to generate messages, please try again.");
    } finally {
      setLoading3(false);
    }
  };
  function cleanAIJsonResponse(response) {
    // Remove code block markers and trim whitespace
    return response.replace(/```json|```/g, "").trim();
  }

  const genrateQuery = async (msg) => {
    if (!msg) {
      toast.warning("Please enter a prompt to generate query.");
      return;
    }
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const prompt = `You're a backend engineer assistant for a CRM system.

              Convert the following natural language into a MongoDB-style query object using valid fields and operators.

              🔧 Allowed Fields:
              - total_spent (number, in INR)
              - visits (number)
              - last_order_date (date in YYYY-MM-DD)

              🔧 Allowed Operators:
              - $gt, $lt, $gte, $lte, $eq
              - $and, $or (use arrays for combining conditions)

              💡 Time-based phrases like "6 months ago", "last year", or "inactive for 90 days" should be converted to real dates (assume today's date is ${today} .

              ✅ Output a valid MongoDB query object using proper nesting. Return **only the JSON** — no explanation or extra text.

              User Input:
              ${msg}
`;
    try {
      let response = await fetchModelResponse(prompt);
      if (response) {
        response = cleanAIJsonResponse(response);
        // console.log(response);

        setAIQuery(JSON.stringify(JSON.parse(response), null, 2));
        
        toast.success("Query generated successfully!");
      } else {
        throw new Error("Failed to generate query");
      }
    } catch (error) {
      console.error("Error generating query:", error);
      toast.error("Failed to generate query, please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(toggleaiquery && !aiQuery) {
      toast.warning("Please generate a query before submitting.");
      return;
    }
    let myquery = toggleaiquery ? JSON.parse(aiQuery) : formatQuery(query, "mongodb_query");


    if(!myquery || Object.keys(myquery).length === 0) {
      toast.warning("Please define rules to create a campaign.");
      return;
    }

    // console.log(name, description, myquery, message);
    if (!name || !description || !myquery || !message) {
      toast.warning("Please fill all fields before submitting.");
      return;
    }

    try {
      setLoading2(true);

      const tagPrompt = `You're a marketing expert. Based on the audience rules and the campaign message, assign the most relevant tag that describes the intent of this campaign.

              Choose one tag from these or suggest your own:
              - Win-back
              - Inactive Users
              - High Value Customers
              - Low Engagement
              - New User Offer
              - Discount Push
              - Festival Sale
              - Loyalty Reward
              - Abandoned Cart

              Audience Rules:
              ${JSON.stringify(myquery)}

              Message:
              ${message}
              Make sure to:
              - Only return the tag name without any additional text
              - If no tag fits, suggest a new tag that best describes the campaign intent
              - Avoid using generic terms like "Marketing" or "Campaign"
              - Focus on the specific intent of the campaign based on the audience and message
`;
      const tagResponse = await genrateTag(tagPrompt);
      // console.log("Generated Tag:", tagResponse);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaign/create`,
        {
          name,
          description,
          rules: myquery,
          message,
          tag: tagResponse || "General",
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
    } finally {
      setLoading2(false);
    }
  };

  React.useEffect(() => {
    initializeChat([]);
  }, []);

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
            <FormControlLabel
              control={
                <Switch
                  checked={toggleaiquery}
                  onChange={(e) => setToggleAIQuery(e.target.checked)}
                  color="primary"
                />
              }
              label="Use AI to generate query"
            />

            <label className="block text-gray-700 text-sm font-bold mb-2">
              Query Builder
            </label>
            {toggleaiquery ? (
              <>
                <textarea
                  placeholder="Enter AI generated query here"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={aiQuery}
                  onChange={(e) => setAIQuery(e.target.value)}
                ></textarea>
                <Chip
                  label="Generate Query"
                  color="default"
                  className="cursor-pointer mt-2"
                  onClick={() => genrateQuery(aiQuery)}
                />
              </>
            ) : (
              <QueryBuilder
                fields={fields}
                query={query}
                onQueryChange={setQuery}
              />
            )}
            <div className="mt-4 flex items-center">
              <Chip
                label="Fetch Audience Count"
                color="primary"
                className="cursor-pointer"
                onClick={fetchAudienceCount}
              />
              <span className="ml-2 text-gray-600">
                {!toggleaiquery && query.rules.length > 0
                  ? `Matched Audience: ${loading ? "Loading..." : matchcount}`
                  : toggleaiquery 
                  && aiQuery
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
            <div className="mt-2">
              <Chip
                label={loading3 ? "Generating..." : "Generate Messages"}
                color="secondary"
                className="cursor-pointer"
                onClick={() => genrateMessages(message)}
              />
            </div>
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
