import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="w-full flex items-center bg-white shadow-md rounded-lg px-2 md:w-1/2 mx-auto h-10">
      <FaSearch className="text-gray-500 ml-2" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={query}
        onChange={handleSearch}
        className="w-full p-2 outline-none border-none bg-transparent"
      />
      {query && (
        <button onClick={clearSearch} className="text-gray-500 hover:text-gray-700 p-1">
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
