import React, { useState, useEffect } from 'react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Info } from 'lucide-react';
import styles from './ETU_BedForecast.module.css';

const ETU_BedForecast = () => {
  // --- STATE ---
  const [timeframe, setTimeframe] = useState('Next Shift');
  const [model, setModel] = useState('TFT');
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  // --- MOCK DATA ENGINE ---
  useEffect(() => {
    let generatedData = [];
    let generatedTable = [];
    
    // BASELINE: Total ETU Volume (No more Zone splitting)
    const shiftAvg = 45; // Average patients per shift for the whole unit
    const dailyAvg = shiftAvg * 2; 
    const monthlyAvg = dailyAvg * 30;

    // --- LOGIC 1: NEXT SHIFT (Shift-Wise View) ---
    if (timeframe === 'Next Shift') {
      generatedData = [
        { name: 'Jan 04 (Day)', historical: shiftAvg - 5, predicted: null, range: null },
        { name: 'Jan 04 (Night)', historical: shiftAvg + 8, predicted: null, range: null },
        { name: 'Jan 05 (Day)', historical: shiftAvg - 2, predicted: null, range: null },
        // Connector
        { name: 'Jan 05 (Day)', historical: null, predicted: shiftAvg - 2, range: [shiftAvg-2, shiftAvg-2] },
        // The Prediction
        { name: 'Jan 05 (Night)', historical: null, predicted: shiftAvg + 12, range: [shiftAvg + 5, shiftAvg + 20] },
        { name: 'Jan 06 (Day)', historical: null, predicted: shiftAvg + 12, range: [shiftAvg + 5, shiftAvg + 20] },
        { name: 'Jan 06 (Night)', historical: null, predicted: shiftAvg + 12, range: [shiftAvg + 5, shiftAvg + 20] },
      ];
      generatedTable = [
        { label: 'Jan 05 (Night)', prediction: shiftAvg + 12, min: shiftAvg + 5, max: shiftAvg + 20 },
        { label: 'Jan 06 (Day)', prediction: shiftAvg + 12, min: shiftAvg + 5, max: shiftAvg + 20 },
        { label: 'Jan 06 (Night)', prediction: shiftAvg + 12, min: shiftAvg + 5, max: shiftAvg + 20 }
      ];
    } 
    
    // --- LOGIC 2: NEXT DAY (Daily Total View) ---
    else if (timeframe === 'Next Day') {
      generatedData = [
        { name: 'Jan 03', historical: dailyAvg - 10, predicted: null, range: null },
        { name: 'Jan 04', historical: dailyAvg + 15, predicted: null, range: null },
        { name: 'Jan 05', historical: dailyAvg - 5, predicted: null, range: null },
        // Connector
        { name: 'Jan 05', historical: null, predicted: dailyAvg - 5, range: [dailyAvg-5, dailyAvg-5] },
        // The Prediction (Tomorrow)
        { name: 'Jan 06', historical: null, predicted: dailyAvg + 25, range: [dailyAvg + 15, dailyAvg + 35] },
      ];
      generatedTable = [
        { label: 'Jan 06  (Tomorrow)', prediction: dailyAvg + 25, min: dailyAvg + 15, max: dailyAvg + 35 }
      ];
    } 
    
    // --- LOGIC 3: NEXT MONTH (Monthly Total View) ---
    else if (timeframe === 'Next Month') {
      generatedData = [
        { name: 'Nov', historical: monthlyAvg - 50, predicted: null, range: null },
        { name: 'Dec', historical: monthlyAvg + 120, predicted: null, range: null },
        { name: 'Jan', historical: monthlyAvg - 20, predicted: null, range: null },
        // Connector
        { name: 'Jan', historical: null, predicted: monthlyAvg - 20, range: [monthlyAvg-20, monthlyAvg-20] },
        // The Prediction (Next Month)
        { name: 'Feb', historical: null, predicted: monthlyAvg + 180, range: [monthlyAvg + 100, monthlyAvg + 250] },
      ];
      generatedTable = [
        { label: 'February 2026', prediction: monthlyAvg + 180, min: monthlyAvg + 100, max: monthlyAvg + 250 }
      ];
    }

    setChartData(generatedData);
    setTableData(generatedTable);
  }, [timeframe, model]);

  return (
    <div className={styles.container}>
        
        {/* --- HEADER --- */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Total ETU Demand Forecast</h1>
            <p className={styles.subtitle}>AI-Powered prediction for overall unit volume</p>
          </div>

          <div className={styles.controls}>
            {/* REMOVED TARGET ZONE SELECTOR */}

            <div className={styles.controlGroup}>
              <span className={styles.label}>Timeframe:</span>
              <select 
                className={styles.select}
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option>Next Shift</option>
                <option>Next Day</option>
                <option>Next Month</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <span className={styles.label}>Model:</span>
              <select 
                className={`${styles.select} ${styles.modelSelect}`}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option>TFT (Transformer)</option>
                <option>LSTM</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- MAIN CHART CARD --- */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Total ETU Volume: {timeframe}</h3>
              <span className={styles.cardSub}>
                {timeframe === 'Next Shift' ? 'Shift-by-Shift Analysis' : 
                 timeframe === 'Next Day' ? 'Daily Total Analysis' : 
                 'Monthly Total Analysis'}
              </span>
            </div>
          </div>

          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                  interval={0} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }}/>
                
                <Area 
                  type="monotone" 
                  dataKey="range" 
                  stroke="none" 
                  fill="url(#colorCi)" 
                  name="Confidence Range"
                />

                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                  name="Observed Data" 
                />

                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} 
                  name="AI Prediction" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* --- ANALYSIS BOX --- */}
          <div className={styles.analysisBox}>
            <Info className={styles.analysisIcon} size={20} />
            <p>
              <strong>Analysis:</strong> Based on the <strong>{model}</strong> model, the 
              <strong> {timeframe}</strong> prediction indicates a total load of <strong>{tableData[0]?.prediction}</strong> patients. 
              {timeframe === 'Next Shift' && ' Prepare for increased intake during the Night Shift.'}
              {timeframe === 'Next Month' && ' This indicates a seasonal increase.'}
            </p>
          </div>
        </section>

        {/* --- DETAILS TABLE --- */}
        <section className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Forecast Details</h3>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Predicted Total</th>
                  <th>Lower Bound</th>
                  <th>Upper Bound</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.label}</td>
                    <td className={styles.bold}>{row.prediction}</td>
                    <td className={styles.subtle}>{row.min}</td>
                    <td className={styles.subtle}>{row.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
    </div>
  );
};

export default ETU_BedForecast;