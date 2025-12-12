"use client";

import { useEffect, useState } from "react";
import EmployeeForm from "./EmployeeForm";

interface Employee {
  id: number;
  name: string;
  role: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // 1. Fetch Data
  const fetchEmployees = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`) 
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Handle Delete
  const handleDelete = (id: number) => {
    if(!confirm("Are you sure you want to delete this employee?")) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`, {
      method: 'DELETE',
    }).then(() => {
      fetchEmployees(); // Refresh the list
    });
  };

  // 3. Handle Edit Click
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee); // Set the data to fill the box
    setIsModalOpen(true);         // Open the popup
  };

  // 4. Handle Save (Smart: Handles both Add and Edit)
  const handleSave = (data: { name: string; role: string }) => {
    if (editingEmployee) {
      // EDIT MODE (PUT)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${editingEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingEmployee.id, ...data }),
      })
      .then(() => {
        fetchEmployees();
        setIsModalOpen(false);
      });
    } else {
      // ADD MODE (POST)
      fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      .then(() => {
        fetchEmployees();
        setIsModalOpen(false);
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-lg bg-white mt-10">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Team Directory</h2>
        <button 
          onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium transition"
        >
          + Add Employee
        </button>
      </div>
      
      <ul className="space-y-3">
        {employees.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">No employees found.</p>
        ) : (
          employees.map((emp) => (
            <li 
              key={emp.id} 
              className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800">{emp.name}</h3>
                <span className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                  {emp.role}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(emp)}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded hover:bg-blue-50"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(emp.id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <EmployeeForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        currentEmployee={editingEmployee}
      />
    </div>
  );
}