import { AppRecord, FixedStatus } from "@/types";
import {
  HelpCircle,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cloneElement } from "react";
import { twMerge } from "tailwind-merge";

function StatusIndicator({ status }: { status: FixedStatus }) {
  const getStatusDisplay = () => {
    switch (status) {
      case "fixed":
        return {
          Icon: <ThumbsUpIcon />,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
        };
      case "not_fixed":
        return {
          Icon: <ThumbsDownIcon />,
          color: "text-red-400",
          bgColor: "bg-red-400/10",
        };
      default:
        return {
          Icon: <HelpCircle />,
          color: "text-gray-400",
          bgColor: "bg-gray-400/10",
        };
    }
  };

  const { Icon, color, bgColor } = getStatusDisplay();

  return (
    <div
      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${bgColor} flex items-center justify-center border border-gray-800`}
    >
      {cloneElement(Icon, {
        className: twMerge(Icon.props.className, color, "size-5 sm:size-6"),
      })}
    </div>
  );
}

export function AppRow({ app }: { app: AppRecord }) {
  return (
    <div className="flex items-center gap-3 sm:gap-6 py-3 sm:py-4 border-b border-dashed-subtle border-gray-800 hover:bg-gray-900/20">
      {/* Status - Now the main focus */}
      <StatusIndicator status={app.isFixed} />

      {/* Icon */}
      <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
        <Image
          src={app.icon}
          alt={`${app.friendlyName} icon`}
          width={32}
          height={32}
          className="w-full h-full object-cover rounded-sm"
        />
      </div>

      {/* App Name */}
      <div className="flex-1 min-w-0">
        <span className="text-white text-xs sm:text-sm font-mono">
          {app.friendlyName}
        </span>
      </div>

      {/* Twitter Link */}
      <div className="text-center">
        {app.twitter && app.isFixed === FixedStatus.NOT_FIXED && (
          <Link
            href={
              `https://x.com/intent/tweet?text=` +
              encodeURIComponent(
                `please bump Electron to fix MacOS 26 performance issue @${app.twitter}`
              )
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors text-xs flex items-center gap-1 flex-row"
            aria-label={`Follow ${app.friendlyName} on Twitter`}
          >
            <span className="hidden sm:inline text-xs">
              ask <span className="text-white">@{app.twitter}</span> to bump
              Electron
            </span>
            <span className="sm:hidden">
              ask <span className="text-white">@{app.twitter}</span>
            </span>
            <TwitterIcon className="size-3 sm:size-4 ml-1 sm:ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
}
