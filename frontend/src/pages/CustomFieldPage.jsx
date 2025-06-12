import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CustomFieldPage() {
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "string",
    required: false,
  });
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/customfield/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFields(res.data);
    } catch (err) {
      toast.error("Failed to fetch custom fields");
    }
    setLoading(false);
  };

  const handleAddField = () => {
    if (!newField.name || !newField.label) {
      toast.error("Name and Label are required");
      return;
    }
    const existingField = fields.find((field) => field.name === newField.name);
    if (existingField) {
      toast.error("Field with this name already exists");
      return;
    }
    setFields([...fields, newField]);
    setNewField({ name: "", label: "", type: "string", required: false });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customfield/update-fields`,
        { fields },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Custom fields updated successfully");
    } catch (err) {
      toast.error("Failed to update custom fields");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (idx, key, value) => {
    const updated = [...fields];
    updated[idx][key] = value;
    setFields(updated);
  };

  const handleRemoveField = (idx) => {
    const updated = fields.filter((_, i) => i !== idx);
    setFields(updated);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="mb-4 bg-yellow-50 p-4 rounded border border-yellow-200">
        <div className="flex items-start gap-3">
          <span className="mt-1 text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm text-gray-700 font-medium mb-1">
              <span className="font-semibold">Note:</span> Custom fields let you
              store extra information about your users.
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 mb-1">
              <li>
                <span className="font-semibold">Field Name</span> must be unique
                and can only contain{" "}
                <span className="font-mono bg-gray-100 px-1 rounded">
                  letters
                </span>
                ,{" "}
                <span className="font-mono bg-gray-100 px-1 rounded">
                  numbers
                </span>
                , and{" "}
                <span className="font-mono bg-gray-100 px-1 rounded">
                  underscores
                </span>
                .
              </li>
              <li>
                <span className="font-semibold">Allowed:</span>{" "}
                <span className="font-mono bg-green-100 px-1 rounded">
                  birthday
                </span>
                ,{" "}
                <span className="font-mono bg-green-100 px-1 rounded">
                  membership_level
                </span>
                ,{" "}
                <span className="font-mono bg-green-100 px-1 rounded">
                  custom1
                </span>
              </li>
              <li>
                <span className="font-semibold">Not allowed:</span>{" "}
                <span className="font-mono bg-red-100 px-1 rounded">
                  first name
                </span>
                ,{" "}
                <span className="font-mono bg-red-100 px-1 rounded">
                  email-address
                </span>
                ,{" "}
                <span className="font-mono bg-red-100 px-1 rounded">
                  user@id
                </span>
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              Example:{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                birthday
              </span>{" "}
              is valid,{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                first name
              </span>{" "}
              is not.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Manage Custom Fields
      </h2>
      {loading && <div className="text-blue-500 mb-2">Loading...</div>}
      <div className="flex flex-wrap gap-2 mb-6 items-end">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Field Name"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Label"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
        >
          <option value="string">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
        <label className="flex items-center space-x-1 mb-2">
          <input
            type="checkbox"
            checked={newField.required}
            onChange={(e) =>
              setNewField({ ...newField, required: e.target.checked })
            }
            className="accent-blue-500"
          />
          <span className="text-sm">Required</span>
        </label>
        <button
          onClick={handleAddField}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Field
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border-b">Name</th>
              <th className="py-2 px-3 border-b">Label</th>
              <th className="py-2 px-3 border-b">Type</th>
              <th className="py-2 px-3 border-b">Required</th>
              <th className="py-2 px-3 border-b">Remove</th>
            </tr>
          </thead>
          <tbody>
            {fields?.map((field, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                <td className="py-2 px-3 border-b">
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={field.name}
                    onChange={(e) =>
                      handleFieldChange(idx, "name", e.target.value)
                    }
                  />
                </td>
                <td className="py-2 px-3 border-b">
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(idx, "label", e.target.value)
                    }
                  />
                </td>
                <td className="py-2 px-3 border-b">
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={field.type}
                    onChange={(e) =>
                      handleFieldChange(idx, "type", e.target.value)
                    }
                  >
                    <option value="string">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </td>
                <td className="py-2 px-3 border-b text-center">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      handleFieldChange(idx, "required", e.target.checked)
                    }
                    className="accent-blue-500"
                  />
                </td>
                <td className="py-2 px-3 border-b text-center">
                  <button
                    onClick={() => handleRemoveField(idx)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No custom fields defined.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        onClick={handleSave}
      >
        Save Fields
      </button>
    </div>
  );
}
