import EmployeeList from "../components/EmployeeList";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
        Employee Management System
      </h1>
      
      {/* Here is our new component! */}
      <EmployeeList />
    </main>
  );
}