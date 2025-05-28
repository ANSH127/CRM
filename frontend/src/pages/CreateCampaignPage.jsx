import React from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

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
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold text-center mt-4">
          Create a New Campaign
        </h1>
        <p className="text-center mt-2 text-lg">
          Fill out the form below to create a new campaign.
        </p>
      </div>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            placeholder="Enter campaign name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter campaign description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <h3 className="mt-4 text-gray-700">
            <code>
              {JSON.stringify(formatQuery(query, "mongodb_query"), null, 2)}
            </code>
          </h3>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={() => {
            // Handle campaign creation logic here
            console.log("Campaign created with query:", JSON.stringify(formatQuery(query, "mongodb_query"), null, 2));
          }}
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
}
