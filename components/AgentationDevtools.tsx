"use client";

import dynamic from "next/dynamic";

const DevelopmentToolbar = process.env.NODE_ENV === "development"
  ? dynamic(() => import("./AgentationToolbar").then(({ AgentationToolbar }) => AgentationToolbar), {
      ssr: false,
    })
  : () => null;

/** Loads the visual feedback toolbar only in a development browser session. */
export function AgentationDevtools() {
  return <DevelopmentToolbar />;
}
