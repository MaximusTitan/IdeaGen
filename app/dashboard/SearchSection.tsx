"use client";
import { useState } from "react";
import { Search } from "lucide-react";

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch(value); // Call the onSearch prop immediately on input change
  };

  return (
    <div className="flex items-center justify-center p-20">
      <div className="w-full max-w-3xl">
        <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="search"
            value={searchQuery}
            onChange={handleInputChange} // Updated to handle input change
            placeholder="Search templates..."
            className="w-full pl-12 pr-4 py-3 bg-gray-900 text-white placeholder-gray-400 rounded-full text-lg"
          />
        </div>
      </div>
    </div>
  );
}
