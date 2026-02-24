import React, { useState } from 'react';
import { ClipboardList, Calendar, Clock, Save, RotateCcw } from 'lucide-react';
// Layout is provided by the route; do not wrap pages in the layout again.
import styles from './ETU_NurseDailyInput.module.css';

const ETU_NurseDailyInput = () => {
  // State for Date & Shift
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState('Morning Shift (07:00 - 13:00)');
  
  // State for Data (Single ETU Row)
  const [data, setData] = useState({
    admissions: 0, 
    discharges: 0, 
    transfersOut: 0, 
    deaths: 0 
  });

  // Helper to update fields
  const updateField = (field, value) => {
    // Ensure non-negative numbers
    const numValue = Math.max(0, Number(value) || 0);
    setData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleClear = () => {
    if(window.confirm("Are you sure you want to clear the form?")) {
      setData({ admissions: 0, discharges: 0, transfersOut: 0, deaths: 0 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting ETU Shift Data:', { date, shift, data });
    alert(`Data saved for ${shift} on ${date}.\nTotal Arrivals: ${data.admissions}`);
  };

  return (
    <div className={styles.container}>
        
        {/* Page Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>ETU Shift Data Entry</h1>
            <p className={styles.subtitle}>Log total patient volume for the shift</p>
          </div>
          <div className={styles.badge}>
            <ClipboardList size={18} />
            <span>Manual Entry</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          
          {/* Controls Section */}
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <label className={styles.label} htmlFor="census-date">
                <Calendar size={14} /> Date
              </label>
              <input 
                id="census-date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className={styles.input} 
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label} htmlFor="shift-select">
                <Clock size={14} /> Shift
              </label>
              <select 
                id="shift-select"
                value={shift} 
                onChange={(e) => setShift(e.target.value)} 
                className={styles.select}
              >
                <option>Day Shift </option>
                <option>Night Shift </option>
              </select>
            </div>
          </div>

          {/* Data Entry Grid (Simplified) */}
          <div className={styles.gridInput}>
            
            <div className={styles.inputCard}>
              <label>New Arrivals</label>
              <input 
                type="number" 
                value={data.admissions || ''} 
                onChange={(e) => updateField('admissions', e.target.value)} 
                className={styles.bigInput} 
                placeholder="0"
              />
              <span className={styles.helperText}>Patients checked in at Triage</span>
            </div>

            <div className={styles.inputCard}>
              <label>Discharges (Home)</label>
              <input 
                type="number" 
                value={data.discharges || ''} 
                onChange={(e) => updateField('discharges', e.target.value)} 
                className={styles.bigInput} 
                placeholder="0"
              />
              <span className={styles.helperText}>Sent home from ETU</span>
            </div>

            <div className={styles.inputCard}>
              <label>Transfers Out (Ward)</label>
              <input 
                type="number" 
                value={data.transfersOut || ''} 
                onChange={(e) => updateField('transfersOut', e.target.value)} 
                className={styles.bigInput} 
                placeholder="0"
              />
              <span className={styles.helperText}>Admitted to Hospital Wards</span>
            </div>

            <div className={styles.inputCard}>
              <label className={styles.dangerLabel}>Deaths</label>
              <input 
                type="number" 
                value={data.deaths || ''} 
                onChange={(e) => updateField('deaths', e.target.value)} 
                className={`${styles.bigInput} ${styles.dangerInput}`} 
                placeholder="0"
              />
              <span className={styles.helperText}>Deceased in ETU</span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button type="button" onClick={handleClear} className={styles.btnGhost}>
              <RotateCcw size={16} /> Clear Form
            </button>
            <button type="submit" className={styles.btnPrimary}>
              <Save size={16} /> Submit Data
            </button>
          </div>
        </form>
      </div>
  );
};

export default ETU_NurseDailyInput;