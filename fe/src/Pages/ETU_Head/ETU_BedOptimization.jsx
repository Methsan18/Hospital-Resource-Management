import React, { useState } from 'react';
import { 
  CloudRain, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  BedDouble,
  Calendar,
  Activity
} from 'lucide-react';
import styles from './ETU_BedOptimization.module.css';

const ETU_BedOptimization = () => {
  // --- MOCK DATA ---
  // Scenario: 0 Patients Expected
  // Logic: 
  // - 7 Stay (Observation)
  // - 13 Transfer (4 Pending + 9 New)
  // - 9 Surge (Overflow)
  const forecastData = {
    date: '2025-12-31',
    shift: 'Night Shift',
    expectedPatients: 20,
    capacity: 20,
    driver: 'Heavy Rainfall Alert', 
    driverIcon: CloudRain,
    confidence: 'High (92%)'
  };

  const actionPlan = {
    keepInETU: 10, // Matches "Keep in ETU" on Dashboard
    transfers: [
      { ward: 'Ward A (Medical)', count: 4, type: 'Internal' }, // Matches "4 Pending Transfers" on Dashboard
      { ward: 'Ward B (Surgical)', count: 2, type: 'Internal' },
      
    ],
    surge: 4 // The remaining overflow
  };

  const [isApproved, setIsApproved] = useState(false);

  return (
      <div className={styles.container}>
        
        {/* --- HEADER --- */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Daily Command Sheet</h1>
            <p className={styles.subtitle}>
              <Calendar size={14} style={{display:'inline', marginRight:4}}/> 
              {forecastData.date} • {forecastData.shift}
            </p>
          </div>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            MILP Solution Ready
          </div>
        </div>

        <div className={styles.grid}>
          
          {/* --- LEFT PANEL: THE FORECAST (Context) --- */}
          <section className={styles.forecastCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Forecast Context (TFT Model)</h3>
            </div>
            
            <div className={styles.bigNumberContainer}>
              <span className={styles.label}>Expected Total Patients</span>
              <div className={styles.bigNumber}>{forecastData.expectedPatients}</div>
              <span className={styles.subLabel}>vs. 50 Bed Capacity</span>
            </div>

            <div className={styles.driverBox}>
              <h4 className={styles.driverTitle}>Primary Driver Identified:</h4>
              <div className={styles.driverContent}>
                <forecastData.driverIcon size={24} className={styles.driverIcon} />
                <span>{forecastData.driver}</span>
              </div>
              <p className={styles.driverDesc}>
                Historical data shows a <strong>35% surge</strong> in admissions during similar weather patterns.
              </p>
            </div>

            <div className={styles.confidenceBox}>
              AI Confidence: <strong>{forecastData.confidence}</strong>
            </div>
          </section>

          {/* --- RIGHT PANEL: THE ACTION PLAN (MILP Solution) --- */}
          <section className={styles.actionCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recommended Action Plan (MILP)</h3>
            </div>

            <div className={styles.planList}>
              
              {/* Step 1: Retention */}
              <div className={styles.planItem}>
                <div className={styles.planIconGreen}>
                  <BedDouble size={20} />
                </div>
                <div className={styles.planDetails}>
                  <h4>1. Keep in ETU</h4>
                  <p>Retain stable patients for observation.</p>
                </div>
                <div className={styles.planCountGreen}>{actionPlan.keepInETU}</div>
              </div>

              {/* Step 2: Transfers (The List) */}
              <div className={styles.planItem}>
                <div className={styles.planIconBlue}>
                  <ArrowRight size={20} />
                </div>
                <div className={styles.planDetails}>
                  <h4>2. Internal Transfers</h4>
                  <p>Move to General Wards (Confirmed Availability)</p>
                  <ul className={styles.transferList}>
                    {actionPlan.transfers.map((t, i) => (
                      <li key={i}>
                        <span>{t.ward}</span>
                        <strong>{t.count.toString().padStart(2, '0')}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Total Transfers Count */}
                <div className={styles.planCountBlue}>
                  {actionPlan.transfers.reduce((a,b) => a + b.count, 0)}
                </div>
              </div>

              {/* Step 3: Surge (Critical) */}
              {actionPlan.surge > 0 && (
                <div className={styles.surgeBox}>
                  <div className={styles.surgeHeader}>
                    <AlertTriangle size={20} />
                    <h4>3. CRITICAL: Open Surge Beds</h4>
                  </div>
                  <div className={styles.surgeContent}>
                    <p>Activate Corridor C Protocols immediately.</p>
                    <div className={styles.surgeCount}>{actionPlan.surge.toString().padStart(2, '0')}</div>
                  </div>
                </div>
              )}

            </div>

            <div className={styles.actionFooter}>
              {isApproved ? (
                <button className={styles.btnApproved} disabled>
                  <CheckCircle size={18} /> Plan Activated
                </button>
              ) : (
                <button className={styles.btnApprove} onClick={() => setIsApproved(true)}>
                  Approve Allocation Plan
                </button>
              )}
            </div>
          </section>

        </div>
      </div>
  );
};

export default ETU_BedOptimization;