"use client";

import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { AppRecord } from "@/types";
import { AppRow } from "./app-card";
import { twMerge } from "tailwind-merge";
import { atomWithLocalStorage } from "./hooks/atomWithLocalStorage";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type ViewMode = "default" | "grouped";
const viewModeAtom = atomWithLocalStorage<ViewMode>("viewMode", "grouped");

export function AppGridClient({ apps }: { apps: AppRecord[] }) {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle global cmd+f to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter apps based on search query
  const filteredApps = apps.filter((app) =>
    app.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered apps by status
  const fixedApps = filteredApps.filter((app) => app.isFixed === "fixed");
  const notFixedApps = filteredApps.filter(
    (app) => app.isFixed === "not_fixed"
  );
  const unknownApps = filteredApps.filter((app) => app.isFixed === "unknown");

  // Sort each group alphabetically
  const sortedFixed = [...fixedApps].sort((a, b) =>
    a.friendlyName.localeCompare(b.friendlyName)
  );
  const sortedNotFixed = [...notFixedApps].sort((a, b) =>
    a.friendlyName.localeCompare(b.friendlyName)
  );
  const sortedUnknown = [...unknownApps].sort((a, b) =>
    a.friendlyName.localeCompare(b.friendlyName)
  );

  const renderAppsList = () => {
    if (viewMode === "default") {
      return (
        <div className="space-y-0">
          {filteredApps.map((app) => (
            <AppRow key={app.id} app={app} />
          ))}
        </div>
      );
    }

    // Grouped view
    return (
      <div className="space-y-8">
        {(
          [
            {
              label: "Fixed",
              border: "border-green-500/30",
              text: "text-green-400",
              dot: "bg-green-400",
              apps: sortedFixed,
            },
            {
              label: "Not Fixed",
              border: "border-red-500/30",
              text: "text-red-400",
              dot: "bg-red-400",
              apps: sortedNotFixed,
            },
            {
              label: "Unknown",
              border: "border-gray-500/30",
              text: "text-gray-400",
              dot: "bg-gray-400",
              apps: sortedUnknown,
            },
          ] as const
        ).map(
          ({ label, border, text, dot, apps }) =>
            apps.length > 0 && (
              <div key={label}>
                <div className={twMerge("mb-3 pb-2 border-b", border)}>
                  <h3
                    className={twMerge(
                      "text-sm font-mono",
                      "uppercase tracking-wider flex items-center gap-2",
                      text
                    )}
                  >
                    <span
                      className={twMerge(
                        "inline-block w-2 h-2 rounded-full",
                        dot
                      )}
                    ></span>
                    {label}
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      ({apps.length})
                    </span>
                  </h3>
                </div>
                <div className="space-y-0">
                  {apps.map((app) => (
                    <AppRow key={app.id} app={app} />
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    );
  };

  return (
    <>
      {/* Search and View Toggle */}
      <div className="mb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Input
              ref={searchInputRef}
              className="!bg-gray-900/50 border border-gray-800 rounded-lg"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                aria-label="Clear search"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as ViewMode)}
            className="flex-shrink-0"
          >
            <TabsList className="bg-gray-900/50 border border-gray-800 rounded-lg p-1 flex gap-2">
              <TabsTrigger
                value="default"
                className="px-3 py-1 text-xs font-mono rounded transition-all data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:text-gray-300"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="grouped"
                className="px-3 py-1 text-xs font-mono rounded transition-all data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:text-gray-300"
              >
                Grouped
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Apps List */}
      {renderAppsList()}
    </>
  );
}
