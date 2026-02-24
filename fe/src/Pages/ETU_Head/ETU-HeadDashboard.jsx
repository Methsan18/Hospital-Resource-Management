import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BedDouble, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CloudRain, // New Icon for the "Driver"
  ArrowRight 
} from 'lucide-react';
const ETU_HeadDashboard = () => {

  // --- MOCK REAL-TIME DATA ---
  const totalCapacity = 50; // total beds in unit
  const occupiedBeds = 40; // current occupied beds
  const totalOccupancy = Math.round((occupiedBeds / totalCapacity) * 100); // occupancy %
  const occupancyColor = totalOccupancy > 85 ? '#ef4444' : totalOccupancy > 60 ? '#f59e0b' : '#10b981';
  const occupancyStatus = totalOccupancy > 85 ? 'CRITICAL' : totalOccupancy > 60 ? 'BUSY' : 'NORMAL';

  // --- MOCK PREDICTION DATA (The "Why") ---
  const prediction = {
    count: 20,
    driver: 'Heavy Rainfall Alert',
    risk: 'High',
    time: 'Night Shift'
  };

  const isCritical = totalOccupancy > 85;

  const bannerBase = {
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
  };

  const bannerStyle = isCritical
    ? {
        ...bannerBase,
        background: 'linear-gradient(135deg, #fff7f6 0%, #fee2e2 100%)',
        border: '1px solid #fecaca',
      }
    : {
        ...bannerBase,
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid #bfdbfe',
      };

  return (
    <div style={{ padding: 28, maxWidth: 1100, margin: '24px auto', color: '#0f172a' }}>
        
        {/* --- HEADER --- */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>ETU Operations Dashboard</h1>
            <p style={{ color: '#64748b', marginTop: 4 }}>Emergency Treatment Unit • Real-time Status</p>
          </div>
          
          {/* System Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: occupancyColor, background: '#fff', padding: '6px 12px', borderRadius: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: occupancyColor, boxShadow: `0 0 0 2px ${occupancyColor}33` }}></div>
            System Status: {occupancyStatus}
          </div>
        </div>

        {/* --- NEW: AI PREDICTION ALERT BANNER --- */}
        {/* This answers: "Why is the load high?" and links to Optimization */}
        <div style={bannerStyle}>
          
          {/* Left: The Prediction Context */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ 
              background: '#fff', width: 56, height: 56, borderRadius: 12, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isCritical ? '0 6px 10px -4px rgba(239,68,68,0.12)' : '0 4px 6px -1px rgba(59, 130, 246, 0.1)'
            }}>
              <CloudRain size={28} color={isCritical ? occupancyColor : '#2563eb'} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isCritical ? '#7f1d1d' : '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Forecast • {prediction.time}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: isCritical ? '#7f1d1d' : '#1e3a8a', marginTop: 2 }}>
                Expect {prediction.count} Patients 
              </div>
              <div style={{ fontSize: 14, color: isCritical ? '#b91c1c' : '#3b82f6', marginTop: 2 }}>
                Primary Driver: <strong>{prediction.driver}</strong>
              </div>
            </div>
          </div>

          {/* Right: The Call to Action (Button) */}
          <div>
            <Link to="/ETU_Head/dashboard/optimization" style={{ textDecoration: 'none' }}>
              <button style={{ 
                background: occupancyColor || '#ef4444', 
                color: '#fff', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: 8, 
                fontSize: 14, 
                fontWeight: 600, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(239,68,68,0.18)',
                transition: 'transform 0.2s',
              }}>
                View Optimization Plan <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>

        {/* --- KPI CARDS --- */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard 
            icon={<BedDouble size={24} color="#2563eb" />} 
            title="Total Capacity" 
            value={`${totalCapacity} Beds`} 
            sub="Fixed Unit Size"
          />
          <StatCard 
            icon={<Users size={24} color={occupancyColor} />} 
            title="Current Occupancy" 
            value={`${occupiedBeds} / ${totalCapacity} Beds Full`} 
            sub={`${totalOccupancy}%`}
          />
          <StatCard 
            icon={<Activity size={24} color={occupancyColor} />} 
            title="Next Shift Load" 
            value={`Predicted: ${prediction.count} Arrivals`} 
            sub={occupancyStatus}
          />
          
        </div>

        {/* --- LIVE UNIT SATURATION GAUGE --- */}
        <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Live Unit Saturation</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Overall pressure on the Emergency Unit</p>
            </div>
            <div style={{ textAlign: 'right' }}>
               <span style={{ fontSize: 32, fontWeight: 800, color: occupancyColor }}>{totalOccupancy}%</span>
               <span style={{ fontSize: 14, color: '#94a3b8', display: 'block' }}>Capacity Used</span>
            </div>
          </div>

          <div style={{ position: 'relative', height: 24, background: '#f1f5f9', borderRadius: 999, marginBottom: 30, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '60%', height: '100%', width: 2, background: '#fff', zIndex: 10 }}></div>
            <div style={{ position: 'absolute', left: '85%', height: '100%', width: 2, background: '#fff', zIndex: 10 }}></div>
            <div style={{ 
              width: `${totalOccupancy}%`, 
              height: '100%', 
              background: `linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #ef4444 100%)`, 
              borderRadius: 999, 
              transition: 'width 1s ease-in-out' 
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            <span>0% (Empty)</span>
            <span style={{ paddingLeft: 40 }}>60% (Busy)</span>
            <span style={{ paddingLeft: 40 }}>85% (Critical)</span>
            <span>100% (Full)</span>
          </div>

          {/* Critical Alert Recommendation */}
          {totalOccupancy > 85 && (
            <div style={{ marginTop: 24, background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ background: '#fff', padding: 8, borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                 <AlertTriangle size={20} color="#dc2626" />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#991b1b', fontSize: 15, fontWeight: 700 }}>Immediate Action Required</h4>
                <p style={{ margin: '4px 0 0 0', color: '#7f1d1d', fontSize: 13 }}>
                  Unit is critical. Click "View Optimization Plan" above to execute surge protocols.
                </p>
              </div>
            </div>
          )}

          {/* Two actionable notifications (from design attachment) */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/ETU_Head/dashboard/medandequip" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff7ed', border: '1px solid #fbd5b5', padding: 14, borderRadius: 10, color: '#92400e', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>⚠ Low stock of IV fluids may affect admissions and treatment flow.</div>
                <div style={{ fontSize: 13, color: '#7c2d12' }}>Review inventory and prioritise restocking for critical consumables.</div>
              </div>
            </Link>

            <Link to="/ETU_Head/dashboard/medandequip" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff1f0', border: '1px solid #fcd5d2', padding: 14, borderRadius: 10, color: '#9a3412', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>⚠ Oxygen cylinder availability is low. Monitor ICU and ETU demand closely.</div>
                <div style={{ fontSize: 13, color: '#7f1d1d' }}>Open supply dashboard to allocate cylinders and request transfers.</div>
              </div>
            </Link>
          </div>

        </div>

      </div>
    
  );
};

// --- Helper Component ---
const StatCard = ({ icon, title, value, sub }) => {
  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 16, minWidth: 260, flex: '0 0 auto' }}>
      <div style={{ minWidth: 48, height: 48, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: '#64748b', fontSize: 13, fontWeight: 600 }}>{title}</p>
        <h3 style={{ margin: '4px 0', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{value}</h3>
        {sub && <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{sub}</p>}
      </div>
    </div>
  );
};

export default ETU_HeadDashboard;

// Expose a hyphenated display name for DevTools and consistency with filename
ETU_HeadDashboard.displayName = 'ETU-HeadDashboard';