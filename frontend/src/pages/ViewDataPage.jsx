import React from "react";
import DataTable from "../components/DataTable";
import BasicModal from "../components/Modal";
import axios from "axios";

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

  // Example row data

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [file, setFile] = React.useState(null);

  const fetchData = async () => {
    try {
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
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    // file size limit check
    if (file.size > 1 * 1024 * 1024) { 
      alert("File size exceeds 5 MB limit. Please upload a smaller file.");
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
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
    setFile(null); // Reset file input after upload
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Add/View Data</h2>
      <div className="flex justify-start mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setOpen(true)}
        >
          Add Data
        </button>
        <div>
          <input
            type="file"
            id="fileInput"
            className="ml-4
          border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept=".csv, .xlsx, .xls"
            placeholder="Upload File"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                setFile(selectedFile);
              }
            }}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
            onClick={handleFileUpload}
          >
            Upload File
          </button>
        </div>

        <BasicModal
          open={open}
          onClose={() => setOpen(false)}
          fetchData={fetchData}
        />
      </div>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
