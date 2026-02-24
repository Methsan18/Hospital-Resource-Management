import React, { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';

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
  shadowMd: '0 8px 24px rgba(2,6,23,0.06)',
  shadowLg: '0 12px 32px rgba(2,6,23,0.08)',
};

/* =========================================================
   CHART (SVG)
========================================================= */
const TrendsLineChart = ({ series, xLabels, width = 680, height = 300 }) => {
  const paddingLeft = 56;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 42;

  // Calculate min/max for scaling
  const allY = series.flatMap(s => s.data);
  const maxY = Math.max(...allY);
  const minY = Math.min(...allY, 0); // Ensure 0 is baseline
  const yMax = Math.ceil(maxY * 1.1);
  const yMin = Math.floor(minY);

  const xScale = (i) => paddingLeft + i * (width - paddingLeft - paddingRight) / (xLabels.length - 1);
  const yScale = (v) => paddingTop + (height - paddingTop - paddingBottom) * (1 - (v - yMin) / (yMax - yMin || 1));

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
            <text x={paddingLeft - 12} y={y + 4} fontSize="11" fill={theme.muted} textAnchor="end" fontWeight="500">
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
            <text x={x} y={baseY + 20} fontSize="11" fill={theme.muted} textAnchor="middle" fontWeight="500">
              {xl}
            </text>
          </g>
        );
      })}

      {/* Series Lines + Dots */}
      {series.map((s, idx) => {
        const points = s.data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');
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
            {s.data.map((v, i) => (
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
   ILLNESS TRENDS CARD
========================================================= */
const IllnessTrendsCard = () => {
  const [selectedDisease, setSelectedDisease] = useState('All Diseases');

  // X-Axis Labels (Last 8 Months)
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 1. CHART DATA (Top 5 Diseases)
  const series = useMemo(() => ([
    {
      name: 'Influenza',
      color: '#dc2626', // Red
      data: [160, 155, 225, 165, 150, 175, 210, 320],
    },
    {
      name: 'Dengue Fever',
      color: '#ea580c', // Orange
      data: [110, 112, 138, 122, 108, 133, 150, 210],
    },
    {
      name: 'Asthma',
      color: '#059669', // Green
      data: [82, 86, 92, 84, 78, 93, 110, 130],
    },
    {
      name: 'Viral Fever',
      color: '#2563eb', // Blue
      data: [95, 90, 85, 110, 125, 140, 155, 160],
    },
    {
      name: 'Pneumonia',
      color: '#7c3aed', // Purple
      data: [45, 50, 48, 55, 60, 65, 75, 85],
    },
  ]), []);

  // 2. TABLE DATA (Top 5 Diseases by Growth)
  const tableData = [
    { d: 'Influenza', m: 'Dec 2025', c: 320, mom: '+12%', yoy: '+9%' },
    { d: 'Dengue Fever', m: 'Dec 2025', c: 210, mom: '+18%', yoy: '+6%' },
    { d: 'Viral Fever', m: 'Dec 2025', c: 160, mom: '+10%', yoy: '+5%' },
    { d: 'Asthma', m: 'Dec 2025', c: 130, mom: '+7%', yoy: '+4%' },
    { d: 'Pneumonia', m: 'Dec 2025', c: 85, mom: '+15%', yoy: '+8%' },
  ];

  // List of all diseases for the dropdown
  const allDiseases = ['All Diseases', ...tableData.map(item => item.d)];

  // Filter Logic
  const filteredTableData = selectedDisease === 'All Diseases' 
    ? tableData 
    : tableData.filter(item => item.d === selectedDisease);

  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 16,
      boxShadow: theme.shadowLg,
      overflow: 'hidden',
      fontFamily: 'sans-serif'
    }}>
      {/* Header (No Location Filter) */}
      <div style={{
        background: theme.navy,
        color: '#fff',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Illness Trends Analysis</h2>
          <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: 14 }}>Historical patterns & growth metrics</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        
        {/* CHART SECTION */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: theme.heading, fontSize: 18, fontWeight: 700 }}>Top 5 Diseases (Trends Over Time)</h3>
            
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {series.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: 13, color: theme.muted, fontWeight: 600 }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 12,
            padding: 16
          }}>
            <TrendsLineChart series={series} xLabels={months} />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: theme.heading, fontSize: 18, fontWeight: 700 }}>Top 5 Diseases by Growth Rate</h3>
            
            {/* Disease Filter for Table */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 8,
              padding: '6px 12px',
              background: '#f8fafc'
            }}>
               <Filter size={14} color={theme.muted} style={{ marginRight: 8 }} />
               <select 
                 value={selectedDisease} 
                 onChange={(e) => setSelectedDisease(e.target.value)}
                 style={{
                   border: 'none',
                   background: 'transparent',
                   color: theme.text,
                   fontSize: 14,
                   fontWeight: 600,
                   outline: 'none',
                   cursor: 'pointer'
                 }}
               >
                 {allDiseases.map(d => (
                   <option key={d} value={d}>{d}</option>
                 ))}
               </select>
            </div>
          </div>

          <div style={{
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 12,
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  {['Disease', 'Current Month', 'Cases', 'MoM Change', 'YoY Change'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '14px 16px',
                      color: theme.heading,
                      fontWeight: 700,
                      borderBottom: `1px solid ${theme.cardBorder}`
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTableData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < filteredTableData.length - 1 ? `1px solid ${theme.cardBorder}` : 'none' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: theme.text }}>{row.d}</td>
                    <td style={{ padding: '14px 16px', color: theme.muted }}>{row.m}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: theme.text }}>{row.c}</td>
                    <td style={{ padding: '14px 16px', color: '#16a34a', fontWeight: 700 }}>
                      <span style={{ background: '#dcfce7', padding: '4px 8px', borderRadius: 6 }}>{row.mom}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#16a34a', fontWeight: 700 }}>
                      <span style={{ background: '#f0fdf4', padding: '4px 8px', borderRadius: 6 }}>{row.yoy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

/* =========================================================
   PAGE WRAPPER
========================================================= */
const ETU_HeadIllnessTrendsPage = () => {
  return (
    <div style={{ padding: 28, maxWidth: 1000, margin: '24px auto' }}>
      <IllnessTrendsCard />
    </div>
  );
};

export default ETU_HeadIllnessTrendsPage;