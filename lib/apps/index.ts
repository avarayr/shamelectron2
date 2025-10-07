import { OnePassword } from "./1password";
import { ArduinoIDE } from "./arduino-ide";
import { BalenaEtcher } from "./balena-etcher";
import { Beeper } from "./beeper";
import { Bitwarden } from "./bitwarden";
import { Bruno } from "./bruno";
import { Claude } from "./claude";
import { Cluely } from "./cluely";
import { Cursor } from "./cursor";
import { Discord } from "./discord";
import { DiscordCanary } from "./discord-canary";
import { DockerDesktop } from "./docker";
import { Dropbox } from "./dropbox";
import { Element } from "./element";
import { Figma } from "./figma";
import { GitHubDesktop } from "./github-desktop";
import { GitKraken } from "./gitkraken";
import { Hey } from "./hey";
import { Keeper } from "./keeper";
import { Kiro } from "./kiro";
import { LMStudio } from "./lmstudio";
import { Logseq } from "./logseq";
import { Mattermost } from "./mattermost";
import { MongoDBCompass } from "./mongodb-compass";
import { Tabby } from "./tabby";
import { SuperProductivity } from "./super-productivity";
import { Notion } from "./notion";
import { NotionCalendar } from "./notion-calendar";
import { NotionMail } from "./notion-mail";
import { Obsidian } from "./obsidian";
import { PocketCasts } from "./pocket-casts";
import { Postman } from "./postman";
import { SaleaLogic } from "./salea-logic";
import { Signal } from "./signal";
import { Slack } from "./slack";
import { VisualStudioCode } from "./visual-studio-code";
import { VisualStudioCodeInsiders } from "./visual-studio-code-insiders";
import { Windsurf } from "./windsurf";

import type { AppMeta } from "../../types";

export const APPS: AppMeta[] = [
  ArduinoIDE,
  BalenaEtcher,
  Beeper,
  Bitwarden,
  Bruno,
  Claude,
  Cluely,
  Cursor,
  Discord,
  DiscordCanary,
  DockerDesktop,
  Dropbox,
  Element,
  Figma,
  GitHubDesktop,
  GitKraken,
  Keeper,
  Hey,
  Kiro,
  LMStudio,
  Logseq,
  Mattermost,
  MongoDBCompass,
  Tabby,
  Notion,
  SuperProductivity,
  NotionCalendar,
  NotionMail,
  Obsidian,
  OnePassword,
  PocketCasts,
  Postman,
  SaleaLogic,
  Signal,
  Slack,
  VisualStudioCode,
  VisualStudioCodeInsiders,
  Windsurf,
];
export default APPS;
