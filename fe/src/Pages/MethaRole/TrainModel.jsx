import React, { useState } from 'react';
import { CheckCircle, Database, FileText } from 'lucide-react';

const TrainModel = () => {
  // Enhanced State to match your Dataset + Research Requirements
  const [formData, setFormData] = useState({
    date: '',              // Matches 'Date' in CSV
    disease: '',           // Matches 'Disease_or_Injury' in CSV
    severity: 'Medium',    // Matches 'Severity' in CSV
    cases: '',             // Matches 'Case_Count' in CSV
    department: 'OPD',     // Matches 'Department' in CSV
    ageGroup: 'All Ages',  // Research Value (Enrichment)
    granularity: 'Weekly'  // Aggregation logic
  });

  const [isTraining, setIsTraining] = useState(false);
  const [trainResult, setTrainResult] = useState(null);

  // Derived from your CSV values
  const departments = ['OPD', 'Medical Ward', 'Emergency', 'ICU', 'Pediatrics'];
  const severityLevels = ['Low', 'Medium', 'High'];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrainModel = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.date || !formData.disease || !formData.cases) {
      alert('Please fill in required fields from your dataset (Date, Disease, Cases)');
      return;
    }

    // Simulate Training Process
    setIsTraining(true);
    setTrainResult(null);

    setTimeout(() => {
      setIsTraining(false);
      setTrainResult({
        success: true,
        accuracy: (89 + Math.random() * 5).toFixed(2),
        timestamp: new Date().toLocaleString(),
        features_used: ['Date', 'Disease', 'Severity', 'Rainfall_mm (Auto)', 'Temp_C (Auto)'],
        status: 'Dataset merged & model retrained successfully'
      });
    }, 2500);
  };

  return (
    <div style={{ padding: 28, maxWidth: 1000, margin: '24px auto', color: '#0f172a', fontFamily: 'sans-serif' }}>
        
        {/* Header */}
        <div style={{
          background: '#0b2a5b',
          color: '#fff',
          padding: 24,
          borderRadius: 16,
          marginBottom: 32,
          boxShadow: '0 10px 30px rgba(11, 42, 91, 0.15)'
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Model Retraining & Data Input</h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.85, fontSize: 15 }}>
            Feed new records matching your 10k Hospital Dataset schema
          </p>
        </div>

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          
          {/* Left Column: Input Form */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            padding: 32
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <Database size={20} color="#0b2a5b" />
              <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>
                Manual Data Entry
              </h2>
            </div>

            <form onSubmit={handleTrainModel}>
              <div style={{ display: 'grid', gap: 20 }}>

                {/* Row 1: Date & Severity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Date <span style={{color:'#ef4444'}}>*</span></label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Severity <span style={{color:'#ef4444'}}>*</span></label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      {severityLevels.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Disease Only (Removed ICD-10) */}
                <div>
                  <label style={labelStyle}>Disease / Injury Name <span style={{color:'#ef4444'}}>*</span></label>
                  <input
                    type="text"
                    name="disease"
                    value={formData.disease}
                    onChange={handleInputChange}
                    placeholder="e.g. Dengue, Burn Injury"
                    style={inputStyle}
                  />
                </div>

                {/* Row 3: Cases & Department */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Case Count <span style={{color:'#ef4444'}}>*</span></label>
                    <input
                      type="number"
                      name="cases"
                      value={formData.cases}
                      onChange={handleInputChange}
                      placeholder="e.g. 26"
                      min="0"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Department <span style={{color:'#ef4444'}}>*</span></label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                 {/* Row 4: Age Group & Granularity */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Age Group</label>
                    <select
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option>All Ages</option>
                      <option>Pediatric (&lt;5)</option>
                      <option>Adult (18-60)</option>
                      <option>Senior (60+)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Context</label>
                    <select
                      name="granularity"
                      value={formData.granularity}
                      onChange={handleInputChange}
                      style={{...inputStyle, color: '#64748b'}}
                      disabled
                    >
                      <option>Weekly (Auto-calculated)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: 12 }}>
                  <button
                    type="submit"
                    disabled={isTraining}
                    style={{
                      width: '100%',
                      background: isTraining ? '#94a3b8' : '#0b2a5b',
                      color: '#fff',
                      padding: '14px',
                      borderRadius: 10,
                      border: 'none',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: isTraining ? 'wait' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 10
                    }}
                  >
                    {isTraining ? 'Integrating Dataset...' : '+ Commit Record to Model'}
                  </button>
                </div>

              </div>
            </form>
          </div>

          {/* Right Column: Dataset Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Success Card */}
            {trainResult && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: 16,
                padding: 20,
                animation: 'fadeIn 0.5s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <CheckCircle size={24} color="#16a34a" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#15803d' }}>Training Successful</span>
                </div>
                <div style={{ fontSize: 14, color: '#166534', lineHeight: 1.6 }}>
                  <p style={{margin: '4px 0'}}>New Model Accuracy: <strong>{trainResult.accuracy}%</strong></p>
                  <p style={{margin: '4px 0', fontSize: 13}}>
                    Features: <em>{trainResult.features_used.join(', ')}</em>
                  </p>
                </div>
              </div>
            )}

            {/* Dataset Metadata Card */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
            }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <FileText size={20} color="#ea580c" />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#9a3412' }}>Dataset Compatibility</span>
                </div>
                <ul style={{ fontSize: 13, color: '#475569', margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                  <li><strong>Rainfall & Temp:</strong> Automatically fetched based on the <em>Date</em> to match your training set features.</li>
                  <li><strong>Severity:</strong> Added to improve triage prediction accuracy.</li>
                  <li><strong>Week Number:</strong> Auto-derived from Date (e.g., Week 48).</li>
                </ul>
            </div>

            {/* Active Model Stats */}
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Training Set Size</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>10,042 Records</div>
              <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Linked to: Hospital_Illness_Injury_10k</div>
            </div>

          </div>
        </div>
      </div>
   
    
  );
};

// Internal styles
const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#475569',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.02em'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: 15,
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  backgroundColor: '#fff'
};

export default TrainModel;