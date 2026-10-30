import "@fontsource/ibm-plex-sans/latin-300.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/sections.css";
import "./styles/commit-flow.css";
import { inject } from "@vercel/analytics";

import { initNav } from "./scripts/nav";
import { initHeroMotion } from "./scripts/heroMotion";
import { initArchitecture, initRace } from "./scripts/architecture";
import { initExplorer } from "./scripts/explorer";
import { initCopy } from "./scripts/copy";
import { initCommitFlow } from "./scripts/commitFlow";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Each enhancement is isolated: if one fails, the static page remains intact
// and the others still run.
const run = (name: string, fn: () => void) => {
  try {
    fn();
  } catch (err) {
    console.error(
      `[invari] ${name} enhancement failed; static content remains.`,
      err,
    );
  }
};

run("nav", initNav);
run("hero", () => initHeroMotion(reducedMotion));
run("architecture", initArchitecture);
run("race", () => initRace(reducedMotion));
run("commit-flow", () => initCommitFlow(reducedMotion));
run("explorer", initExplorer);
run("copy", initCopy);
run("analytics", () => inject());
