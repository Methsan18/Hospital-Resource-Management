import React, { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import useFetch from "../../hooks/fetch.hook";

/* =========================================================
   THEME
========================================================= */
const theme = {
  navy: "#0b2a5b",
  cardBg: "#fff",
  cardBorder: "#e6eef6",
  text: "#0f172a",
  heading: "#334155",
  muted: "#64748b",
  grid: "#f1f5f9",
  shadowMd: "0 8px 24px rgba(2,6,23,0.06)",
  shadowLg: "0 12px 32px rgba(2,6,23,0.08)",
};

/* =========================================================
   CHART (SVG)
========================================================= */
const TrendsLineChart = ({ series, xLabels, width = 680, height = 300 }) => {
  const paddingLeft = 56;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 42;

  // guard
  if (!series?.length || !xLabels?.length || xLabels.length < 2) {
    return <div style={{ padding: 12, color: theme.muted }}>Not enough data</div>;
  }

  // Calculate min/max for scaling
  const allY = series.flatMap((s) => s.data || []);
  const maxY = Math.max(...allY, 0);
  const minY = Math.min(...allY, 0);
  const yMax = Math.ceil(maxY * 1.1);
  const yMin = Math.floor(minY);

  const xScale = (i) =>
    paddingLeft + (i * (width - paddingLeft - paddingRight)) / (xLabels.length - 1);

  const yScale = (v) =>
    paddingTop +
    (height - paddingTop - paddingBottom) * (1 - (v - yMin) / (yMax - yMin || 1));

  const yTicks = 6;
  const yValues = Array.from({ length: yTicks }, (_, k) =>
    Math.round(yMin + (k * (yMax - yMin)) / (yTicks - 1))
  );

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      {/* Chart Area Border */}
      <rect
        x={paddingLeft}
        y={paddingTop}
        width={width - paddingLeft - paddingRight}
        height={height - paddingTop - paddingBottom}
        fill="none"
        stroke={theme.cardBorder}
        rx="8"
      />

      {/* Horizontal Grid + Y Labels */}
      {yValues.map((yv, i) => {
        const y = yScale(yv);
        return (
          <g key={`y-${i}`}>
            <line x1={paddingLeft} x2={width - paddingRight} y1={y} y2={y} stroke={theme.grid} />
            <text
              x={paddingLeft - 12}
              y={y + 4}
              fontSize="11"
              fill={theme.muted}
              textAnchor="end"
              fontWeight="500"
            >
              {yv}
            </text>
          </g>
        );
      })}

      {/* X Ticks + Labels */}
      {xLabels.map((xl, i) => {
        const x = xScale(i);
        const baseY = height - paddingBottom;
        return (
          <g key={`x-${xl}-${i}`}>
            <line x1={x} x2={x} y1={baseY} y2={baseY + 6} stroke="#cbd5e1" />
            <text
              x={x}
              y={baseY + 20}
              fontSize="11"
              fill={theme.muted}
              textAnchor="middle"
              fontWeight="500"
            >
              {xl}
            </text>
          </g>
        );
      })}

      {/* Series Lines + Dots */}
      {series.map((s, idx) => {
        const points = (s.data || []).map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
        return (
          <g key={`series-${idx}`}>
            <polyline
              points={points}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {(s.data || []).map((v, i) => (
              <circle
                key={`dot-${idx}-${i}`}
                cx={xScale(i)}
                cy={yScale(v)}
                r="3.5"
                fill="#fff"
                stroke={s.color}
                strokeWidth="2"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/* =========================================================
   HELPERS (API -> chart/table)
========================================================= */
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const palette = ["#dc2626","#ea580c","#059669","#2563eb","#7c3aed","#0ea5e9","#f59e0b","#16a34a"];

function periodToLabel(period) {
  // "2025-12" => "Dec"
  if (!period || period.length < 7) return period;
  const mm = parseInt(period.slice(5, 7), 10);
  return MONTH_ABBR[(mm || 1) - 1] || period;
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function buildDiseaseMonthlyMap(apiData) {
  // expected: apiData.dashboard.monthlyForecasts = { DiseaseName: [{period:"YYYY-MM", value: number}, ...], ... }
  const monthlyForecasts = apiData?.dashboard?.monthlyForecasts || {};
  const diseases = Object.keys(monthlyForecasts);

  const map = {};
  diseases.forEach((d) => {
    const arr = monthlyForecasts[d] || [];
    // sort by period
    const sorted = [...arr].filter(x => x?.period).sort((a, b) => (a.period > b.period ? 1 : -1));
    map[d] = sorted.map((p) => ({ period: p.period, value: toNumber(p.value) }));
  });

  return map; // {disease: [{period,value}...]}
}

function getLastNPeriods(allPeriodsSorted, n = 8) {
  if (!allPeriodsSorted?.length) return [];
  return allPeriodsSorted.slice(Math.max(0, allPeriodsSorted.length - n));
}

function computeTop5ByLatestValue(diseaseMap, periodsWindow) {
  const lastPeriod = periodsWindow[periodsWindow.length - 1];
  const ranked = Object.keys(diseaseMap).map((d) => {
    const hit = (diseaseMap[d] || []).find((x) => x.period === lastPeriod);
    return { d, latest: toNumber(hit?.value) };
  });
  ranked.sort((a, b) => b.latest - a.latest);
  return ranked.slice(0, 5).map(x => x.d);
}

function computeSeriesForDiseases(diseaseMap, diseases, periodsWindow) {
  return diseases.map((d, idx) => {
    const points = periodsWindow.map((p) => {
      const hit = (diseaseMap[d] || []).find((x) => x.period === p);
      return toNumber(hit?.value);
    });
    return { name: d, color: palette[idx % palette.length], data: points };
  });
}

function computeGrowthTable(diseaseMap, diseases, periodsWindow) {
  // We use the last period in window as "current month"
  const lastIdx = periodsWindow.length - 1;
  const currentPeriod = periodsWindow[lastIdx];
  const prevPeriod = periodsWindow[lastIdx - 1];

  // YoY: same month last year => period "YYYY-??" - 12 months (if exists)
  const yoyPeriod = (() => {
    if (!currentPeriod || currentPeriod.length < 7) return null;
    const year = parseInt(currentPeriod.slice(0, 4), 10);
    const mm = currentPeriod.slice(5, 7);
    if (!Number.isFinite(year)) return null;
    return `${year - 1}-${mm}`;
  })();

  const rows = diseases.map((d) => {
    const cur = toNumber((diseaseMap[d] || []).find(x => x.period === currentPeriod)?.value);
    const prev = toNumber((diseaseMap[d] || []).find(x => x.period === prevPeriod)?.value);
    const yoy = toNumber((diseaseMap[d] || []).find(x => x.period === yoyPeriod)?.value);

    const momPct = prev > 0 ? ((cur - prev) / prev) * 100 : (cur > 0 ? 100 : 0);
    const yoyPct = yoy > 0 ? ((cur - yoy) / yoy) * 100 : (cur > 0 ? 100 : 0);

    const fmtPct = (x) => {
      const sign = x >= 0 ? "+" : "";
      return `${sign}${Math.round(x)}%`;
    };

    return {
      d,
      m: `${periodToLabel(currentPeriod)} ${currentPeriod?.slice(0, 4) || ""}`.trim(),
      c: cur,
      mom: fmtPct(momPct),
      yoy: fmtPct(yoyPct),
      _momAbs: momPct,
    };
  });

  // Sort by MoM change desc (growth rate)
  rows.sort((a, b) => b._momAbs - a._momAbs);
  return rows.slice(0, 5);
}

/* =========================================================
   MAIN CARD
========================================================= */
const IllnessTrendsCard = () => {
  const [selectedDisease, setSelectedDisease] = useState("All Diseases");
  const [{ apiData, isLoading, serverError }] = useFetch("auth/dashboard");

  const computed = useMemo(() => {
    // ---------- FALLBACK (if API missing) ----------
    const fallbackMonths = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fallbackSeries = [
      { name: "Influenza", color: "#dc2626", data: [160, 155, 225, 165, 150, 175, 210, 320] },
      { name: "Dengue Fever", color: "#ea580c", data: [110, 112, 138, 122, 108, 133, 150, 210] },
      { name: "Asthma", color: "#059669", data: [82, 86, 92, 84, 78, 93, 110, 130] },
      { name: "Viral Fever", color: "#2563eb", data: [95, 90, 85, 110, 125, 140, 155, 160] },
      { name: "Pneumonia", color: "#7c3aed", data: [45, 50, 48, 55, 60, 65, 75, 85] },
    ];
    const fallbackTable = [
      { d: "Influenza", m: "Dec 2025", c: 320, mom: "+12%", yoy: "+9%" },
      { d: "Dengue Fever", m: "Dec 2025", c: 210, mom: "+18%", yoy: "+6%" },
      { d: "Viral Fever", m: "Dec 2025", c: 160, mom: "+10%", yoy: "+5%" },
      { d: "Asthma", m: "Dec 2025", c: 130, mom: "+7%", yoy: "+4%" },
      { d: "Pneumonia", m: "Dec 2025", c: 85, mom: "+15%", yoy: "+8%" },
    ];

    // If API not available, keep fallback behavior (still filterable)
    if (!apiData?.dashboard?.monthlyForecasts) {
      const all = ["All Diseases", ...fallbackTable.map((x) => x.d)];
      const chartSeries =
        selectedDisease === "All Diseases"
          ? fallbackSeries
          : fallbackSeries.filter((s) => s.name === selectedDisease);

      const tableRows =
        selectedDisease === "All Diseases"
          ? fallbackTable
          : fallbackTable.filter((r) => r.d === selectedDisease);

      return { months: fallbackMonths, series: chartSeries, tableRows, allDiseases: all };
    }

    // ---------- API MODE ----------
    const diseaseMap = buildDiseaseMonthlyMap(apiData);
    const allDiseases = Object.keys(diseaseMap);

    // Collect all periods
    const allPeriods = Array.from(
      new Set(allDiseases.flatMap((d) => (diseaseMap[d] || []).map((x) => x.period)))
    ).sort();

    // last 8 periods window
    const periodsWindow = getLastNPeriods(allPeriods, 8);
    const months = periodsWindow.map(periodToLabel);

    // Top 5 by latest value (for chart default)
    const top5Diseases = computeTop5ByLatestValue(diseaseMap, periodsWindow);

    // dropdown list should include all diseases (not only top5)
    const dropdownOptions = ["All Diseases", ...allDiseases.sort()];

    // Chart diseases:
    const chartDiseases =
      selectedDisease === "All Diseases" ? top5Diseases : [selectedDisease];

    const series = computeSeriesForDiseases(diseaseMap, chartDiseases, periodsWindow);

    // Table: top 5 by growth (MoM) – based on:
    // - if All Diseases => compute for ALL diseases then take top 5
    // - if specific disease => compute only that one (1 row)
    const tableBaseDiseases =
      selectedDisease === "All Diseases" ? allDiseases : [selectedDisease];

    const tableRows = computeGrowthTable(diseaseMap, tableBaseDiseases, periodsWindow);

    return { months, series, tableRows, allDiseases: dropdownOptions };
  }, [apiData, selectedDisease]);

  if (isLoading) return <div style={{ padding: 20, color: theme.muted }}>Loading...</div>;
  if (serverError) return <div style={{ padding: 20, color: theme.muted }}>Error loading trends</div>;

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 16,
        boxShadow: theme.shadowLg,
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: theme.navy,
          color: "#fff",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Illness Trends Analysis</h2>
          <p style={{ margin: "4px 0 0 0", opacity: 0.8, fontSize: 14 }}>
            Historical patterns & growth metrics
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {/* CHART SECTION */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0, color: theme.heading, fontSize: 18, fontWeight: 700 }}>
              Top 5 Diseases (Trends Over Time)
              {selectedDisease !== "All Diseases" ? ` • ${selectedDisease}` : ""}
            </h3>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {computed.series.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: 13, color: theme.muted, fontWeight: 600 }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <TrendsLineChart series={computed.series} xLabels={computed.months} />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0, color: theme.heading, fontSize: 18, fontWeight: 700 }}>
              Top 5 Diseases by Growth Rate
              {selectedDisease !== "All Diseases" ? ` • ${selectedDisease}` : ""}
            </h3>

            {/* Disease Filter (controls BOTH chart + table) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: 8,
                padding: "6px 12px",
                background: "#f8fafc",
              }}
            >
              <Filter size={14} color={theme.muted} style={{ marginRight: 8 }} />
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {computed.allDiseases.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ border: `1px solid ${theme.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  {["Disease", "Current Month", "Cases", "MoM Change", "YoY Change"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        color: theme.heading,
                        fontWeight: 700,
                        borderBottom: `1px solid ${theme.cardBorder}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {computed.tableRows.map((row, i) => (
                  <tr
                    key={`${row.d}-${i}`}
                    style={{
                      borderBottom: i < computed.tableRows.length - 1 ? `1px solid ${theme.cardBorder}` : "none",
                    }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: theme.text }}>{row.d}</td>
                    <td style={{ padding: "14px 16px", color: theme.muted }}>{row.m}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: theme.text }}>{row.c}</td>

                    <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                      <span
                        style={{
                          background: "#dcfce7",
                          padding: "4px 8px",
                          borderRadius: 6,
                          color: "#16a34a",
                        }}
                      >
                        {row.mom}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                      <span
                        style={{
                          background: "#f0fdf4",
                          padding: "4px 8px",
                          borderRadius: 6,
                          color: "#16a34a",
                        }}
                      >
                        {row.yoy}
                      </span>
                    </td>
                  </tr>
                ))}

                {!computed.tableRows.length && (
                  <tr>
                    <td colSpan={5} style={{ padding: 16, color: theme.muted }}>
                      No rows to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 10, fontSize: 12, color: theme.muted }}>
            * Growth rates are calculated from your monthly series: MoM = vs previous month, YoY = vs same month last year (if available).
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PAGE WRAPPER
========================================================= */
const IllnessTrendsPage = () => {
  return (
    <div style={{ padding: 28, maxWidth: 1000, margin: "24px auto" }}>
      <IllnessTrendsCard />
    </div>
  );
};

export default IllnessTrendsPage;