"use client";

import { useState } from "react";
import { AppRecord } from "@/types";
import { AppRow } from "./app-card";

type ViewMode = "default" | "grouped";

export function AppGridClient({ apps }: { apps: AppRecord[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("default");

  // Group apps by status
  const fixedApps = apps.filter((app) => app.isFixed === "fixed");
  const notFixedApps = apps.filter((app) => app.isFixed === "not_fixed");
  const unknownApps = apps.filter((app) => app.isFixed === "unknown");

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
          {apps.map((app) => (
            <AppRow key={app.id} app={app} />
          ))}
        </div>
      );
    }

    // Grouped view
    return (
      <div className="space-y-8">
        {/* Not Fixed Section */}
        {sortedNotFixed.length > 0 && (
          <div>
            <div className="mb-3 pb-2 border-b border-red-500/30">
              <h3 className="text-sm font-mono text-red-400 uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
                Not Fixed
                <span className="text-xs text-gray-500 font-normal ml-1">
                  ({sortedNotFixed.length})
                </span>
              </h3>
            </div>
            <div className="space-y-0">
              {sortedNotFixed.map((app) => (
                <AppRow key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}

        {/* Fixed Section */}
        {sortedFixed.length > 0 && (
          <div>
            <div className="mb-3 pb-2 border-b border-green-500/30">
              <h3 className="text-sm font-mono text-green-400 uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                Fixed
                <span className="text-xs text-gray-500 font-normal ml-1">
                  ({sortedFixed.length})
                </span>
              </h3>
            </div>
            <div className="space-y-0">
              {sortedFixed.map((app) => (
                <AppRow key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}

        {/* Unknown Section */}
        {sortedUnknown.length > 0 && (
          <div>
            <div className="mb-3 pb-2 border-b border-gray-500/30">
              <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                Unknown
                <span className="text-xs text-gray-500 font-normal ml-1">
                  ({sortedUnknown.length})
                </span>
              </h3>
            </div>
            <div className="space-y-0">
              {sortedUnknown.map((app) => (
                <AppRow key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Table Header with View Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6 py-2 border-b border-gray-800">
          {/* Column Headers */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1">
            <div className="w-10 sm:w-12">
              <span className="text-xs text-muted font-mono uppercase tracking-wide">
                status
              </span>
            </div>
            <div className="w-6 sm:w-8"></div>
            <div className="flex-1">
              <span className="text-xs text-muted font-mono uppercase tracking-wide">
                app
              </span>
            </div>
            <div className="w-12 sm:w-16 text-center">
              <span className="text-xs text-muted font-mono uppercase tracking-wide">
                social
              </span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setViewMode("default")}
              className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                viewMode === "default"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode("grouped")}
              className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                viewMode === "grouped"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
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
