import React from "react";

/**
 * Render a metric value (e.g. "+180%", "3x", "+312%") with any trailing unit
 * suffix shrunk so it stays proportional and never wraps to its own line at
 * large display sizes. The numeric part keeps the full font size; the unit
 * (%, x, +, etc.) renders smaller.
 */
export function renderMetricValue(value: string): React.ReactNode {
  const m = /^(.*?)([%x+×]+)$/i.exec(value);
  if (!m) return value;
  const [, main, unit] = m;
  return (
    <>
      {main}
      <span className="text-[0.55em] align-baseline">{unit}</span>
    </>
  );
}
