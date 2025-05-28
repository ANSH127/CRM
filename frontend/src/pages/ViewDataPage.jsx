import React from "react";
import DataTable from "../components/DataTable";

export default function ViewDataPage() {
  // Define columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
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
    { field: "last_order_date", headerName: "Last Order Date", width: 160 },
  ];

  // Example row data
  const rows = [
    {
      id: 1, // DataGrid requires a unique 'id' field
      name: "Riya",
      email: "riya@example.com",
      phone: "9999999999",
      total_spent: 12000,
      visits: 3,
      last_order_date: "2024-12-10",
      user_id: "user123",
    },{
      id: 2, // DataGrid requires a unique 'id' field
      name: "Riya2",
      email: "riya@example.com",
      phone: "9999999999",
      total_spent: 12000,
      visits: 3,
      last_order_date: "2024-12-10",
      user_id: "user123",
    },
    // Add more rows as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">View Data</h2>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
