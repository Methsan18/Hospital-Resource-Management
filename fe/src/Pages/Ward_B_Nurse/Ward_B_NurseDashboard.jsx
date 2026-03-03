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
  ArrowDownCircle 
} from 'lucide-react';

const Ward_B_NurseDashboard = () => {
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

  // --- 1. FETCH WARD REAL-TIME STATUS (WARD B) ---
  useEffect(() => {
    const fetchWardStatus = async () => {
      try {
        setLoadingStats(true);
        // Fetch standard bed metrics
        const responseStats = await fetch('http://localhost:5001/api/ward-status/WARD-B');
        if (responseStats.ok) {
          const data = await responseStats.json();
          setWardData({ 
            capacity: data.capacity, 
            available: data.available, 
            occupancy: data.occupied 
          });
        }
        
        // Fetch Surge Bed count specifically for Ward B
        const responseSurge = await fetch('http://localhost:5001/api/get-history?type=SurgeUpdate&ward=WARD-B');
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
          // Handling regular transfers for Ward B
          if (data.action_plan_transfers) {
            setIncomingWardCount(data.action_plan_transfers.ward_b || 0);
          }
          // Handling surge breakdown for Ward B
          if (data.action_plan_surge_breakdown) {
            setIncomingSurgeCount(data.action_plan_surge_breakdown.ward_b || 0);
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
    card: { background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', marginBottom: '24px', overflow: 'hidden' },
    notificationCard: { background: totalIncoming > 0 ? 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)' : 'white', borderLeft: totalIncoming > 0 ? '6px solid #f97316' : '6px solid #10b981' },
    actionBtn: { padding: '14px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '24px' },
    statBox: { background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '8px' },
    statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Ward B Command Center</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Surgical Ward Allocation Monitoring</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Occupancy</p>
          <span style={{ fontSize: '24px', fontWeight: '800', color: occupancyRate > 90 ? '#ef4444' : '#0f172a' }}>{loadingStats ? '...' : `${occupancyRate}%`}</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        <div style={{ gridColumn: 'span 8' }}>
          
          {/* AI NOTIFICATION (WARD + SURGE BREAKDOWN) */}
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
                    <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a' }}>SURGICAL BEDS</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#166534' }}>{incomingWardCount}</p>
                    </div>
                    <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#d97706' }}>SURGE AREA</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#9a3412' }}>{incomingSurgeCount}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                    The optimization plan allocates <strong>{incomingWardCount} standard beds</strong> and <strong>{incomingSurgeCount} surge area beds</strong> in Ward B for incoming patients.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button disabled={isCritical} style={{ ...styles.actionBtn, background: isCritical ? '#94a3b8' : '#0f172a', color: 'white', flex: 1 }}>
                      {isCritical ? 'Limit Reached' : 'Accept All Arrivals'} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#15803d' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 12px' }} />
                <p>Ward B is currently optimized. No transfers required.</p>
              </div>
            )}
          </div>

          {/* STATS OVERVIEW */}
          <div style={styles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Ward Capacity Status</h3>
            <div style={styles.statGrid}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Standard Capacity</span>
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

        {/* RIGHT COLUMN */}
        <div style={{ gridColumn: 'span 4' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '20px' }}>Risk Factors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <CloudRain size={20} color="#3b82f6" />
                  <span style={{ fontWeight: '800', color: '#1e40af' }}>{alerts.weather.condition}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#334155' }}>{alerts.weather.impact}</p>
              </div>
              <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <span style={{ fontWeight: '800', color: '#991b1b' }}>{alerts.outbreak.disease}</span>
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

export default Ward_B_NurseDashboard;