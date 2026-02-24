import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Bed } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ETU_NurseInventory.module.css';

const ETU_NurseInventory = () => {
  // --- MOCK DATA: 20 ETU Beds (No Zone info needed) ---
  const [beds] = useState([
    { id: 'BED-01', type: 'Trauma Bed', status: 'Occupied', patient: 'P-1094' },
    { id: 'BED-02', type: 'Trauma Bed', status: 'Occupied', patient: 'P-1098' },
    { id: 'BED-03', type: 'Trauma Bed', status: 'Available', patient: '-' },
    { id: 'BED-04', type: 'Stretcher', status: 'Occupied', patient: 'P-1102' },
    { id: 'BED-05', type: 'Stretcher', status: 'Occupied', patient: 'P-1105' },
    { id: 'BED-06', type: 'Stretcher', status: 'Available', patient: '-' },
    { id: 'BED-07', type: 'Standard Bed', status: 'Occupied', patient: 'P-1055' },
    { id: 'BED-08', type: 'Standard Bed', status: 'Cleaning', patient: '-' },
    { id: 'BED-09', type: 'Standard Bed', status: 'Occupied', patient: 'P-1089' },
    { id: 'BED-10', type: 'Standard Bed', status: 'Available', patient: '-' },
    { id: 'BED-11', type: 'Neg. Pressure', status: 'Occupied', patient: 'P-1090' },
    { id: 'BED-12', type: 'Neg. Pressure', status: 'Maintenance', patient: '-' },
    // ... assume up to 20 beds
  ]);

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  // --- FILTER LOGIC ---
  const filteredBeds = beds.filter(bed => {
    // 1. Search (ID or Patient)
    const matchesSearch = 
      bed.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bed.patient.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status Filter
    const matchesStatus = filterStatus === 'All Statuses' || bed.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.container}>
        
        {/* --- HEADER --- */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Real-Time Bed Status</h1>
              <p className={styles.subtitle}>Physical asset tracking (Total Capacity: 20)</p>
            </div>
            <Link to="/ETU_Nurse/dashboard/ETU_NurseAddBed" className={styles.addBtn} aria-label="Add new bed">
              <Plus size={18} />
              <span>Add New Bed</span>
            </Link>
          </div>
        </div>

        {/* --- CONTROLS --- */}
        <div className={styles.controls} role="region" aria-label="Inventory filters">
          
          {/* Search */}
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search ID or Patient..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter Only (Zone filter removed) */}
          <select 
            className={styles.select} 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        {/* --- TABLE --- */}
        <div className={styles.tableCard}>
          <table>
            <thead>
              <tr>
                <th>Bed ID</th>
                <th>Bed Type</th>
                <th>Patient ID</th>
                <th>Status</th>
                <th className={styles.actionsCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeds.length > 0 ? (
                filteredBeds.map((bed, index) => (
                  <tr key={index}>
                    <td className={styles.bedIdCell}>
                      <Bed size={16} className={styles.bedIcon} />
                      {bed.id}
                    </td>
                    <td className={styles.textCell}>{bed.type}</td>
                    <td className={styles.monoCell}>{bed.patient}</td>
                    <td>
                      <StatusBadge status={bed.status} />
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.iconBtn} aria-label="More options">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    No beds found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div className={styles.pagination}>
            <span>Showing {filteredBeds.length} of {beds.length} beds</span>
            <div className={styles.pageGroup}>
              <button className={styles.pageBtn} disabled>Previous</button>
              <button className={styles.pageBtn}>Next</button>
            </div>
          </div>
        </div>
      </div>
  );
};

// --- STATUS BADGE ---
const StatusBadge = ({ status }) => {
  const map = {
    Available: 'badgeAvailable',
    Occupied: 'badgeOccupied',
    Cleaning: 'badgeCleaning',
    Maintenance: 'badgeMaintenance'
  };

  const cls = styles[map[status] || 'badgeDefault'];
  
  return (
    <span className={`${styles.badge} ${cls}`}>
      {status}
    </span>
  );
};

export default ETU_NurseInventory;