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


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/customer/",{
        headers:{
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
      });
      if (response.status === 200) {
          console.log("Data fetched successfully:", response.data);
          
        setRows(response.data);
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }

      
    } catch (error) {
      console.error("Error fetching data:", error);
      
    }


  }
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
        <BasicModal open={open} onClose={() => setOpen(false)} 
          fetchData={fetchData} 
          
         />
      </div>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
