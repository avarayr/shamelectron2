"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { AppRecord } from "@/types";
import { AppRow } from "./app-card";
import { twMerge } from "tailwind-merge";
import { atomWithLocalStorage } from "./hooks/atomWithLocalStorage";
import { X } from "lucide-react";

type ViewMode = "default" | "grouped";
const viewModeAtom = atomWithLocalStorage<ViewMode>("viewMode", "grouped");

export function AppGridClient({ apps }: { apps: AppRecord[] }) {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter apps based on search query
  const filteredApps = apps.filter((app) =>
    app.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered apps by status
  const fixedApps = filteredApps.filter((app) => app.isFixed === "fixed");
  const notFixedApps = filteredApps.filter((app) => app.isFixed === "not_fixed");
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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={twMerge(
                "w-full px-4 py-2.5 font-mono text-sm",
                "bg-black border-2 rounded-lg",
                "text-white placeholder:text-gray-500",
                "focus:outline-none focus:border-red-500",
                "transition-colors",
                searchQuery ? "border-red-500" : "border-gray-800"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors"
                aria-label="Clear search"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-800 flex-shrink-0">
            <button
              onClick={() => setViewMode("default")}
              className={twMerge(
                `px-3 py-1 text-xs font-mono rounded transition-all`,
                viewMode === "default"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              All
            </button>
            <button
              onClick={() => setViewMode("grouped")}
              className={twMerge(
                `px-3 py-1 text-xs font-mono rounded transition-all`,
                viewMode === "grouped"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              Grouped
            </button>
          </div>
        </div>
      </div>

      {/* Apps List */}
      {renderAppsList()}
    </>
  );
}
