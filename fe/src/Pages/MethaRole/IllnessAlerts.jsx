import React, { useState, useEffect } from 'react';
import { AlertCircle, Filter, Loader2 } from 'lucide-react';
import axios from 'axios';

const IllnessAlerts = () => {
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DISEASES = ['Dengue', 'Viral Fever', 'Respiratory Infection', 'Common Cold', 'Gastritis', 'Migraine', 'Diabetes', 'Leptospirosis', 'Dysentery', 'Typhoid', 'Chickenpox'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Calculate next month once - safe from infinite loops
  const today = new Date();
  const nextMonthIndex = (today.getMonth() + 1) % 12;
  const nextMonthYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
  const nextMonthName = MONTHS[nextMonthIndex];

  // Fetch predictions from backend
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Fetch weather data from backend
        const weatherRes = await axios.get('http://127.0.0.1:5001/get_weather').catch(err => {
          console.error("Weather API Error:", err);
          return { 
            data: { 
              status: 'error',
              current: { temperature: 30.5, humidity: 82.0, rainfall: 15.2, rain_lag: 10.5 }
            } 
          };
        });

        const weather = weatherRes.data.status === 'success' 
          ? weatherRes.data.current 
          : { temperature: 30.5, humidity: 82.0, rainfall: 15.2, rain_lag: 10.5 };

        console.log('🌤️ Weather Data:', weather);

        const alerts = [];

        // Step 2: Fetch predictions for all diseases using weather data
        const promises = DISEASES.map(disease =>
          axios.post('http://127.0.0.1:5001/predict_illness', {
            disease: disease,
            scale: 'monthly',
            month: nextMonthIndex + 1,
            rainfall: weather.rainfall || 15.2,
            humidity: weather.humidity || 82.0,
            temp: weather.temperature || 30.5,
            rain_lag: weather.rain_lag || 10.5
          }, { timeout: 5000 })
          .then(res => {
            if (res.data.status === 'success' && res.data.predicted_patients !== undefined) {
              const cases = Math.round(res.data.predicted_patients);
              let priority = 'Low';
              let description = '';

              if (cases > 30) {
                priority = 'High';
                description = `Significant increase in ${disease} cases projected for ${nextMonthName}. Immediate resource allocation recommended based on model predictions.`;
              } else if (cases > 20) {
                priority = 'Moderate';
                description = `Moderate rise in ${disease} cases expected in ${nextMonthName}. Monitor closely and prepare contingency plans.`;
              } else {
                priority = 'Low';
                description = `${disease} cases expected to remain at normal levels in ${nextMonthName}. Continue routine monitoring.`;
              }

              return {
                alert: disease,
                description: description,
                priority: priority,
                cases: cases,
                month: nextMonthName
              };
            }
            return null;
          })
          .catch(err => {
            console.error(`❌ ${disease} Error:`, err.message);
            return null;
          })
        );

        const responses = await Promise.all(promises);
        const validAlerts = responses.filter(a => a !== null);

        if (validAlerts.length === 0) {
          throw new Error('No data received from backend');
        }
        
        // Sort by priority (High -> Moderate -> Low) and then by cases
        validAlerts.sort((a, b) => {
          const priorityOrder = { 'High': 0, 'Moderate': 1, 'Low': 2 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          return b.cases - a.cases;
        });

        setAlertsData(validAlerts);
        console.log(`✅ Generated ${validAlerts.length} alerts for ${nextMonthName}`, validAlerts);
      } catch (err) {
        console.error("❌ Critical Error:", err.message);
        setError(`Backend connection failed: ${err.message}. Make sure Flask server is running on http://127.0.0.1:5001`);
        setAlertsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Filter Logic
  const filteredData = priorityFilter === 'All' 
    ? alertsData 
    : alertsData.filter(item => item.priority === priorityFilter);

  // Helper for Styling Chips
  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#dc2626';
    if (priority === 'Moderate') return '#ea580c';
    return '#10b981';
  };

  const getPriorityBgColor = (priority) => {
    if (priority === 'High') return '#fee2e2';
    if (priority === 'Moderate') return '#fef3c7';
    return '#f0fdf4';
  };

  return (
    <div style={{ padding: 28, maxWidth: 1100, margin: '24px auto', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Header with Filter */}
        <div style={{
          background: '#0b2a5b',
          color: '#fff',
          padding: '20px 24px',
          borderRadius: 14,
          marginBottom: 28,
          boxShadow: '0 10px 28px rgba(2,6,23,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Illness & Injury Alerts</h1>
            <p style={{ margin: 0, marginTop: 6, opacity: 0.9 }}>AI-predicted risk notifications for <span style={{ fontWeight: 700 }}>{nextMonthName} {nextMonthYear}</span></p>
          </div>

          {/* Priority Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Filter size={16} color="#fff" style={{ marginRight: 8, opacity: 0.9 }} />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                minWidth: 120
              }}
            >
              <option value="All" style={{ color: '#000' }}>All Priorities</option>
              <option value="High" style={{ color: '#000' }}>High Only</option>
              <option value="Moderate" style={{ color: '#000' }}>Moderate Only</option>
              <option value="Low" style={{ color: '#000' }}>Low Only</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: 40, textAlign: 'center', background: '#fff', borderRadius: 12, border: '1px solid #e6eef6' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', margin: 0 }}>Fetching disease predictions from backend...</p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '8px 0 0 0' }}>Connecting to: http://127.0.0.1:5001/predict_illness</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ padding: 20, background: '#fef2f2', borderRadius: 12, border: '1px solid #fee2e2', color: '#991b1b', marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 8px 0' }}>⚠️ Connection Issue</h3>
            <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
          </div>
        )}

        {/* Alerts Table */}
        {!loading && (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e6eef6',
            boxShadow: '0 8px 24px rgba(2,6,23,0.06)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e6eef6' }}>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#334155',
                    width: '20%'
                  }}>
                    Alert
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#334155',
                    width: '45%'
                  }}>
                    Description
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#334155',
                    width: '15%'
                  }}>
                    Predicted Cases
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#334155',
                    width: '20%'
                  }}>
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: idx < filteredData.length - 1 ? '1px solid #e6eef6' : 'none',
                        background: idx % 2 === 0 ? '#fff' : '#f8fafc'
                      }}
                    >
                      <td style={{
                        padding: '16px 20px',
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#0f172a'
                      }}>
                        {row.alert}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        fontSize: 15,
                        color: '#475569',
                        lineHeight: 1.5
                      }}>
                        {row.description}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#0b2a5b'
                      }}>
                        {row.cases}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        fontSize: 15,
                        fontWeight: 600
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: 6,
                          background: getPriorityBgColor(row.priority),
                          color: getPriorityColor(row.priority),
                          fontWeight: 700,
                          fontSize: 13
                        }}>
                          {row.priority}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                      No alerts found for this priority level.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Info Box */}
        {!loading && (
          <div style={{
            marginTop: 24,
            padding: 16,
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12,
            display: 'flex',
            gap: 12
          }}>
            <AlertCircle size={20} color="#1e40af" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e40af' }}>Alert Management</p>
              <p style={{ margin: '6px 0 0 0', fontSize: 13, color: '#1e3a8a' }}>
                Alerts are dynamically generated based on backend AI predictions. High priority ({'>'}30 cases) requires immediate attention. Moderate (20-30 cases) requires planning. Low ({'\u003c'}20 cases) indicates normal monitoring.
              </p>
            </div>
          </div>
        )}

      </div>
  );
};

export default IllnessAlerts;