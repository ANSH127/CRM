import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export default function DataTable({ columns, rows: initialRows }) {
  const [rows, setRows] = React.useState(initialRows);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const paginationModel = { page: 0, pageSize: 5 };

  const handleDelete = () => {
    if (selectionModel.length === 0) return;
    for (const id of selectionModel) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
    setSelectionModel([]);
    console.log("Rows after deletion:", rows);
  };

  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        marginTop: 2,
        margin: "0 auto",
        padding: 2,
      }}
    >
      <div className="flex justify-end mb-2">
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={selectionModel.length === 0}
        >
          Delete Selected
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection.ids);
        }}
        selectionModel={selectionModel}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
