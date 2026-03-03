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
  Tent
} from 'lucide-react';

const Ward_G_NurseDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [wardData, setWardData] = useState({
    capacity: 0,   
    occupancy: 0, 
    available: 0   
  });

  const [surgeCount, setSurgeCount] = useState(0); 
  const [incomingWardCount, setIncomingWardCount] = useState(0); // Regular arrivals
  const [incomingSurgeCount, setIncomingSurgeCount] = useState(0); // Surge arrivals
  const [loadingAI, setLoadingAI] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- MOCK ALERTS ---
  const alerts = {
    weather: { condition: "Heavy Rain", impact: "High risk of road accidents & slip/fall cases." },
    outbreak: { disease: "Seasonal Flu", status: "Moderate", note: "Respiratory ward admissions rising by 15%." }
  };

  // --- 1. FETCH WARD REAL-TIME STATUS (GENERAL WARD) ---
  useEffect(() => {
    const fetchWardStatus = async () => {
      try {
        setLoadingStats(true);
        // Fetch standard bed stats
        const responseStats = await fetch('http://localhost:5001/api/ward-status/GEN');
        if (responseStats.ok) {
          const data = await responseStats.json();
          setWardData({ 
            capacity: data.capacity, 
            available: data.available, 
            occupancy: data.occupied 
          });
        }
        
        // Fetch active surge count specifically for General Ward
        const responseSurge = await fetch('http://localhost:5001/api/get-history?type=SurgeUpdate&ward=GEN');
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

  // --- 2. FETCH AI OPTIMIZATION PLAN ---
  useEffect(() => {
    const fetchAIPlan = async () => {
      try {
        setLoadingAI(true);
        const res = await fetch('http://localhost:5001/predict'); 
        if (res.ok) {
          const data = await res.json();
          // regular arrivals for GEN
          if (data.action_plan_transfers) {
            setIncomingWardCount(data.action_plan_transfers.general || 0);
          }
          // surge arrivals for GEN
          if (data.action_plan_surge_breakdown) {
            setIncomingSurgeCount(data.action_plan_surge_breakdown.general || 0);
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
    actionBtn: { padding: '14px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '24px' },
    statBox: { background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '8px' },
    statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>General Ward Command Center</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Live Capacity & Patient Flow Monitoring</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Live Occupancy</p>
          <span style={{ fontSize: '24px', fontWeight: '800', color: occupancyRate > 90 ? '#ef4444' : '#0f172a' }}>{loadingStats ? '...' : `${occupancyRate}%`}</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        <div style={{ gridColumn: 'span 8' }}>
          
          {/* AI NOTIFICATION (WARD + SURGE BREAKDOWN) */}
          <div style={{ ...styles.card, ...styles.notificationCard }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BellRing size={22} color={totalIncoming > 0 ? '#ea580c' : '#10b981'} />
              {totalIncoming > 0 ? "Optimization Plan: Incoming Transfers" : "Optimization Status: Clear"}
            </h2>

            {loadingAI ? (
              <div style={{ padding: '40px', textAlign: 'center' }}><Loader className="animate-spin" size={32} color="#3b82f6" /></div>
            ) : totalIncoming > 0 ? (
              <div style={{ marginTop: '24px', display: 'flex', gap: '24px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #fed7aa', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.05)' }}>
                <div style={{ textAlign: 'center', paddingRight: '24px', borderRight: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#9a3412', textTransform: 'uppercase' }}>Incoming</p>
                  <p style={{ fontSize: '48px', fontWeight: '800', color: '#ea580c' }}>{totalIncoming}</p>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#b45309' }}>WARD BEDS</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#92400e' }}>{incomingWardCount}</p>
                    </div>
                    <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#c2410c' }}>SURGE BEDS</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#9a3412' }}>{incomingSurgeCount}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                    AI identifies <strong>{incomingWardCount} stable patients</strong> for standard beds and <strong>{incomingSurgeCount} patients</strong> for the surge area.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button disabled={isCritical} style={{ ...styles.actionBtn, background: isCritical ? '#94a3b8' : '#0f172a', color: 'white', flex: 1 }}>
                      {isCritical ? 'Capacity Full' : 'Accept & Prepare Beds'} <ArrowRight size={18} />
                    </button>
                    <button style={{ ...styles.actionBtn, background: 'white', border: '1px solid #cbd5e1', color: '#475569' }}>Defer</button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', padding: '32px', borderRadius: '16px', border: '1px solid #dcfce7', textAlign: 'center', marginTop: '16px' }}>
                <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#166534', fontWeight: '500' }}>General Ward is optimized. No immediate actions required.</p>
              </div>
            )}
          </div>

          {/* CAPACITY STATS */}
          <div style={styles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Current Capacity breakdown</h3>
            <div style={styles.statGrid}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Total Registered</span>
                <p style={styles.statValue}>{wardData.capacity}</p>
              </div>
              <div style={styles.statBox}>
                <span style={{ ...styles.statLabel, color: '#10b981' }}>Standard Available</span>
                <p style={{ ...styles.statValue, color: '#10b981' }}>{wardData.available}</p>
              </div>
              <div style={{ ...styles.statBox, background: surgeCount > 0 ? '#fffbeb' : '#f8fafc', border: surgeCount > 0 ? '1px solid #f59e0b' : '1px solid #e2e8f0' }}>
                <span style={{ ...styles.statLabel, color: '#d97706' }}>Active Surge</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ ...styles.statValue, color: '#d97706' }}>{surgeCount}</p>
                  <Tent size={24} color={surgeCount > 0 ? '#f59e0b' : '#94a3b8'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RISK PANEL */}
        <div style={{ gridColumn: 'span 4' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '20px' }}>External Factors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <CloudRain size={20} color="#3b82f6" />
                  <span style={{ fontWeight: '800', color: '#1e40af' }}>Rainy Condition</span>
                </div>
                <p style={{ fontSize: '13px', color: '#334155' }}>{alerts.weather.impact}</p>
              </div>
              <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <span style={{ fontWeight: '800', color: '#991b1b' }}>Outbreak Risk</span>
                </div>
                <p style={{ fontSize: '13px', color: '#7f1d1d' }}>{alerts.outbreak.note}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Ward_G_NurseDashboard;