import React from "react";
import DataTable from "../components/DataTable";
import BasicModal from "../components/Modal";
import axios from "axios";
  import { toast } from 'react-toastify';


export default function ViewDataPage() {
  // Define columns for DataGrid
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 140 },
    {
      field: "total_spent",
      headerName: "Total Spent",
      width: 130,
      type: "number",
    },
    { field: "visits", headerName: "Visits", width: 100, type: "number" },
    { field: "last_order_date", headerName: "Last Order Date", width: 200 },
  ];

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/customer/", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
      });
      if (response.status === 200) {
        // console.log("Data fetched successfully:", response.data);

        setRows(response.data);
      } else {
        toast.error("Failed to fetch data. Please try again later.");
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      toast.error("Error fetching data. Please check your connection.");
      console.error("Error fetching data:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("No file selected for upload.");
      return;
    }
    // file size limit check
    if (file.size > 100 * 1024) {
      toast.warning("File size exceeds 100KB limit. Please select a smaller file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/customer/create_multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.status === 201) {
        alert("File uploaded successfully!");
        fetchData(); // Refresh data after upload
      } else {
        console.error("Failed to upload file:", response.statusText);
        toast.error("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please check your connection.");
    }
    setFile(null); // Reset file input after upload
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Add/View Data</h2>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          onClick={() => setOpen(true)}
        >
          Add Data
        </button>
        <div className="flex items-center gap-2">
          <label
            htmlFor="fileInput"
            className="flex items-center cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-200 transition"
          >
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            <span className="font-medium text-gray-700">Choose File</span>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  setFile(selectedFile);
                }
              }}
            />
          </label>
          <span className="ml-2 text-sm text-gray-600">
            {file ? file.name : "No file chosen"}
          </span>
          <button
            className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition ml-2"
            onClick={handleFileUpload}
          >
            Upload
          </button>
        </div>
        <BasicModal
          open={open}
          onClose={() => setOpen(false)}
          fetchData={fetchData}
        />
      </div>
      {
        loading ? <div className="text-center text-gray-500">Loading...</div> :
        <DataTable columns={columns} rows={rows} enableDelete={true} />}
    </div>
  );
}
