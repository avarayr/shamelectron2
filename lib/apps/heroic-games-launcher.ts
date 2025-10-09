import { findPattern } from "@/lib/findPattern";
import { FixedStatus, type AppMeta } from "../../types";

export const HeroicGamesLauncher: AppMeta = {
  // prettier-ignore
  icon: "https://heroicgameslauncher.com/_next/static/images/logo-23215e07e1919bee380591f74ace6c70.png.webp",
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
