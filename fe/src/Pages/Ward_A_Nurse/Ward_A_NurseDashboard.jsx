import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  AlertTriangle, 
  BellRing, 
  ArrowRight, 
  Loader, 
  BedDouble, 
  CheckCircle2, 
  Clock,
  Tent,
  ArrowDownCircle // Added icon for surge arrivals
} from 'lucide-react';

const Ward_A_NurseDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [wardData, setWardData] = useState({
    capacity: 0,   
    occupancy: 0, 
    available: 0   
  });

  const [surgeCount, setSurgeCount] = useState(0); 
  const [incomingWardCount, setIncomingWardCount] = useState(0); // Regular beds
  const [incomingSurgeCount, setIncomingSurgeCount] = useState(0); // Surge area beds
  const [loadingAI, setLoadingAI] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- MOCK ALERTS ---
  const alerts = {
    weather: { condition: "Heavy Rain", impact: "High risk of road accidents & slip/fall cases." },
    outbreak: { disease: "Seasonal Flu", status: "Moderate", note: "Respiratory ward admissions rising by 15%." }
  };

  // --- 1. FETCH WARD REAL-TIME STATUS ---
  useEffect(() => {
    const fetchWardStatus = async () => {
      try {
        setLoadingStats(true);
        const responseStats = await fetch('http://localhost:5001/api/ward-status/WARD-A');
        if (responseStats.ok) {
          const data = await responseStats.json();
          setWardData({ capacity: data.capacity, available: data.available, occupancy: data.occupied });
        }
        const responseSurge = await fetch('http://localhost:5001/api/get-history?type=SurgeUpdate&ward=WARD-A');
        if (responseSurge.ok) {
            const surgeData = await responseSurge.json();
            setSurgeCount(surgeData.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch ward stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchWardStatus();
  }, []);

  // --- 2. FETCH AI OPTIMIZATION PLAN (WARD + SURGE BREAKDOWN) ---
  useEffect(() => {
    const fetchAIPlan = async () => {
      try {
        setLoadingAI(true);
        const res = await fetch('http://localhost:5001/predict'); 
        if (res.ok) {
          const data = await res.json();
          // Update to handle the new surge breakdown from backend
          if (data.action_plan_transfers) {
            setIncomingWardCount(data.action_plan_transfers.ward_a || 0);
          }
          if (data.action_plan_surge_breakdown) {
            setIncomingSurgeCount(data.action_plan_surge_breakdown.ward_a || 0);
          }
        }
      } catch (err) {
        console.error("Failed to fetch AI Plan", err);
      } finally {
        setLoadingAI(false);
      }
    };
    fetchAIPlan();
  }, []);

  const totalIncoming = incomingWardCount + incomingSurgeCount;
  const totalCapacityWithSurge = wardData.available + surgeCount;
  const isCritical = totalIncoming > totalCapacityWithSurge;
  const occupancyRate = wardData.capacity > 0 ? Math.round((wardData.occupancy / wardData.capacity) * 100) : 0;

  // --- STYLES ---
  const styles = {
    container: { padding: '40px', maxWidth: '1280px', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: '#1e293b', background: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' },
    title: { fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' },
    card: { background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', marginBottom: '24px', overflow: 'hidden' },
    notificationCard: { background: totalIncoming > 0 ? 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)' : 'white', borderLeft: totalIncoming > 0 ? '6px solid #f97316' : '6px solid #10b981' },
    actionBtn: { padding: '14px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '24px' },
    statBox: { background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8e0' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '8px' },
    badge: { fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Ward A Command Center</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>AI-Driven Inflow Monitoring</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Occupancy</p>
          <span style={{ fontSize: '24px', fontWeight: '800', color: occupancyRate > 90 ? '#ef4444' : '#0f172a' }}>{loadingStats ? '...' : `${occupancyRate}%`}</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        <div style={{ gridColumn: 'span 8' }}>
          
          {/* AI NOTIFICATION (UPDATED FOR WARD + SURGE BREAKDOWN) */}
          <div style={{ ...styles.card, ...styles.notificationCard }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BellRing size={22} color={totalIncoming > 0 ? '#ea580c' : '#10b981'} />
              {totalIncoming > 0 ? "Admission Plan: Active Transfers" : "Status: No Pending Admissions"}
            </h2>

            {loadingAI ? (
              <div style={{ padding: '40px', textAlign: 'center' }}><Loader className="animate-spin" size={32} /></div>
            ) : totalIncoming > 0 ? (
              <div style={{ marginTop: '24px', display: 'flex', gap: '24px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #fed7aa' }}>
                <div style={{ textAlign: 'center', paddingRight: '24px', borderRight: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#9a3412', textTransform: 'uppercase' }}>Total Inbound</p>
                  <p style={{ fontSize: '48px', fontWeight: '800', color: '#ea580c' }}>{totalIncoming}</p>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6' }}>WARD BEDS</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#1e40af' }}>{incomingWardCount}</p>
                    </div>
                    <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#d97706' }}>SURGE BEDS</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#9a3412' }}>{incomingSurgeCount}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                    ETU Optimization requires <strong>{incomingWardCount} regular ward beds</strong> and <strong>{incomingSurgeCount} surge area beds</strong> for incoming stable patients.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button disabled={isCritical} style={{ ...styles.actionBtn, background: isCritical ? '#94a3b8' : '#0f172a', color: 'white', flex: 1 }}>
                      {isCritical ? 'Capacity Exceeded' : 'Prepare All Beds'} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#15803d' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 12px' }} />
                <p>Ward A is currently optimized. No transfers required.</p>
              </div>
            )}
          </div>

          {/* STATS OVERVIEW */}
          <div style={styles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Ward Availability</h3>
            <div style={styles.statGrid}>
              <div style={styles.statBox}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>WARD CAPACITY</span>
                <p style={styles.statValue}>{wardData.capacity}</p>
              </div>
              <div style={styles.statBox}>
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>AVAILABLE WARD</span>
                <p style={{ ...styles.statValue, color: '#10b981' }}>{wardData.available}</p>
              </div>
              <div style={{ ...styles.statBox, background: surgeCount > 0 ? '#fffbeb' : '#f8fafc', border: surgeCount > 0 ? '1px solid #f59e0b' : '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px', color: '#d97706', fontWeight: '600' }}>ACTIVE SURGE</span>
                <p style={{ ...styles.statValue, color: '#d97706' }}>{surgeCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ gridColumn: 'span 4' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '20px' }}>Risk Assessment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b' }}>
                  <AlertTriangle size={18} />
                  <span style={{ fontWeight: '700' }}>{alerts.outbreak.disease}</span>
                </div>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>{alerts.outbreak.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ward_A_NurseDashboard;