"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { AppRecord } from "@/types";
import { AppRow } from "./app-card";
import { twMerge } from "tailwind-merge";
import { atomWithLocalStorage } from "./hooks/atomWithLocalStorage";

type ViewMode = "default" | "grouped";
const viewModeAtom = atomWithLocalStorage<ViewMode>("viewMode", "grouped");

export function AppGridClient({ apps }: { apps: AppRecord[] }) {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

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
      {/* Table Header with View Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-end gap-3 sm:gap-6">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-800">
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
