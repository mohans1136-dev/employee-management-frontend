"use client";

import { useState, useEffect } from "react";

// 1. Define what an Employee looks like
interface Employee {
  id: number;
  name: string;
  role: string;
}

// 2. Define what props this component needs from its parent
interface EmployeeFormProps {
  isOpen: boolean;                 // Is the modal visible?
  onClose: () => void;             // Function to close the modal
  onSave: (data: { name: string; role: string }) => void; // Function to save data
  currentEmployee: Employee | null; // The employee to edit (or null if adding)
}

export default function EmployeeForm({ isOpen, onClose, onSave, currentEmployee }: EmployeeFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // 3. Reset or Fill the form whenever it opens
  useEffect(() => {
    if (currentEmployee) {
      // Edit Mode: Fill the boxes
      setName(currentEmployee.name);
      setRole(currentEmployee.role);
    } else {
      // Add Mode: Clear the boxes
      setName("");
      setRole("");
    }
  }, [currentEmployee, isOpen]);

  // If the modal is closed, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          {currentEmployee ? "Edit Employee" : "Add New Employee"}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // Lock name if editing (optional, based on your preference)
            readOnly={!!currentEmployee} 
            style={currentEmployee ? { backgroundColor: "#f3f4f6" } : {}}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ name, role })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}