import React, { useMemo, useState } from "react";
import { AlertCircle, Filter } from "lucide-react";
import useFetch from "../../hooks/fetch.hook";

const IllnessAlerts = () => {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [{ apiData, isLoading, serverError }] = useFetch("auth/dashboard");

  // ✅ You can tune these thresholds anytime
  const PRIORITY_RULES = {
    High: 800,       // >= 800 cases
    Moderate: 400,   // >= 400 cases
    Low: 0           // < 400 cases
  };

  // Optional: keep disease-specific descriptions (fallback exists)
  const DESCRIPTION_MAP = {
    Dengue: "Increase in cases projected next month based on current rain patterns.",
    "Respiratory Infections": "Cases rising above average for two weeks consecutively.",
    Asthma: "Spike detected in children (ages 5-12) last week.",
    "Fall-Related Injuries": "Month-to-date cases higher than usual for this time of year.",
    "Viral Fever": "Slight upward trend observed in OPD admissions.",
  };

  // ✅ helper: decide priority from count
  const priorityFromCount = (count) => {
    if (count >= PRIORITY_RULES.High) return "High";
    if (count >= PRIORITY_RULES.Moderate) return "Moderate";
    return "Low";
  };

  // ✅ compute alert rows from REAL forecast totals (year total)
  const alertsData = useMemo(() => {
    const monthlyForecasts = apiData?.dashboard?.monthlyForecasts || {};
    const diseases = Object.keys(monthlyForecasts);

    if (!diseases.length) return [];

    // sum yearly total for each disease
    const rows = diseases.map((diseaseName) => {
      const arr = monthlyForecasts[diseaseName] || [];
      const total = arr.reduce((s, p) => s + (Number(p.value) || 0), 0);

      const priority = priorityFromCount(total);

      const defaultDesc =
        priority === "High"
          ? `Projected cases are very high (${total}). Immediate response recommended.`
          : priority === "Moderate"
          ? `Projected cases are rising (${total}). Monitor and prepare resources.`
          : `Projected cases are low (${total}). Continue routine monitoring.`;

      return {
        alert: diseaseName,
        description: DESCRIPTION_MAP[diseaseName] || defaultDesc,
        priority,
        count: total,
      };
    });

    // ✅ show highest first
    rows.sort((a, b) => {
      const pr = { High: 3, Moderate: 2, Low: 1 };
      if (pr[b.priority] !== pr[a.priority]) return pr[b.priority] - pr[a.priority];
      return b.count - a.count;
    });

    return rows;
  }, [apiData]);

  // ✅ Filter Logic (All / High / Moderate / Low)
  const filteredData =
    priorityFilter === "All"
      ? alertsData
      : alertsData.filter((item) => item.priority === priorityFilter);

  // ✅ styling helpers
  const getPriorityColor = (priority) => {
    if (priority === "High") return "#dc2626";
    if (priority === "Moderate") return "#ea580c";
    return "#10b981";
  };

  const getPriorityBgColor = (priority) => {
    if (priority === "High") return "#fee2e2";
    if (priority === "Moderate") return "#fef3c7";
    return "#f0fdf4";
  };

  if (isLoading) return <div style={{ padding: 28 }}>Loading...</div>;
  if (serverError) return <div style={{ padding: 28 }}>Error loading alerts</div>;

  return (
    <div style={{ padding: 28, maxWidth: 1100, margin: "24px auto", color: "#0f172a", fontFamily: "sans-serif" }}>
      {/* Header with Filter */}
      <div
        style={{
          background: "#0b2a5b",
          color: "#fff",
          padding: "20px 24px",
          borderRadius: 14,
          marginBottom: 28,
          boxShadow: "0 10px 28px rgba(2,6,23,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Illness & Injury Alerts</h1>
          <p style={{ margin: 0, marginTop: 6, opacity: 0.9 }}>Active risk notifications</p>
        </div>

        {/* Priority Filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.1)",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Filter size={16} color="#fff" style={{ marginRight: 8, opacity: 0.9 }} />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
              minWidth: 140,
            }}
          >
            <option value="All" style={{ color: "#000" }}>All Priorities</option>
            <option value="High" style={{ color: "#000" }}>High Only</option>
            <option value="Moderate" style={{ color: "#000" }}>Moderate Only</option>
            <option value="Low" style={{ color: "#000" }}>Low Only</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e6eef6",
          boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e6eef6" }}>
              <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 15, fontWeight: 700, color: "#334155", width: "22%" }}>
                Alert
              </th>
              <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 15, fontWeight: 700, color: "#334155", width: "55%" }}>
                Description
              </th>
              <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 15, fontWeight: 700, color: "#334155", width: "10%" }}>
                Cases
              </th>
              <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 15, fontWeight: 700, color: "#334155", width: "13%" }}>
                Priority
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr
                  key={row.alert}
                  style={{
                    borderBottom: idx < filteredData.length - 1 ? "1px solid #e6eef6" : "none",
                    background: idx % 2 === 0 ? "#fff" : "#f8fafc",
                  }}
                >
                  <td style={{ padding: "16px 20px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    {row.alert}
                  </td>

                  <td style={{ padding: "16px 20px", fontSize: 15, color: "#475569", lineHeight: 1.5 }}>
                    {row.description}
                  </td>

                  <td style={{ padding: "16px 20px", fontSize: 15, fontWeight: 800, color: "#0b2a5b" }}>
                    {row.count}
                  </td>

                  <td style={{ padding: "16px 20px", fontSize: 15, fontWeight: 600 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: getPriorityBgColor(row.priority),
                        color: getPriorityColor(row.priority),
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                  No alerts found for this priority level.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 12,
          display: "flex",
          gap: 12,
        }}
      >
        <AlertCircle size={20} color="#1e40af" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1e40af" }}>Alert Management</p>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, color: "#1e3a8a" }}>
            High priority alerts require immediate attention from the ED Supervisor. Moderate alerts should be reviewed during weekly planning meetings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IllnessAlerts;