"use client";

import { useState, useEffect } from "react";

// Centralize time constants for easy updates
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;

function getTimeAgoString(updatedAt: Date, now: Date = new Date()): string {
  const diff = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);

  if (diff < SECONDS_IN_MINUTE) return `${diff}s ago`;
  if (diff < SECONDS_IN_HOUR)
    return `${Math.floor(diff / SECONDS_IN_MINUTE)}m ago`;
  if (diff < SECONDS_IN_DAY)
    return `${Math.floor(diff / SECONDS_IN_HOUR)}h ago`;
  return `${Math.floor(diff / SECONDS_IN_DAY)}d ago`;
}

const TimeAgo = ({ updatedAt }: { updatedAt: Date }) => {
  // Avoid computing dynamic time on the server to prevent hydration mismatch.
  const [timeAgo, setTimeAgo] = useState<string>("--- ago");

  useEffect(() => {
    // Update every minute for accuracy, or every second if less than a minute ago
    const initialDiff = Math.floor(
      (new Date().getTime() - updatedAt.getTime()) / 1000
    );
    const interval = initialDiff < SECONDS_IN_MINUTE ? 1000 : 60000;

    const tick = () => setTimeAgo(getTimeAgoString(updatedAt));
    const timer = setInterval(tick, interval);

    // Update immediately in case the prop changes
    tick();

    return () => clearInterval(timer);
  }, [updatedAt]);

  // Render an empty string on first SSR and initial client render; effect will populate.
  return <>{timeAgo}</>;
};

export default TimeAgo;
