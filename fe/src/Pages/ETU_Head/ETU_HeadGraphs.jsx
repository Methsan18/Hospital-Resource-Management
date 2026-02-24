import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { AlertTriangle, Activity, Pill, BedDouble } from "lucide-react";
import styles from "./ETU_HeadGraphs.module.css";

/* ---------------- DATA ---------------- */
const accidentSurgeData = [
  { time: "08:00", Cases: 6 },
  { time: "10:00", Cases: 9 },
  { time: "12:00", Cases: 14 },
  { time: "14:00", Cases: 11 },
  { time: "16:00", Cases: 8 },
  { time: "18:00", Cases: 13 },
  { time: "20:00", Cases: 7 },
];

const bedOccupancyData = [
  { day: "Mon", Occupied: 268, Capacity: 320 },
  { day: "Tue", Occupied: 275, Capacity: 320 },
  { day: "Wed", Occupied: 289, Capacity: 320 },
  { day: "Thu", Occupied: 300, Capacity: 320 },
  { day: "Fri", Occupied: 309, Capacity: 320 },
  { day: "Sat", Occupied: 315, Capacity: 320 },
  { day: "Sun", Occupied: 306, Capacity: 320 },
];

// 30-day medicine forecast (example: Paracetamol)
const medicineForecast30 = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  Demand: 120 + i * 2,
}));

// Detailed per-medicine forecast data (used by the selector)
const forecastData = {
  Paracetamol: Array.from({ length: 30 }, (_, i) => {
    const demand = 120 + i * 2;
    const variance = 0.06 + (i % 4) * 0.015; // 6%..10% varying pattern
    const lower = Math.round(demand * (1 - variance));
    const upper = Math.round(demand * (1 + variance));
    return { day: `Day ${i + 1}`, demand, lower, upper };
  }),
  Amoxicillin: Array.from({ length: 30 }, (_, i) => {
    const demand = Math.round(80 + i * 1.5);
    const variance = 0.08 + (i % 5) * 0.01; // slightly larger variance
    const lower = Math.round(demand * (1 - variance));
    const upper = Math.round(demand * (1 + variance));
    return { day: `Day ${i + 1}`, demand, lower, upper };
  }),
  Insulin: Array.from({ length: 30 }, (_, i) => {
    const demand = 40 + i;
    const variance = 0.04 + (i % 3) * 0.01; // smaller variance
    const lower = Math.round(Math.max(0, demand * (1 - variance)));
    const upper = Math.round(demand * (1 + variance));
    return { day: `Day ${i + 1}`, demand, lower, upper };
  }),
  Saline: Array.from({ length: 30 }, (_, i) => {
    const demand = 150 + i * 3;
    const variance = 0.07 + (i % 6) * 0.02; // moderate variance
    const lower = Math.round(demand * (1 - variance));
    const upper = Math.round(demand * (1 + variance));
    return { day: `Day ${i + 1}`, demand, lower, upper };
  }),
};

const aiSuggestions = {
  Paracetamol: "Stock-out predicted in 7 days. Increase buffer stock by 20%.",
  Amoxicillin: "Seasonal infection trend detected. Consider early replenishment.",
  Insulin: "Stable demand observed. Maintain current stock levels.",
  Saline: "Possible accident surge impact. Emergency reserve recommended.",
};

const GRAPH_OPTIONS = [
  { value: "beds", label: "Bed Occupancy Trend", icon: <BedDouble size={18} /> },
  { value: "accident", label: "Accident Surge Detection", icon: <Activity size={18} /> },
  { value: "medicine", label: "Medicine Forecast Demand", icon: <Pill size={18} /> },
];

