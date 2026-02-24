import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import styles from './ETU_BedTrend.module.css';

const ETU_BedTrend = () => {
  const [timeframe, setTimeframe] = useState('Next Shift');
  const [chartData, setChartData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    let data = [];
    let heat = [];

    // --- LOGIC 1: NEXT SHIFT (Granularity: Shift-by-Shift) ---
    // Shows Day Shift vs Night Shift History & Future
    if (timeframe === 'Next Shift') {
      data = [
        { name: 'Jan 05 (Night)', Total: 60, Capacity: 50 }, // Over capacity
        { name: 'Jan 06 (Day)', Total: 51, Capacity: 50 },
        { name: 'Jan 06 (Night)', Total: 81, Capacity: 50 }, // The "Next Shift" (Critical)
        { name: 'Jan 07 (Day)', Total: 43, Capacity: 50 },
      ];
      heat = [
        { label: 'Jan 05 (Night)', risk: 'High' },
        { label: 'Jan 06 (Day)', risk: 'Medium' },
        { label: 'Jan 06 (Night)', risk: 'Critical' },
        { label: 'Jan 07 (Day)', risk: 'Low' },
      ];
    } 
    
    // --- LOGIC 2: NEXT DAY (Granularity: Daily Totals) ---
    // Shows Whole Day Counts (Day + Night combined)
    else if (timeframe === 'Next Day') {
      data = [
        { name: 'Jan 04', Total: 103, Capacity: 100 },
        { name: 'Jan 03', Total: 93, Capacity: 100 },
        { name: 'Jan 02', Total: 132, Capacity: 100 }, // High predicted load
        { name: 'Jan 01', Total: 85, Capacity: 100 },
      ];
      heat = [
        { label: 'Jan 04', risk: 'Medium' },
        { label: 'Jan 03', risk: 'Low' },
        { label: 'Jan 02', risk: 'Critical' },
        { label: 'Jan 01', risk: 'Low' },
      ];
    } 
    
    // --- LOGIC 3: NEXT MONTH (Granularity: Monthly Totals) ---
    // Shows Month-by-Month Counts
    else {
      data = [
        { name: 'Jan', Total: 3050, Capacity: 3000 },
        { name: 'Feb', Total: 2670, Capacity: 2800 },
        { name: 'Mar', Total: 3850, Capacity: 3100 }, // Seasonal Spike
        { name: 'Apr', Total: 2890, Capacity: 3000 },
      ];
      heat = [
        { label: 'Jan', risk: 'Medium' },
        { label: 'Feb', risk: 'Low' },
        { label: 'Mar', risk: 'Critical' },
        { label: 'Apr', risk: 'Medium' },
      ];
    }

    setChartData(data);
    setHeatmapData(heat);
  }, [timeframe]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Critical': return '#ef4444'; 
      case 'High': return '#f97316';     
      case 'Medium': return '#eab308';   
      default: return '#22c55e';         
    }
  };

  return (
    <div className={styles.container}>

      {/* --- HEADER --- */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Predicted ETU Patterns</h1>
          <p style={{color: '#64748b', margin: '4px 0 0 0', fontSize: '14px'}}>
            Analyze future risk intensity for roster planning
          </p>
        </div>

        <div className={styles.controls}>
          <label className={styles.label} htmlFor="time-range">Time Range:</label>
          <select 
            id="time-range" 
            className={styles.select} 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>Next Shift</option>
            <option>Next Day</option>
            <option>Next Month</option>
          </select>
        </div>
      </div>

      {/* --- CHART SECTION --- */}
      <section className={styles.card}>
          <div className={styles.centerTitle}>
            <h3 style={{fontSize:16, fontWeight:600, color:'#334155', margin:0}}>
               Total Patient Volume Trend
            </h3>
            <span style={{fontSize:12, color:'#94a3b8'}}>
              {timeframe === 'Next Shift' ? '(Shift-by-Shift Breakdown)' : 
               timeframe === 'Next Day' ? '(Daily Total Breakdown)' : 
               '(Monthly Breakdown)'}
            </span>
          </div>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eef6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 12 }} 
                  dy={10} 
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }} />
                <Legend verticalAlign="top" align="right" />
                
                {/* Single Line for Total Load */}
                <Line 
                  type="monotone" 
                  dataKey="Total" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 7 }}
                  name="Total Patient Load" 
                />
                
                {/* Reference Line for Capacity */}
                <Line 
                  type="monotone" 
                  dataKey="Capacity" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  name="Safe Capacity Limit" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        

        {/* --- HEATMAP SECTION --- */}
        <section className={styles.card}>
          <div className={styles.heatmapHeader}>
            <h4 style={{fontSize:15, fontWeight:600, color:'#334155', margin:0}}>Risk Intensity Heatmap</h4>
            <div className={styles.legend}>
              <span className={styles.legendItem}><span className={styles.dot} style={{background: '#ef4444'}}></span> Critical</span>
              <span className={styles.legendItem}><span className={styles.dot} style={{background: '#f97316'}}></span> High</span>
              <span className={styles.legendItem}><span className={styles.dot} style={{background: '#eab308'}}></span> Medium</span>
              <span className={styles.legendItem}><span className={styles.dot} style={{background: '#22c55e'}}></span> Low</span>
            </div>
          </div>

          <div className={styles.heatmapGrid}>
            {heatmapData.map((item, index) => (
              <div key={index} className={styles.heatItem}>
                <div 
                  className={styles.heatBox} 
                  style={{ backgroundColor: getRiskColor(item.risk) }}
                >
                  {item.risk}
                </div>
                <span className={styles.heatLabel}>{item.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.insightBox}>
            <AlertTriangle size={18} className={styles.alertIcon} />
            <p>
              <strong>Roster Recommendation:</strong> 
              {timeframe === 'Next Shift' 
                ? ' High load expected for Night Shift. Approve overtime for 2 staff members.'
                : timeframe === 'Next Day'
                ? ' Critical load predicted for Dec 31. Activate overflow protocols.'
                : ' March shows seasonal spike. Plan staff leave accordingly.'
              }
            </p>
          </div>
        </section>
    </div>
  );
};

export default ETU_BedTrend;