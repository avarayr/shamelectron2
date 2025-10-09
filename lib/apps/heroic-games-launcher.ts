import { FixedStatus, type AppMeta } from "@/types";
import { findPattern } from "@/lib/findPattern";

export const HeroicGamesLauncher: AppMeta = {
  // prettier-ignore
  icon: "https://avatars.githubusercontent.com/u/77549103?s=128",
  id: "heroic-games-launcher",
  friendlyName: "Heroic Games Launcher",
  twitter: "HeroicLauncher",
  async checkIsFixed() {
    const url = await fetch(
      "https://api.github.com/repos/Heroic-Games-Launcher/HeroicGamesLauncher/releases/latest"
    )
      .then((res) => res.json())
      .then(
        (data) =>
          data.assets.find(
            (asset: { name: string }) =>
              asset.name.endsWith("-macOS-arm64.dmg")
          )?.browser_download_url
      );
    const pat = "_cornerMask";
    const result = await findPattern(url, pat);
    return result?.found ? FixedStatus.NOT_FIXED : FixedStatus.FIXED;
  },
};
