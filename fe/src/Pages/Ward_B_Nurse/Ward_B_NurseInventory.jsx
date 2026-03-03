import React, { useState, useEffect } from 'react';
import { 
  Bed, 
  Activity, 
  Users, 
  Stethoscope, 
  ChevronRight, 
  X, 
  CheckCircle, 
  Search,
  Plus,
  Wrench,
  Loader,
  Edit2,
  AlertTriangle
} from 'lucide-react';

const Ward_B_NurseInventory = () => {
  const [selectedWard, setSelectedWard] = useState(null);
  const [allBeds, setAllBeds] = useState([]); // Stores DB Data
  const [loading, setLoading] = useState(true);

  // --- 1. CONFIGURATION: ALL WARDS ---
  const wardConfig = [
    { id: 'ETU', name: 'Emergency Treatment Unit', icon: Activity, color: '#ef4444' },
    { id: 'WARD-A', name: 'Ward A (Medical)', icon: Stethoscope, color: '#3b82f6' },
    { id: 'WARD-B', name: 'Ward B (Surgical)', icon: Bed, color: '#10b981' },
    { id: 'GEN', name: 'General Ward', icon: Users, color: '#f59e0b' }
  ];

  // --- 2. FETCH REAL DATA FROM DB ---
  const fetchBeds = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/get-beds');
      if (response.ok) {
        const data = await response.json();
        setAllBeds(data);
      } else {
        console.error("Failed to fetch beds");
      }
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* --- HEADER --- */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>Bed Asset Management</h1>
        <p style={{ color: '#64748b', marginTop: 8 }}>Real-time inventory from database.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          <Loader className="animate-spin" style={{ margin: '0 auto 10px' }} />
          Loading Bed Data...
        </div>
      ) : (
        /* --- WARD CARDS GRID --- */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {wardConfig.map((ward) => {
            const Icon = ward.icon;
            
            // --- 3. DYNAMIC CALCULATION ---
            const wardBeds = allBeds.filter(bed => bed.ward_id === ward.id);
            const totalCount = wardBeds.length;
            const functionalCount = wardBeds.filter(bed => bed.status === 'Functional').length;
            
            const percentFunctional = totalCount > 0 
              ? Math.round((functionalCount / totalCount) * 100) 
              : 0;

            return (
              <div 
                key={ward.id} 
                onClick={() => setSelectedWard({ ...ward, beds: wardBeds })} 
                style={{ 
                  background: 'white', 
                  borderRadius: 20, 
                  padding: 24, 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
                  cursor: 'pointer', 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: ward.color }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ background: `${ward.color}15`, padding: 12, borderRadius: 12 }}>
                    <Icon size={28} color={ward.color} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{functionalCount}</span>
                    <span style={{ fontSize: 14, color: '#64748b' }}> / {totalCount} Usable</span>
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{ward.name}</h3>
                <p style={{ fontSize: 13, color: '#64748b' }}>Inventory Status</p>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: 8, background: '#fee2e2', borderRadius: 99, marginTop: 16 }}>
                  <div style={{ width: `${percentFunctional}%`, height: '100%', background: '#10b981', borderRadius: 99, transition: 'width 0.5s' }}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
                  <span style={{ color: totalCount > 0 ? '#10b981' : '#94a3b8' }}>{percentFunctional}% Functional</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: ward.color }}>
                    Manage Beds <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- BED DETAILS MODAL --- */}
      {selectedWard && (
        <BedDetailsModal 
          ward={selectedWard} 
          onClose={() => setSelectedWard(null)} 
          onUpdate={fetchBeds} 
        />
      )}

    </div>
  );
};

