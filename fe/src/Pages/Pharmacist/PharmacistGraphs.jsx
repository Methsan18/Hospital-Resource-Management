import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import styles from "./GraphStyle.module.css";

const PharmacistGraphs = () => {
  const [timeframe, setTimeframe] = useState("Next 7 Days");
  const [forecastData, setForecastData] = useState([]);
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    let forecast = [];
    let usage = [];

    // ---- NEXT 7 DAYS ----
    if (timeframe === "Next 7 Days") {
      forecast = [
        { day: "Mon", Demand: 120, Stock: 180, ReorderLevel: 100 },
        { day: "Tue", Demand: 150, Stock: 160, ReorderLevel: 100 },
        { day: "Wed", Demand: 190, Stock: 140, ReorderLevel: 100 },
        { day: "Thu", Demand: 210, Stock: 120, ReorderLevel: 100 },
        { day: "Fri", Demand: 240, Stock: 95, ReorderLevel: 100 }, // critical
        { day: "Sat", Demand: 170, Stock: 90, ReorderLevel: 100 },
        { day: "Sun", Demand: 140, Stock: 85, ReorderLevel: 100 },
      ];

      usage = [
        { name: "Paracetamol", Used: 320 },
        { name: "Amoxicillin", Used: 180 },
        { name: "Ibuprofen", Used: 140 },
        { name: "Cough Syrup", Used: 95 },
        { name: "ORS", Used: 160 },
        { name: "Vitamin C", Used: 110 },
      ];
    }

    // ---- NEXT 30 DAYS ----
    else if (timeframe === "Next 30 Days") {
      forecast = [
        { day: "W1", Demand: 860, Stock: 1200, ReorderLevel: 800 },
        { day: "W2", Demand: 910, Stock: 1100, ReorderLevel: 800 },
        { day: "W3", Demand: 1050, Stock: 980, ReorderLevel: 800 },
        { day: "W4", Demand: 1180, Stock: 820, ReorderLevel: 800 }, // near reorder
      ];

      usage = [
        { name: "Paracetamol", Used: 1220 },
        { name: "Amoxicillin", Used: 760 },
        { name: "Ibuprofen", Used: 540 },
        { name: "Cough Syrup", Used: 410 },
        { name: "ORS", Used: 680 },
        { name: "Vitamin C", Used: 520 },
      ];
    }

    // ---- NEXT 3 MONTHS ----
    else {
      forecast = [
        { day: "Jan", Demand: 3600, Stock: 4200, ReorderLevel: 3000 },
        { day: "Feb", Demand: 3150, Stock: 3900, ReorderLevel: 3000 },
        { day: "Mar", Demand: 4400, Stock: 3600, ReorderLevel: 3000 }, // seasonal spike
      ];

      usage = [
        { name: "Paracetamol", Used: 4200 },
        { name: "Amoxicillin", Used: 2500 },
        { name: "Ibuprofen", Used: 1800 },
        { name: "Cough Syrup", Used: 1200 },
        { name: "ORS", Used: 2100 },
        { name: "Vitamin C", Used: 1600 },
      ];
    }

    setForecastData(forecast);
    setUsageData(usage);
  }, [timeframe]);

  const insight = useMemo(() => {
    // pick the "worst" point where stock < reorder OR demand > stock
    const criticalPoint = forecastData.find(
      (d) => d.Stock < d.ReorderLevel || d.Demand > d.Stock
    );

    if (!forecastData.length) return "No forecast loaded.";
    if (!criticalPoint) return "Stock looks healthy for this period.";

    return timeframe === "Next 7 Days"
      ? "Risk detected this week: Stock drops below reorder level. Prepare a reorder request."
      : timeframe === "Next 30 Days"
      ? "Risk detected this month: Demand rising steadily. Verify suppliers and buffer stock."
      : "Seasonal spike predicted: March demand exceeds expected stock. Plan early procurement.";
  }, [forecastData, timeframe]);

  return (
    <div className={styles.container}>
        {/* --- HEADER --- */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Medicine Analytics</h1>
            <p className={styles.subTitle}>
              Forecast demand and track daily medicine usage for better inventory planning
            </p>
          </div>

          <div className={styles.controls}>
            <label className={styles.label} htmlFor="time-range">
              Time Range:
            </label>
            <select
              id="time-range"
              className={styles.select}
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option>Next 7 Days</option>
              <option>Next 30 Days</option>
              <option>Next 3 Months</option>
            </select>
          </div>
        </div>

        {/* --- FORECAST CHART --- */}
        <section className={styles.card}>
          <div className={styles.centerTitle}>
            <div>
              <h3 className={styles.cardTitle}>Forecasted Medicine Demand</h3>
              <span className={styles.cardHint}>
                {timeframe === "Next 7 Days"
                  ? "(Daily)"
                  : timeframe === "Next 30 Days"
                  ? "(Weekly)"
                  : "(Monthly)"}
              </span>
            </div>
          </div>

          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eef6" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12 }}
                  dy={10}
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
                  }}
                />
                <Legend verticalAlign="top" align="right" />

                <Line
                  type="monotone"
                  dataKey="Demand"
                  stroke="#2563eb"
                  strokeWidth={4}
                  dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 7 }}
                  name="Forecast Demand"
                />

                <Line
                  type="monotone"
                  dataKey="Stock"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={false}
                  name="Projected Stock"
                />

                <Line
                  type="monotone"
                  dataKey="ReorderLevel"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Reorder Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* --- USAGE CHART --- */}
        <section className={styles.card}>
          <div className={styles.centerTitle}>
            <div>
              <h3 className={styles.cardTitle}>Daily Medicine Usage</h3>
              <span className={styles.cardHint}>
                {timeframe === "Next 7 Days"
                  ? "(Most used medicines this week)"
                  : timeframe === "Next 30 Days"
                  ? "(Most used medicines this month)"
                  : "(Most used medicines this quarter)"}
              </span>
            </div>
          </div>

          <div className={styles.chartWrapSmall}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eef6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12 }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                  height={70}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
                  }}
                />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="Used" name="Units Used" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* --- INSIGHT BOX --- */}
          <div className={styles.insightBox}>
            <AlertTriangle size={18} className={styles.alertIcon} />
            <p>
              <strong>Inventory Recommendation:</strong> {insight}
            </p>
          </div>
        </section>
      </div>
  );
};

export default PharmacistGraphs;
