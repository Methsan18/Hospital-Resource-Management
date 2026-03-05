import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, ChevronDown, Activity, HeartPulse, Thermometer, BrainCircuit, CloudRain, Loader2, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/* --- ANIMATION STYLES --- */
const styles = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

/* --- THEME --- */
const theme = {
  cardBg: '#fff',
  cardBorder: '#e6eef6',
  shadowLg: '0 10px 28px rgba(2,6,23,0.08)',
  muted: '#64748b',
  text: '#0f172a',
  heading: '#334155',
  accent: '#0ea5e9',
  grid: '#f1f5f9',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CATEGORIES = ['Dengue', 'Viral Fever', 'Respiratory Infection', 'Common Cold', 'Gastritis', 'Migraine', 'Diabetes', 'Leptospirosis', 'Dysentery', 'Typhoid', 'Chickenpox'];

const MethaRoleDashboard = () => {
  // State for Disease Selection
  const [disease, setDisease] = useState('Dengue');
  
  // State for Predictions
  const [weeklyPrediction, setWeeklyPrediction] = useState(null);
  const [monthlyPrediction, setMonthlyPrediction] = useState(null);
  const [weekOfMonth, setWeekOfMonth] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [weatherData, setWeatherData] = useState({
    temperature: 30.5,
    humidity: 82,
    rainfall: 15.2,
    tempTrend: '↑ 2.1°C from last month',
    location: 'Kandy District - Avg'
  });

  // Helper: Calculate week of month
  const getWeekOfMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const pastDaysOfMonth = today.getDate() - 1;
    const week = Math.floor((pastDaysOfMonth + firstDay.getDay()) / 7) + 1;
    return week;
  };

  const currentWeek = getWeekOfMonth();
  const nextWeek = Math.min(currentWeek + 1, 4);
  
  // Helper: Get next month
  const getNextMonth = () => {
    const today = new Date();
    const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return MONTHS[nextMonthDate.getMonth()];
  };

  const nextMonth = getNextMonth();

  // ✅ EFFECT: FETCH BOTH WEEKLY AND MONTHLY PREDICTIONS
  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date();
        const currentMonth = MONTHS[today.getMonth()];
        
        // Fetch weather data from backend
        const weatherRes = await axios.get('http://127.0.0.1:5001/get_weather').catch(err => {
          console.error("Weather API Error:", err);
          return { data: { status: 'error' } };
        });
        
        if (weatherRes.data.status === 'success') {
          setWeatherData({
            temperature: weatherRes.data.current.temperature,
            humidity: weatherRes.data.current.humidity,
            rainfall: weatherRes.data.current.rainfall,
            tempTrend: weatherRes.data.current.temperature_trend,
            location: weatherRes.data.location,
            rainfallStatus: weatherRes.data.current.rainfall_status
          });
        }
        
        // Use weather data from backend for predictions
        const weather = weatherRes.data.status === 'success' ? weatherRes.data.current : {
          temperature: 30.5,
          humidity: 82,
          rainfall: 15.2,
          rain_lag: 10.5
        };
        
        // Fetch WEEKLY prediction (for next week of current month)
        const weeklyRes = await axios.post('http://127.0.0.1:5001/predict_illness', {
          disease: disease,
          scale: 'weekly',
          month: MONTHS.indexOf(currentMonth) + 1,
          rainfall: weather.rainfall,
          humidity: weather.humidity,
          temp: weather.temperature,
          rain_lag: weather.rain_lag || 10.5
        }).catch(err => {
          console.error("Weekly API Error:", err);
          return { data: { status: 'error', predicted_patients: null } };
        });
        
        // Fetch MONTHLY prediction (for next month)
        const monthlyRes = await axios.post('http://127.0.0.1:5001/predict_illness', {
          disease: disease,
          scale: 'monthly',
          month: MONTHS.indexOf(nextMonth) + 1,
          rainfall: weather.rainfall,
          humidity: weather.humidity,
          temp: weather.temperature,
          rain_lag: weather.rain_lag || 10.5
        }).catch(err => {
          console.error("Monthly API Error:", err);
          return { data: { status: 'error', predicted_patients: null } };
        });
        
        // Set weekly prediction (with fallback)
        if (weeklyRes.data && (weeklyRes.data.status === 'success' || weeklyRes.data.predicted_patients)) {
          setWeeklyPrediction(weeklyRes.data.predicted_patients);
          setWeekOfMonth(nextWeek);
        } else {
          setError("Failed to fetch weekly prediction");
        }
        
        // Set monthly prediction (with fallback)
        if (monthlyRes.data && (monthlyRes.data.status === 'success' || monthlyRes.data.predicted_patients)) {
          setMonthlyPrediction(monthlyRes.data.predicted_patients);
        } else {
          setError("Failed to fetch monthly prediction");
        }
        
        // Fetch 12-month predictions for trend analysis
        const monthlyPredictions = [];
        for (let i = 0; i < 12; i++) {
          const monthNum = (i) % 12 + 1;
          try {
            const res = await axios.post('http://127.0.0.1:5001/predict_illness', {
              disease: disease,
              scale: 'monthly',
              month: monthNum,
              rainfall: weather.rainfall,
              humidity: weather.humidity,
              temp: weather.temperature,
              rain_lag: weather.rain_lag || 10.5
            });
            monthlyPredictions.push({
              month: MONTHS[i].slice(0, 3),
              [disease]: Math.round(res.data.predicted_patients || 0)
            });
          } catch (err) {
            console.error(`Error fetching month ${monthNum}:`, err);
            monthlyPredictions.push({
              month: MONTHS[i].slice(0, 3),
              [disease]: 0
            });
          }
        }
        setChartData(monthlyPredictions);
      } catch (err) {
        console.error("Connection Error:", err);
        setError("Backend Offline");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [disease]); // Only depend on disease selection

  return (
    <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      
      {/* ==================== HEADER ==================== */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '32px', borderRadius: 16, marginBottom: 32, boxShadow: theme.shadowLg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>Hospital AI Command Center</h1>
            <p style={{ margin: '12px 0 0 0', opacity: 0.85, fontSize: 15 }}>Real-time Resource & Disease Forecasting Intelligence</p>
          </div>
          <div style={{ background: 'rgba(4, 213, 142, 0.15)', border: '1px solid #04d58e', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            System Online
          </div>
        </div>
      </div>

      {/* ==================== DISEASE SELECTOR ==================== */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.heading, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          🔍 Disease Forecast Selection
        </label>
        <div style={{ background: '#fff', padding: 0, borderRadius: 12, border: `2px solid #e2e8f0`, overflow: 'hidden', transition: 'all 0.3s' }}>
          <select 
            value={disease} 
            onChange={(e) => setDisease(e.target.value)}
            style={{ 
              border: 'none', 
              outline: 'none', 
              fontSize: 15, 
              fontWeight: 600, 
              color: theme.text, 
              cursor: 'pointer', 
              width: '100%', 
              padding: '14px 18px',
              background: 'transparent',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23334155' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '40px'
            }}
          >
            {CATEGORIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {/* ==================== ALERTS SECTION ==================== */}
      {(weeklyPrediction > 25 || monthlyPrediction > 25) && (
        <div style={{ 
          background: 'linear-gradient(135deg, #fef2f2 0%, #fef9f3 100%)', 
          border: '2px solid #fed7d7', 
          padding: 18, 
          borderRadius: 14, 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 16, 
          color: '#991b1b', 
          marginBottom: 28,
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
        }}>
          <AlertCircle size={24} style={{ flexShrink: 0, marginTop: 2, color: '#dc2626' }} />
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, display: 'block', marginBottom: 6 }}>⚠️ High Admission Alert</span>
            <span style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
              {weeklyPrediction > 25 && <span>Week {nextWeek} forecast: <strong>{Math.round(weeklyPrediction)}</strong> cases. </span>}
              {monthlyPrediction > 25 && <span>{nextMonth} forecast: <strong>{Math.round(monthlyPrediction)}</strong> cases. </span>}
              <br />
              Predicted admissions may exceed standard capacity. Consider resource allocation.
            </span>
          </div>
        </div>
      )}

      {/* ==================== FORECAST SECTION ==================== */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: theme.heading, margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrainCircuit size={20} /> 
          <span>{disease} Admission Forecast</span>
        </h2>

        {/* WEEKLY & MONTHLY CARDS SIDE BY SIDE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          
          {/* ===== WEEKLY FORECAST CARD ===== */}
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 
            padding: 28, 
            borderRadius: 16, 
            color: 'white',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Activity size={20} style={{ opacity: 0.9 }} />
              <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.95, textTransform: 'uppercase', letterSpacing: 1 }}>Weekly Forecast</span>
            </div>
            
            <p style={{ fontSize: 13, opacity: 0.85, margin: 0, marginBottom: 14 }}>Expected Admissions (Next Week)</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
              <h2 style={{ fontSize: 52, fontWeight: 900, margin: 0, letterSpacing: -1 }}>
                {loading ? <Loader2 size={48} className="animate-spin" /> : (error ? "—" : (weeklyPrediction !== null ? Math.round(weeklyPrediction) : "—"))}
              </h2>
              <span style={{ fontSize: 18, opacity: 0.95 }}>Patients</span>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500 }}>
              📅 Week {nextWeek} of {MONTHS[new Date().getMonth()]} 2026
            </div>
          </div>

          {/* ===== MONTHLY FORECAST CARD ===== */}
          <div style={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', 
            padding: 28, 
            borderRadius: 16, 
            color: 'white',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <TrendingUp size={20} style={{ opacity: 0.9 }} />
              <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.95, textTransform: 'uppercase', letterSpacing: 1 }}>Monthly Forecast</span>
            </div>
            
            <p style={{ fontSize: 13, opacity: 0.85, margin: 0, marginBottom: 14 }}>Expected Admissions (Next Month)</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
              <h2 style={{ fontSize: 52, fontWeight: 900, margin: 0, letterSpacing: -1 }}>
                {loading ? <Loader2 size={48} className="animate-spin" /> : (error ? "—" : (monthlyPrediction !== null ? Math.round(monthlyPrediction) : "—"))}
              </h2>
              <span style={{ fontSize: 18, opacity: 0.95 }}>Patients</span>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500 }}>
              📅 {nextMonth} 2026
            </div>
          </div>
        </div>

        {/* ===== WEATHER INFO CARDS ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <WeatherCard 
            icon={<Thermometer color="#ef4444" />} 
            title="Temperature" 
            value={`${weatherData.temperature}°C`} 
            sub={`${weatherData.location}`} 
            trend={weatherData.tempTrend} 
          />
          <WeatherCard 
            icon={<CloudRain color="#3b82f6" />} 
            title="Rainfall" 
            value={`${weatherData.rainfall} mm`} 
            sub="Monthly Average" 
            trend={`${weatherData.rainfallStatus || 'Moderate'} rainfall conditions`}
          />
        </div>
      </div>

      {/* ==================== CHART SECTION ==================== */}
      <div style={{ background: '#fff', padding: 28, borderRadius: 16, border: `1px solid ${theme.cardBorder}`, boxShadow: theme.shadowLg }}>
        <h3 style={{ margin: '0 0 24px 0', color: theme.heading, fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={20} />
          12-Month Trend Analysis - {disease}
        </h3>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
            <XAxis dataKey="month" stroke={theme.muted} style={{ fontSize: 13 }} />
            <YAxis stroke={theme.muted} style={{ fontSize: 13 }} />
            <Tooltip 
              contentStyle={{ background: '#fff', border: `1px solid ${theme.cardBorder}`, borderRadius: 8, boxShadow: theme.shadowLg }}
              formatter={(value) => [Math.round(value), 'Patients']}
              labelStyle={{ color: theme.text }}
            />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 16 }} />
            <Line 
              type="monotone" 
              dataKey={disease} 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ fill: '#3b82f6', r: 5 }} 
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const KpiCard = ({ icon, title, value, sub, trend }) => (
  <div style={{ background: '#fff', padding: 22, borderRadius: 14, border: `1px solid #e2e8f0`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s ease' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ background: '#f0f4f8', width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
    </div>
    <p style={{ margin: 0, color: theme.muted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{title}</p>
    <h3 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.text, marginBottom: 8 }}>{value}</h3>
    <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{sub}</p>
    <p style={{ margin: 0, fontSize: 12, color: '#10b981', fontWeight: 500 }}>{trend}</p>
  </div>
);

const WeatherCard = ({ icon, title, value, sub, trend }) => (
  <div style={{ background: '#fff', padding: 22, borderRadius: 14, border: `1px solid #e2e8f0`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s ease' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ background: '#f0f4f8', width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
    </div>
    <p style={{ margin: 0, color: theme.muted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{title}</p>
    <h3 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.text, marginBottom: 8 }}>{value}</h3>
    <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{sub}</p>
    <p style={{ margin: 0, fontSize: 12, color: '#06b6d4', fontWeight: 500 }}>{trend}</p>
  </div>
);

const Dropdown = ({ label, value, onChange, options }) => (
  <div style={{ background: '#fff', padding: '12px 20px', borderRadius: 12, border: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <span style={{ fontSize: 12, color: theme.muted, fontWeight: 600, marginBottom: 4 }}>{label}</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{ border: 'none', outline: 'none', fontSize: 16, fontWeight: 600, color: theme.text, cursor: 'pointer', width: '100%', background: 'transparent' }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
    <ChevronDown size={20} color={theme.muted} />
  </div>
);

export default MethaRoleDashboard;