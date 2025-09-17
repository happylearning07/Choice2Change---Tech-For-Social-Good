// src/components/FootprintHistory.js
import React, { useMemo } from "react";

const STORAGE_KEY = "footprintHistoryV1";

function toCSV(rows) {
  const header = "date,kg_co2e";
  const body = rows.map((r) => `${r.date},${r.value ?? ""}`).join("\n");
  return [header, body].join("\n");
}

export default function FootprintHistory({ history = [] }) {
  // last 28 days
  const last28 = useMemo(() => history.slice(-28), [history]);

  // stats
  const values = last28.map((d) => d.value).filter((v) => v != null);
  const hasData = values.length > 0;
  const max = hasData ? Math.max(...values) : 0;
  const min = hasData ? Math.min(...values) : null;

  // weekly-normalized 7-day average (treat missing as 0)
  const last7 = last28.slice(-7).map((d) => d.value ?? 0);
  const avg7 =
    last7.length === 7
      ? last7.reduce((a, b) => a + b, 0) / 7
      : last7.reduce((a, b) => a + b, 0) / 7; // same math even if <7 present

  // sparkline path
  const sparkW = 320,
    sparkH = 64,
    pad = 4;
  const spark = useMemo(() => {
    const pts = last28.map((d) => d.value ?? 0);
    const localMax = Math.max(max, 1);
    const stepX = (sparkW - pad * 2) / Math.max(pts.length - 1, 1);
    const path = pts
      .map((v, i) => {
        const x = pad + i * stepX;
        const y = pad + (sparkH - pad * 2) * (1 - v / localMax);
        return `${i === 0 ? "M" : "L"}${x},${Number.isFinite(y) ? y : sparkH - pad}`;
      })
      .join(" ");
    return { path, last: pts.at(-1) ?? 0 };
  }, [last28, max]);

  const handleExport = () => {
    const csv = toCSV(history);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "footprint_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!window.confirm("Reset local history? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  // map into 4x7 grid (oldest -> newest = left -> right)
  const cells = last28.map((d, i) => {
    // const col = Math.floor(i / 7); // 0..3
    
    const col = 3 - Math.floor(i / 7);

    const row = i % 7; // 0..6
    const val = d.value ?? 0;
    const ratio = max ? val / max : 0;
    const hue = Math.round(140 - 140 * ratio); // green -> red
    const bg =
      d.value == null ? "rgba(148,163,184,.25)" : `hsl(${hue} 70% 45%)`;
    const label = `${d.date} • ${d.value != null ? d.value : "—"} kg CO₂e`;
    return { col, row, bg, label };
  });

  return (
    <section className="card charts-card history-card">
      <div className="card-header">
        <div className="card-title">
          <h3>Footprint History</h3>
        </div>
        <div className="card-right history-badges">
          <span className="hist-badge avg">
            7-day avg&nbsp;{avg7.toFixed(1)} kg
          </span>
          <span className="hist-badge best">
            Best&nbsp;{min != null ? min.toFixed(1) : "—"} kg
          </span>
        </div>
      </div>

      <div className="history-wrap">
        {/* Heatmap */}
        <div
          className="hist-heatmap"
          role="img"
          aria-label="28 day footprint heatmap"
        >
          {/* Week labels aligned to heatmap columns (2..5) */}
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="hist-weeklbl"
              style={{ gridColumn: i + 2 }}
            >
              {`W${i + 1}`}
            </div>
          ))}

          {/* Cells */}
          {cells.map((c, i) => (
            <div
              key={i}
              className="hist-cell"
              style={{
                gridColumn: c.col + 2,
                gridRow: c.row + 1,
                background: c.bg,
              }}
              title={c.label}
            />
          ))}
        </div>

        {/* Sparkline card */}
        <div className="hist-spark">
          <svg
            viewBox={`0 0 ${sparkW} ${sparkH}`}
            className="spark-svg"
            preserveAspectRatio="none"
          >
            <path d={spark.path} className="spark-path" />
            <circle
              cx={sparkW - 4}
              cy={(() => {
                const localMax = Math.max(max, 1);
                return (
                  4 + (sparkH - 8) * (1 - (spark.last ?? 0) / localMax)
                );
              })()}
              r="2.8"
              className="spark-dot"
            />
          </svg>

          <div className="spark-caption">
            <span>Last {last28.length} days</span>
            <span className="spark-last">
              Today:&nbsp;
              {last28.at(-1)?.value != null
                ? `${last28.at(-1).value.toFixed(1)} kg`
                : "—"}
            </span>
          </div>

          <div className="hist-actions">
            <button className="hist-btn" onClick={handleExport}>
              Export CSV
            </button>
            <button className="hist-btn danger" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
