import React, { useState } from 'react';
import { Save, X, Bed, CheckCircle } from 'lucide-react';
// Layout is provided by the route; do not wrap pages in the layout again.
import styles from './ETU_NurseAddBed.module.css';

const ETU_NurseAddBed = () => {
  const [formData, setFormData] = useState({
    bedId: '',
    type: 'Standard Bed',
    status: 'Available',
    notes: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // API Call would go here
    console.log("Saving Asset:", formData);
    
    // Simulate Success
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setFormData({ bedId: '', type: 'Standard Bed', status: 'Available', notes: '' });
  };

  return (
    <div className={styles.container}>
        
        {/* --- HEADER --- */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Add New Asset</h1>
            <p className={styles.subtitle}>Register a new physical bed or stretcher into the ETU system.</p>
          </div>
        </div>

        {/* --- FORM CARD --- */}
        <div className={styles.card}>
          
          {isSuccess && (
            <div className={styles.successMessage}>
              <CheckCircle size={20} />
              <span>Asset saved successfully! Inventory updated.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.grid}>
              
              {/* Field: Bed ID */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Bed / Asset ID</label>
                <div className={styles.inputIconWrap}>
                  <Bed size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. BED-21"
                    className={styles.input}
                    value={formData.bedId}
                    onChange={(e) => setFormData({...formData, bedId: e.target.value})}
                  />
                </div>
                <span className={styles.helper}>Must match the physical barcode tag.</span>
              </div>

              {/* Field: Bed Type */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Asset Type</label>
                <select 
                  className={styles.select}
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Standard Bed">Standard Bed (Observation)</option>
                  <option value="Trauma Bed">Trauma Bed (Resus)</option>
                  <option value="Stretcher">Stretcher (Triage)</option>
                  <option value="Neg. Pressure">Negative Pressure (Isolation)</option>
                </select>
                <span className={styles.helper}>Determines which patients can be assigned here.</span>
              </div>

              {/* Field: Initial Status */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Initial Status</label>
                <select 
                  className={styles.select}
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Available">Available (Ready for Patient)</option>
                  <option value="Maintenance">Maintenance (Out of Order)</option>
                  <option value="Cleaning">Cleaning (Dirty)</option>
                </select>
              </div>

              {/* Field: Notes */}
              <div className={styles.formGroup} style={{gridColumn: '1 / -1'}}>
                <label className={styles.label}>Operational Notes</label>
                <textarea 
                  rows="3"
                  placeholder="e.g. Located near Nurse Station B, requires oxygen hookup..."
                  className={styles.textarea}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button type="button" className={styles.btnCancel} onClick={() => window.history.back()}>
                <X size={18} /> Cancel
              </button>
              <button type="submit" className={styles.btnSave}>
                <Save size={18} /> Save Asset
              </button>
            </div>
          </form>
        </div>

      </div>
  );
};

export default ETU_NurseAddBed;