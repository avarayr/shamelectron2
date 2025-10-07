import { findPattern } from "@/lib/findPattern";
import { FixedStatus, type AppMeta } from "../../types";

export const Postman: AppMeta = {
  icon: "https://cdn.brandfetch.io/idrVtxty7B/w/128/h/128/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1667906412376",
  id: "postman-stable",
  friendlyName: "Postman",
  twitter: "getpostman",
  async checkIsFixed() {
    const url = "https://dl.pstmn.io/download/latest/osx_arm64";
    const pat = "_cornerMask";
    const result: { found: boolean; pos?: number } | null | undefined =
      await findPattern(url, pat);
    return result?.found ? FixedStatus.NOT_FIXED : FixedStatus.FIXED;
  },
};
