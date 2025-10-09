import { FixedStatus, type AppMeta } from "@/types";
import { findPattern } from "@/lib/findPattern";

export const LogiOptions: AppMeta = {
  icon: "https://cdn.brandfetch.io/idX2nqEtNo/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1756407828651",
  id: "logi-options-stable",
  friendlyName: "Logi Options+",
  twitter: "logitech",
  async checkIsFixed() {
    const url = "https://www.logitech.com/en-us/software/logi-options-plus.html";
    const pat = "_cornerMask";
    const result = await findPattern(url, pat);
    return result?.found ? FixedStatus.NOT_FIXED : FixedStatus.FIXED;
  },
};
