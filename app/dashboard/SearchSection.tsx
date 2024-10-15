"use client"
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'



function SearchSection({ onSearchInput }: any) {
    const [searchTerm, setSearchTerm] = useState("")
  return (
    <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search...."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 text-white placeholder-gray-400 rounded-full border-gray-700 focus:ring-2 focus:ring-blue-500 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
  );
}

export default SearchSection;