const ETU_HeadGraphs = () => {
  const [selectedGraph, setSelectedGraph] = useState("beds");
  const [selectedMedicine, setSelectedMedicine] = useState("Paracetamol");

  const current = useMemo(() => {
    /* ---------------- BEDS ---------------- */
    if (selectedGraph === "beds") {
      const maxOcc = Math.max(...bedOccupancyData.map((d) => d.Occupied));
      const nearFull = maxOcc >= 310;

      return {
        title: "Bed Occupancy Trend",
        subtitle: "Occupied beds vs safe capacity",
        icon: <BedDouble size={20} />,
        insight: nearFull
          ? "Occupancy is near full capacity. Consider early discharges & overflow allocation."
          : "Occupancy is within manageable range. Continue standard operations.",
        chart: (
          <LineChart data={bedOccupancyData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} dy={10} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(2,6,23,0.10)" }} />
            <Legend verticalAlign="top" align="right" />
            <ReferenceLine y={320} stroke="#0ea5e9" strokeDasharray="6 6" label={{ value: "Capacity", fill: "#075985", fontSize: 12 }} />
            <Line type="monotone" dataKey="Occupied" stroke="#7c3aed" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7 }} name="Occupied Beds" />
            <Line type="monotone" dataKey="Capacity" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" dot={false} name="Safe Capacity" />
          </LineChart>
        ),
      };
    }

    /* ---------------- ACCIDENT ---------------- */
    if (selectedGraph === "accident") {
      const maxCases = Math.max(...accidentSurgeData.map((d) => d.Cases));
      const isSurge = maxCases > 10;

      return {
        title: "Accident Surge Detection",
        subtitle: "Hourly accident admissions & surge threshold",
        icon: <Activity size={20} />,
        insight: isSurge
          ? "Surge risk detected today. Keep emergency beds & staff ready."
          : "No significant surge detected. Monitor traffic/weather updates.",
        chart: (
          <LineChart data={accidentSurgeData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(2,6,23,0.10)" }} />
            <Legend verticalAlign="top" align="right" />
            <ReferenceLine y={10} stroke="#f97316" strokeDasharray="6 6" label={{ value: "Surge Threshold", fill: "#9a3412", fontSize: 12 }} />
            <Line type="monotone" dataKey="Cases" stroke="#ef4444" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7 }} name="Accident Cases" />
          </LineChart>
        ),
      };
    }

    /* ---------------- MEDICINE FORECAST (NOW SAME STYLE AS OTHERS) ---------------- */
    // selectedGraph === "medicine"
    const maxDemand = Math.max(...forecastData[selectedMedicine].map((d) => d.demand));
    const risk = maxDemand >= 160;

    return {
      title: "Medicine Forecast Demand",
      subtitle: "30-day demand forecast (sample: Paracetamol)",
      icon: <Pill size={20} />,
      insight: risk
        ? "Rising demand predicted. Plan buffer stock and supplier lead time."
        : "Demand is stable. Maintain current reorder strategy.",
      chart: (
        <div>
          {/* Medicine selector (updates the smaller forecast chart below) */}
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontWeight: 600 }}>Select Medicine:</label>
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              {Object.keys(forecastData).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <LineChart data={forecastData[selectedMedicine]} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#0f172a", fontSize: 12 }}
              dy={10}
              interval={4} // show every 5th tick (Day 1, 6, 11, ...)
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(2,6,23,0.10)" }} />
            <Legend verticalAlign="top" align="right" />
            <ReferenceLine y={160} stroke="#16a34a" strokeDasharray="6 6" label={{ value: "Target Buffer", fill: "#14532d", fontSize: 12 }} />
            <Line type="monotone" dataKey="demand" stroke="#2563eb" strokeWidth={4} dot={false} name="Forecast Demand" />
          </LineChart>

          {/* Additional Forecast graph (selectable medicine) */}
          <div style={{ marginTop: 18 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData[selectedMedicine]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" hide />
                <YAxis />
                <Tooltip />

                {/* Upper bound (dashed) */}
                <Line type="monotone" dataKey="upper" stroke="#93C5FD" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Upper" />

                {/* Actual demand */}
                <Line type="monotone" dataKey="demand" stroke="#2563EB" strokeWidth={3} dot={false} name="Demand" />

                {/* Lower bound (dashed) */}
                <Line type="monotone" dataKey="lower" stroke="#BFDBFE" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Lower" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Recommendation for selected medicine */}
          <div style={{ marginTop: 12, background: '#EFF6FF', borderLeft: '4px solid #1E40AF', padding: 10, borderRadius: 6 }}>
            <h3 style={{ margin: 0, fontWeight: 600, color: '#075985' }}>AI Recommendation</h3>
            <p style={{ margin: '6px 0 0', color: '#0f172a' }}>{aiSuggestions[selectedMedicine]}</p>
          </div>
        </div>
      ),
    };
  }, [selectedGraph, selectedMedicine]);

  return (
    <div className={styles.page}>
      {/* Header strip (no dropdown now) */}
      <div className={styles.topBanner}>
        <div className={styles.bannerLeft}>
          <h1 className={styles.pageTitle}>ETU Graphs & Trends</h1>
          <p className={styles.pageSubtitle}>
            Monitor bed capacity, accident surge risk, and medicine demand forecasts
          </p>
        </div>
      </div>

      {/* ✅ Buttons moved BEFORE the graphs */}
      <div className={styles.tiles}>
        {GRAPH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedGraph(opt.value)}
            className={`${styles.tile} ${selectedGraph === opt.value ? styles.tileActive : ""}`}
          >
            <span className={styles.tileIcon}>{opt.icon}</span>
            <span className={styles.tileText}>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Main card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>{current.title}</h2>
            <p className={styles.cardSubtitle}>{current.subtitle}</p>
          </div>

          <div className={styles.chip}>
            <span className={styles.chipDot}></span>
            Live Preview (Sample Data)
          </div>
        </div>

        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            {current.chart}
          </ResponsiveContainer>
        </div>

        <div className={styles.insightBox}>
          <AlertTriangle size={18} className={styles.alertIcon} />
          <p>
            <strong>Recommendation:</strong> {current.insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ETU_HeadGraphs;
