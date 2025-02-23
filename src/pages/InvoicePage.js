import React, { useState } from "react";
import { FaTrash, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const InvoicePage = () => {
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const addItem = () => {
    setItems([...items, { name: "", itemCode: "", description: "", quantity: "", price: "" }]);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice / Quotation", 20, 10);
    doc.text(`Customer: ${customer}`, 20, 20);
    doc.text(`Date: ${date}`, 20, 30);
    
    doc.autoTable({
      startY: 40,
      head: [["Name", "Item Code", "Description", "Quantity", "Price", "Total"]],
      body: items.map(item => [item.name, item.itemCode, item.description, item.quantity, item.price, (item.quantity * item.price).toFixed(2)]),
    });
    
    doc.text(`Grand Total: $${calculateTotal()}`, 20, doc.autoTable.previous.finalY + 10);
    doc.save("invoice.pdf");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Invoice / Quotation</h1>
      <label className="block font-semibold">Customer Name</label>
      <input type="text" placeholder="Enter customer name" className="w-full p-2 border rounded mb-2" value={customer} onChange={(e) => setCustomer(e.target.value)} />
      <label className="block font-semibold">Invoice Date</label>
      <input type="date" className="w-full p-2 border rounded mb-4" value={date} onChange={(e) => setDate(e.target.value)} />
      <div className="mb-4 flex justify-center">
        <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded">Add Item</button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
          <input type="text" placeholder="Item Name" className="p-2 border rounded w-full" value={item.name} onChange={(e) => updateItem(index, "name", e.target.value)} />
          <input type="text" placeholder="Item Code" className="p-2 border rounded w-full" value={item.itemCode} onChange={(e) => updateItem(index, "itemCode", e.target.value)} />
          <input type="text" placeholder="Description" className="p-2 border rounded w-full" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
          <input type="text" placeholder="Qty" className="p-2 border rounded w-full" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))} />
          <input type="text" placeholder="Price" className="p-2 border rounded w-full" value={item.price} onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))} />
          <button onClick={() => removeItem(index)} className="text-red-500"><FaTrash /></button>
        </div>
      ))}
      <p className="text-right text-lg font-bold mt-4">Total: ${calculateTotal()}</p>
      <div className="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 justify-center">
        <button onClick={downloadPDF} className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center w-full md:w-auto">
          <FaFilePdf className="mr-2" /> Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
