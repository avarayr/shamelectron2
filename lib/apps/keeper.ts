import { FixedStatus, type AppMeta } from "@/types";
import { findPattern } from "@/lib/findPattern";

export const Keeper: AppMeta = {
  icon: "https://cdn.brandfetch.io/ideJ88G7wZ/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1690487447667",
  id: "keeper-security-stable",
  friendlyName: "Keeper",
  twitter: "keepersecurity",
  async checkIsFixed() {
    const url = "https://www.keepersecurity.com/desktop_electron/Darwin/KeeperSetup.dmg";
    const pat = "_cornerMask";
    const result: { found: boolean; pos?: number } | null | undefined =
      await findPattern(url, pat);
    return result?.found ? FixedStatus.NOT_FIXED : FixedStatus.FIXED;
  },
};
