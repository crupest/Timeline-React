import React from "react";

export function getDisplayName(c: React.ComponentType<any>): string {
  return c.displayName || c.name || "Component";
}