// --- SUB-COMPONENT: BED DETAILS MODAL ---
const BedDetailsModal = ({ ward, onClose, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [beds, setBeds] = useState(ward.beds || []); 
  const [isAddingBed, setIsAddingBed] = useState(false);
  const [confirmingBed, setConfirmingBed] = useState(null);

  const [newBedId, setNewBedId] = useState('');
  const [newBedType, setNewBedType] = useState('Standard Hospital Bed');
  const [isSaving, setIsSaving] = useState(false);

  // Permission Check: Only Ward B is authorized
  const isAuthorized = ward.id === 'WARD-B';

  useEffect(() => {
    setBeds(ward.beds || []);
  }, [ward.beds]);

  // --- ADD BED ---
  const handleSaveBed = async () => {
    if(!newBedId) return alert("Please enter a Bed ID");
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5001/api/add-bed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bed_id: newBedId,
          bed_type: newBedType,
          ward_id: ward.id,
          ward_name: ward.name
        })
      });
      if (response.ok) {
        alert("✅ Bed Saved!");
        setNewBedId('');
        setIsAddingBed(false);
        onUpdate(); 
        setBeds(prev => [...prev, { bed_id: newBedId, bed_type: newBedType, status: 'Functional' }]);
      } else {
        const res = await response.json();
        alert(`❌ Error: ${res.error}`);
      }
    } catch (error) { console.error(error); alert("Connection Failed"); } 
    finally { setIsSaving(false); }
  };

  // --- UPDATE STATUS ---
  const executeUpdateStatus = async () => {
    if (!confirmingBed) return;
    const newStatus = confirmingBed.status === 'Functional' ? 'Broken' : 'Functional';
    
    setBeds(prev => prev.map(b => b.bed_id === confirmingBed.bed_id ? { ...b, status: newStatus } : b));
    setConfirmingBed(null);

    try {
      await fetch('http://localhost:5001/api/update-bed-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bed_id: confirmingBed.bed_id, status: newStatus })
      });
      onUpdate(); 
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to save status change.");
      setBeds(prev => prev.map(b => b.bed_id === confirmingBed.bed_id ? { ...b, status: confirmingBed.status } : b));
    }
  };

  const filteredBeds = beds.filter(b => 
    b.bed_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 
    }}>
      <div style={{ 
        background: 'white', width: '90%', maxWidth: 1000, height: '85vh', 
        borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>{ward.name}</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>Inventory Management</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            
            {/* --- CONDITIONALLY RENDER ADD BUTTON --- */}
            {isAuthorized && (
              <button onClick={() => setIsAddingBed(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={18} /> Add New Bed
              </button>
            )}

            <button onClick={onClose} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10, cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Search Bed ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc' }}>
          {filteredBeds.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {filteredBeds.map((bed) => (
                <BedCard 
                  key={bed.bed_id} 
                  bed={bed} 
                  canEdit={isAuthorized} // Pass permission to child
                  onEdit={() => setConfirmingBed(bed)} 
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
              <Bed size={48} style={{ opacity: 0.2, marginBottom: 10 }} />
              <p>No beds found for this ward.</p>
            </div>
          )}
        </div>

        {/* Add Bed Popup */}
        {isAddingBed && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
            <div style={{ width: 400, background: 'white', padding: 32, borderRadius: 24, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Register New Bed</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Bed ID</label>
                  <input type="text" value={newBedId} onChange={(e) => setNewBedId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Type</label>
                  <select value={newBedType} onChange={(e) => setNewBedType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                    <option>Standard Hospital Bed</option>
                    <option>Trauma / ICU Bed</option>
                    <option>Surgical Bed</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button onClick={() => setIsAddingBed(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1', background: 'white' }}>Cancel</button>
                  <button onClick={handleSaveBed} disabled={isSaving} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: '#0f172a', color: 'white', fontWeight: 600 }}>{isSaving ? 'Saving...' : 'Save Bed'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Popup */}
        {confirmingBed && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
            <div style={{ width: 380, background: 'white', padding: 24, borderRadius: 20, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Change Bed Status?</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
                Mark <strong>{confirmingBed.bed_id}</strong> as 
                <span style={{ fontWeight: 700, color: confirmingBed.status === 'Functional' ? '#dc2626' : '#16a34a' }}>
                  {confirmingBed.status === 'Functional' ? ' Broken' : ' Functional'}
                </span>?
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setConfirmingBed(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={executeUpdateStatus} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#dc2626', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Yes, Change It</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- BED CARD ---
const BedCard = ({ bed, onEdit, canEdit }) => {
  const isWorking = bed.status === 'Functional';
  const statusColor = isWorking ? '#10b981' : '#ef4444'; 
  const statusBg = isWorking ? '#ecfdf5' : '#fef2f2';    
  const Icon = isWorking ? CheckCircle : Wrench;
  const statusText = isWorking ? 'Functional' : 'Broken';

  return (
    <div style={{ 
      border: `1px solid ${isWorking ? '#e2e8f0' : '#fecaca'}`, 
      borderRadius: 16, padding: 16, background: 'white',
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, color: '#334155', fontSize: 16 }}>{bed.bed_id}</span>
        
        {/* --- CONDITIONALLY RENDER EDIT BUTTON --- */}
        {canEdit && (
          <button 
            onClick={onEdit}
            title="Edit Status"
            style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', 
              padding: 4, borderRadius: 6, color: '#94a3b8',
              transition: 'background 0.2s, color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
      
      <div>
        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Type</p>
        <p style={{ margin: 0, fontSize: 13, color: '#475569', fontWeight: 500 }}>{bed.bed_type}</p>
      </div>

      <div style={{ marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6, background: statusBg, width: 'fit-content' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }}></div>
          <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Ward_B_NurseInventory;