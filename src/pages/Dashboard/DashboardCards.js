import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCards = () => {
  const navigate = useNavigate();

  const Card = ({ title, icon, location }) => {
    return (
      <div
        onClick={() => navigate(location)}
        className="bg-indigo-100 border-2 border-gray-300 rounded p-6 text-center cursor-pointer"
      >
        <div className="text-3xl">{icon}</div>
        <p className="text-gray-700 font-medium mt-2">{title}</p>
      </div>
    );
  };

  return (
    <div className="w-full md:w-3/4 lg:w-1/2 mx-auto bg-white p-4 rounded-lg mt-2">
      <div className="grid grid-cols-2 gap-4">
        <Card location="/products" title="Products" icon="📦" />
        <Card location="/invoice" title="Invoices" icon="📄" />
        <Card location="/invoice/create" title="Create Invoice" icon="📝" />
        <Card location="/clients" title="Customers" icon="👥" />
        {/* <Card title="Users" icon="🧑‍💼" /> */}
      </div>
    </div>
  );
};

export default DashboardCards;

// <div className="flex flex-col md:flex-row items-center justify-center gap-4">
// <div className="w-full md:w-1/3 bg-indigo-100 border border-gray-300 rounded p-6 text-center">
//   <h2 className="text-xl font-semibold">Card 1</h2>
//   <p className="text-gray-600">This is the first card.</p>
// </div>

// <div className="w-full md:w-1/3 bg-indigo-100 border border-gray-300 rounded p-6 text-center">
//   <h2 className="text-xl font-semibold">Card 2</h2>
//   <p className="text-gray-600">This is the second card.</p>
// </div>
// <div className="w-full md:w-1/3 bg-indigo-100 border border-gray-300 rounded p-6 text-center">
//   <h2 className="text-xl font-semibold">Card 3</h2>
//   <p className="text-gray-600">This is the third card.</p>
// </div>
// </div>
