import React, { useState, useMemo } from 'react';
import { Filter, Calendar } from 'lucide-react';

/* =========================================================
   THEME
========================================================= */
const theme = {
  navy: '#0b2a5b',
  cardBg: '#fff',
  cardBorder: '#e6eef6',
  text: '#0f172a',
  heading: '#334155',
  muted: '#64748b',
  grid: '#f1f5f9',
  shadowLg: '0 10px 28px rgba(2,6,23,0.08)',
};

/* =========================================================
   MOCK DATA GENERATOR (12 MONTHS)
========================================================= */
const generateYearlyData = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const diseases = ['Influenza', 'Dengue Fever', 'Asthma', 'Viral Fever', 'Pneumonia'];
  
  let data = [];
  let weekCounter = 1;

  months.forEach((month, mIndex) => {
    // Generate 4 weeks per month for simplicity
    for (let w = 1; w <= 4; w++) {
      const weekLabel = `2026-W${String(weekCounter).padStart(2, '0')}`;
      
      diseases.forEach((disease, dIndex) => {
        // Create some seasonality in the mock numbers
        const baseCases = 20 + (dIndex * 10); // different base for each disease
        const seasonalFactor = Math.sin((mIndex + w) * 0.5) * 20; // fluctuation
        const randomVar = Math.floor(Math.random() * 15);
        const cases = Math.abs(Math.floor(baseCases + seasonalFactor + randomVar));
        
        data.push({
          month: month,
          week: weekLabel,
          disease: disease,
          cases: cases,
          ci: `${cases - 5}-${cases + 5}`
        });
      });
      weekCounter++;
    }
  });
  return data;
};

const MASTER_DATA = generateYearlyData();

// Helper: Distinct colors
const getDistinctColor = (index) => {
  const colors = ['#dc2626', '#ea580c', '#059669', '#2563eb', '#7c3aed'];
  return colors[index % colors.length];
};

/* =========================================================
   CHART COMPONENT
========================================================= */
const LineChart = ({ data, xLabels, width = 700, height = 300 }) => {
  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const allValues = data.flatMap(d => d.values);
  const maxVal = Math.max(...allValues, 10);
  
  const xScale = (i) => padding + (i * chartWidth) / (xLabels.length - 1);
  const yScale = (val) => height - padding - (val / maxVal) * chartHeight;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid & Y-Axis */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const val = Math.round(maxVal * t);
        const y = height - padding - (t * chartHeight);
        return (
          <g key={i}>
            <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="#e2e8f0" />
            <text x={padding - 10} y={y + 4} fontSize="11" fill={theme.muted} textAnchor="end">{val}</text>
          </g>
        );
      })}

      {/* X-Axis Labels */}
      {xLabels.map((lbl, i) => (
        <text key={i} x={xScale(i)} y={height - padding + 20} fontSize="12" fill={theme.muted} textAnchor="middle">
          {lbl}
        </text>
      ))}

      {/* Lines */}
      {data.map((series, idx) => {
        const color = getDistinctColor(idx);
        const points = series.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');
        
        return (
          <g key={idx}>
            <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {series.values.map((v, i) => (
              <circle key={i} cx={xScale(i)} cy={yScale(v)} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */
const ETU_HeadIllnessForecast = () => {
  // Default to first month and first week
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedWeek, setSelectedWeek] = useState('2026-W01');

  // 1. FILTER CHART DATA BY MONTH
  const chartData = useMemo(() => {
    const monthRecords = MASTER_DATA.filter(d => d.month === selectedMonth);
    const weeksInMonth = [...new Set(monthRecords.map(d => d.week))].sort();
    const diseases = [...new Set(monthRecords.map(d => d.disease))];

    return {
      xLabels: weeksInMonth,
      series: diseases.map(diseaseName => ({
        name: diseaseName,
        values: weeksInMonth.map(w => {
          const rec = monthRecords.find(r => r.week === w && r.disease === diseaseName);
          return rec ? rec.cases : 0;
        })
      }))
    };
  }, [selectedMonth]);

  // 2. FILTER TABLE DATA BY WEEK
  const tableData = useMemo(() => {
    return MASTER_DATA.filter(d => d.week === selectedWeek);
  }, [selectedWeek]);

  // Dropdown Options
  const availableMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Available weeks should be filtered based on the selected month (Optional UX improvement)
  // For now, let's show all weeks to match your request "filter the week"
  const availableWeeks = [...new Set(MASTER_DATA.map(d => d.week))].sort();

  return (
    <div style={{ padding: 28, maxWidth: 1000, margin: '24px auto', color: theme.text, fontFamily: 'sans-serif' }}>
        
        {/* Header */}
        <div style={{
          background: theme.navy,
          color: '#fff',
          padding: 24,
          borderRadius: 16,
          marginBottom: 32,
          boxShadow: theme.shadowLg
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Illness Forecast</h1>
          <p style={{ margin: '6px 0 0 0', opacity: 0.9 }}>12-Month Prediction Model with Weekly Granularity</p>
        </div>

        {/* CHART SECTION (12 Month Filter) */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Forecast Trends (Week-wise)</h2>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: '#fff', 
              border: `1px solid ${theme.cardBorder}`, 
              borderRadius: 8, 
              padding: '8px 12px' 
            }}>
              <Calendar size={16} color={theme.muted} style={{ marginRight: 8 }} />
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: theme.text, cursor: 'pointer' }}
              >
                {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: `1px solid ${theme.cardBorder}`,
            padding: 20,
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}>
            {/* Dynamic Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {chartData.series.map((s, i) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: getDistinctColor(i) }}></span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: theme.muted }}>{s.name}</span>
                </div>
              ))}
            </div>
            
            <LineChart data={chartData.series} xLabels={chartData.xLabels} />
          </div>
        </div>

        {/* TABLE SECTION (All Weeks Filter) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Weekly Prediction Data</h2>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: '#fff', 
              border: `1px solid ${theme.cardBorder}`, 
              borderRadius: 8, 
              padding: '8px 12px' 
            }}>
              <Filter size={16} color={theme.muted} style={{ marginRight: 8 }} />
              <select 
                value={selectedWeek} 
                onChange={(e) => setSelectedWeek(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: theme.text, cursor: 'pointer' }}
              >
                {availableWeeks.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: `1px solid ${theme.cardBorder}`,
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: theme.heading }}>Disease</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: theme.heading }}>Week</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: theme.heading }}>Forecast Cases</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: theme.heading }}>Confidence Interval</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{row.disease}</td>
                      <td style={{ padding: '16px', color: theme.muted }}>{row.week}</td>
                      <td style={{ padding: '16px', fontWeight: 700, color: theme.navy }}>{row.cases}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 4, fontSize: 13, color: theme.muted }}>
                          {row.ci}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: 20, textAlign: 'center', color: theme.muted }}>
                      No data available for this week.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
  </div>
  );
};

export default ETU_HeadIllnessForecast;