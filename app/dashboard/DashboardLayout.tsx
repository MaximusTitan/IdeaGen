// app/dashboard/DashboardLayout.tsx

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { User, Home, Search, Clock, Settings, CreditCard, TrendingUp, Receipt } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Animated Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-20"
        } flex flex-col items-start justify-between py-4 fixed h-full z-50 bg-black border-r border-gray-800`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="space-y-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            className={`w-full flex items-center justify-start px-4 py-2 transition-all duration-300 ${
              isExpanded ? "text-left" : "justify-center"
            }`}
          >
            <TrendingUp className="h-6 w-6 mr-2 flex-shrink-0" />
            <span
              className={`transition-opacity duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 w-0"
              } whitespace-nowrap overflow-hidden`}
            >
              Upgrade
            </span>
          </Button>
        </div>
        <div className="flex-1 w-full space-y-4 my-4">
          {[
            { icon: Home, label: "Home" },
            { icon: Clock, label: "History" },
            { icon: Settings, label: "Settings" },
            { icon: Receipt, label: "Billing" },
          ].map(({ icon: Icon, label }, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`w-full flex items-center justify-start px-4 py-2 transition-all duration-300 ${
                isExpanded ? "text-left" : "justify-center"
              }`}
            >
              <Icon className="h-6 w-6 mr-2 flex-shrink-0" />
              <span
                className={`transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0 w-0"
                } whitespace-nowrap overflow-hidden`}
              >
                {label}
              </span>
            </Button>
          ))}
        </div>
        <div className="w-full">
          <Button
            variant="ghost"
            size="icon"
            className={`w-full flex items-center justify-start px-4 py-2 transition-all duration-300 ${
              isExpanded ? "text-left" : "justify-center"
            }`}
          >
            <CreditCard className="h-6 w-6 mr-2 flex-shrink-0" />
            <span
              className={`transition-opacity duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 w-0"
              } whitespace-nowrap overflow-hidden`}
            >
              Credits
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isExpanded ? "ml-64" : "ml-20"}`}>
        {/* Top Bar */}
        <header className="flex justify-between items-center p-4 bg-gray-900">
          <h1 className="text-2xl font-bold">IdeaGen</h1>

          {/* User Button - Aligned to the right */}
          <div>
            <UserButton />
          </div>
        </header>

        {/* Render the dynamic children */}
        <div className="p-2">{children}</div>
      </main>
    </div>
  );
}
