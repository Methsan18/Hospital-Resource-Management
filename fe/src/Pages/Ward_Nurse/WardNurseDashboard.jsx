import React, { useState } from 'react';
import { CloudRain, AlertTriangle, Thermometer, Wind } from 'lucide-react'; // Make sure to install lucide-react or use alternatives

const WardNurseDashboard = () => {
  // 1. Local Ward Data State
  const [wardData, setWardData] = useState({
    capacity: 100,
    occupancy: 85,
    discharges: 10,
    deaths: 0
  });

  // 2. Incoming AI Requests
  const [incomingRequest] = useState({
    count: 8,
    from: "ETU - Emergency Treatment Unit",
    priority: "High"
  });

  // 3. NEW: External Alerts (Mock Data from AI/API)
  const alerts = {
    weather: {
      condition: "Heavy Rain",
      temp: "24°C",
      impact: "High risk of road accidents & slip/fall cases."
    },
    outbreak: {
      disease: "Seasonal Flu",
      status: "Moderate",
      note: "Respiratory ward admissions rising by 15%."
    }
  };

  // Availability Calculation
  const availableBeds = wardData.capacity - (wardData.occupancy - wardData.discharges);

  const handleUpdate = (e) => {
    setWardData({ ...wardData, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: '24px auto', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ marginBottom: 32, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: '#1e293b' }}>General Ward Portal</h1>
        <p style={{ color: '#64748b', marginTop: 4, fontWeight: 500 }}>Live Resource Management System</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>

        

        {/* 2. INCOMING REQUESTS (ACTION) */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderLeft: '6px solid #f97316', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#334155' }}>Transfer Request</h2>
            <span style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>URGENT</span>
          </div>

          <div style={{ background: '#fff7ed', padding: 16, borderRadius: 12, marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#9a3412', fontWeight: 700, textTransform: 'uppercase' }}>FROM: {incomingRequest.from}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0' }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#ea580c' }}>{incomingRequest.count}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#9a3412' }}>Patients</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#c2410c', fontStyle: 'italic' }}>"AI predicts surge. Immediate bed allocation required."</p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              disabled={availableBeds < incomingRequest.count}
              style={{ flex: 2, background: availableBeds >= incomingRequest.count ? '#059669' : '#94a3b8', color: '#fff', padding: '12px', borderRadius: 8, border: 'none', fontWeight: 700, cursor: availableBeds >= incomingRequest.count ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
            >
              {availableBeds >= incomingRequest.count ? 'Accept All' : 'Insufficient Capacity'}
            </button>
            <button style={{ flex: 1, border: '2px solid #e2e8f0', padding: '12px', borderRadius: 8, fontWeight: 700, background: '#fff', color: '#64748b', cursor: 'pointer' }}>
              Reject
            </button>
          </div>
        </div>

        {/* 3. NEW: EXTERNAL FACTORS & ALERTS */}
        <div style={{ display: 'grid', gap: 16 }}>
          
          {/* Weather Alert */}
          <div style={{ background: '#eff6ff', padding: 20, borderRadius: 16, border: '1px solid #dbeafe', display: 'flex', alignItems: 'start', gap: 16 }}>
            <div style={{ background: '#3b82f6', padding: 10, borderRadius: 10, color: 'white' }}>
              <CloudRain size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e40af', margin: '0 0 4px 0' }}>Weather Impact</h3>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#1e3a8a', margin: 0 }}>{alerts.weather.condition}</p>
              <p style={{ fontSize: 13, color: '#3b82f6', marginTop: 4, lineHeight: '1.4' }}>{alerts.weather.impact}</p>
            </div>
          </div>

          {/* Disease Outbreak Alert */}
          <div style={{ background: '#fef2f2', padding: 20, borderRadius: 16, border: '1px solid #fee2e2', display: 'flex', alignItems: 'start', gap: 16 }}>
            <div style={{ background: '#ef4444', padding: 10, borderRadius: 10, color: 'white' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#991b1b', margin: '0 0 4px 0' }}>Outbreak Alert</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#7f1d1d', margin: 0 }}>{alerts.outbreak.disease}</p>
                <span style={{ fontSize: 11, fontWeight: 700, background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: 12, border: '1px solid #fecaca' }}>{alerts.outbreak.status}</span>
              </div>
              <p style={{ fontSize: 13, color: '#b91c1c', marginTop: 4, lineHeight: '1.4' }}>{alerts.outbreak.note}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WardNurseDashboard;