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
import { AlertTriangle, Activity } from 'lucide-react';
import styles from './ETU_NurseTrend.module.css';

const ETU_NurseTrend = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [capacity, setCapacity] = useState(25); 

  // --- FETCH TREND DATA ---
  useEffect(() => {
    setLoading(true);

    // 1. Fetch Chart Data (Latest 10 Shifts)
    fetch('http://localhost:5001/api/get-trend-data')
      .then((res) => res.json())
      .then((data) => {
        console.log("Trend Data:", data);
        setChartData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Chart Error:", err);
        setLoading(false);
      });

    // 2. Fetch Capacity for Reference Line
    fetch('http://localhost:5001/api/get-beds')
      .then(res => res.json())
      .then(beds => {
        const etuCap = beds.filter(b => b.ward_id === 'ETU' && b.status === 'Functional').length;
        if (etuCap > 0) setCapacity(etuCap);
      })
      .catch(e => console.error(e));

  }, []);

  if (loading) return (
    <div className={styles.container}>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%'}}>
        <Activity className="animate-spin" size={32} color="#2563eb" />
        <p style={{marginTop:10, color:'#64748b'}}>Loading Comparison Data...</p>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>

      {/* --- HEADER --- */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>AI Accuracy & Trends</h1>
          <p style={{color: '#64748b', margin: '4px 0 0 0', fontSize: '14px'}}>
            Comparing Real Admissions vs. AI Predictions (Last 10 Shifts)
          </p>
        </div>
      </div>

      {/* --- CHART SECTION --- */}
      <section className={styles.card}>
          <div className={styles.centerTitle}>
            <h3 style={{fontSize:16, fontWeight:600, color:'#334155', margin:0}}>
               Patient Volume History
            </h3>
            <span style={{fontSize:12, color:'#94a3b8'}}>
              (Blue = Real Data, Orange = AI Prediction)
            </span>
          </div>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eef6" />
                
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 11 }} 
                  dy={10} 
                  interval="preserveStartEnd"
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
                
                <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }}
                    itemStyle={{ color: '#1e293b' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle"/>
                
                {/* Capacity Reference Line */}
                <ReferenceLine y={capacity} label="Max Capacity" stroke="#ef4444" strokeDasharray="3 3" />

                {/* 1. REAL DATA (Blue Line) */}
                <Line 
                  type="monotone" 
                  dataKey="Observed" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6 }}
                  name="Real Admissions"
                  connectNulls={true}
                />

                {/* 2. AI DATA (Orange Dashed Line) */}
                <Line 
                  type="monotone" 
                  dataKey="Predicted" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" // Dashed line to show it is a prediction/model
                  dot={{ r: 3, fill: '#f97316' }} 
                  name="AI Prediction"
                  connectNulls={true}
                />

              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div style={{ marginTop: 20, padding: 16, background: '#f0f9ff', borderRadius: 12, border: '1px solid #bae6fd', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Activity size={20} color="#0284c7" />
            <p style={{ margin: 0, fontSize: 14, color: '#0369a1' }}>
                <strong>Insight:</strong> Gaps between the Blue and Orange lines show AI deviation. 
                Use this to adjust your trust in the forecast.
            </p>
        </div>
    </div>
  );
};

export default ETU_NurseTrend;