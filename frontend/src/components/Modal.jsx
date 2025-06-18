import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};

export default function BasicModal({ open, onClose, fetchData }) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    total_spent: "",
    visits: "",
    last_order_date: "",
  });
  const [customFields, setCustomFields] = React.useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (customFields.some((field) => field.name === name)) {
      setForm((prevForm) => ({
        ...prevForm,
        customFields: {
          ...prevForm.customFields,
          [name]: value,
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting form data:", form);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customer/create`,
        form,
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
        toast.success("Customer added successfully!");
        fetchData();
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid input, please check your details");
      } else {
        toast.error("Failed to add customer, please try again later");
      }
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      total_spent: "",
      visits: "",
      last_order_date: "",
    });
    onClose();
  };
  const fetchCustomFields = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/customfield/`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );
      if (response.status === 200) {
        const customFields = response.data;
        setCustomFields(customFields);
        customFields.forEach((field) => {
          setForm((prevForm) => ({
            ...prevForm,
            customFields: {
              ...prevForm.customFields,
              [field.name]: "",
            },
          }));
        });
        console.log("Custom fields fetched successfully:", customFields);
      }
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  };
  React.useEffect(() => {
    fetchCustomFields();
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <h3 className="text-center text-2xl font-bold mb-4">Add Customer</h3>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter Customer Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter Phone"
          required
        />
        <input
          type="number"
          name="total_spent"
          value={form.total_spent}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Total Spent"
        />
        <input
          type="number"
          name="visits"
          value={form.visits}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Visits"
        />
        <label
          className="block mb-2 text-sm font-medium text-gray-700"
          htmlFor="last_order_date"
        >
          Last Order Date
        </label>
        <input
          type="date"
          name="last_order_date"
          id="last_order_date"
          value={form.last_order_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {customFields.map((field) => (
          <input
            key={field.name}
            type={
              field.type === "number"
                ? "number"
                : field.type === "date"
                ? "date"
                : "text"
            }
            name={field.name}
            value={form.customFields?.[field.name] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder={field.label}
            required={field.required}
          />
        ))}
        <Box mt={2} display="flex" justifyContent="flex-start" gap={2}>
          <Button type="submit" variant="contained">
            Add
          </Button>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
