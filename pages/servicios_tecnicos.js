import { useEffect, useMemo, useState } from 'react'

// ==============================================================================
// ⚠️ INSTRUCCIONES PARA PRODUCCIÓN (VS CODE)
// 1. DESCOMENTA las líneas de abajo:
// import { useRouter } from 'next/router'
// import { supabase } from '../lib/supabase'
//
// 2. BORRA la sección "ZONA DE MOCKS" de abajo.
// ==============================================================================

// ==========================================
// 🛠️ ZONA DE MOCKS (SÓLO PARA VISTA PREVIA)
// ==========================================
const useRouter = () => ({
  push: (url) => console.log('Navegando a:', url)
})

const mockReparaciones = [
  { id: 1, cliente_nombre: 'Juan Pérez', cliente_telefono: '099123456', equipo_modelo: 'iPhone 11', falla: 'Pantalla rota, táctil no responde', estado: 'En Revisión', costo_estimado: 250, fecha_ingreso: new Date().toISOString().split('T')[0] },
  { id: 2, cliente_nombre: 'Maria Gomez', cliente_telefono: '098765432', equipo_modelo: 'Samsung A52', falla: 'No carga, puerto sucio', estado: 'Listo', costo_estimado: 80, fecha_ingreso: new Date(Date.now() - 172800000).toISOString().split('T')[0] },
  { id: 3, cliente_nombre: 'Carlos Ruiz', cliente_telefono: '091122334', equipo_modelo: 'Xiaomi Redmi Note 10', falla: 'Se reinicia solo', estado: 'Recibido', costo_estimado: 0, fecha_ingreso: new Date().toISOString().split('T')[0] },
]

const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: { id: 'mock' } } } }),
    onAuthStateChange: (cb) => { setTimeout(() => cb('SIGNED_IN', { user: { id: 'mock' } }), 500); return { data: { subscription: { unsubscribe: () => {} } } } },
    signInWithPassword: async () => ({ error: null }),
    signOut: async () => {},
  },
  from: (table) => ({
    select: () => ({ order: () => ({ limit: async () => ({ data: mockReparaciones, error: null }) }) }),
    insert: async () => ({ error: null }),
    update: () => ({ eq: async () => ({ error: null }) }),
    delete: () => ({ eq: async () => ({ error: null }) })
  })
}
// ==========================================
// FIN ZONA DE MOCKS
// ==========================================

// ==========================================
// 🎨 ESTILOS PREMIUM (CSS-IN-JS)
// ==========================================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#020617',
    color: '#e2e8f0',
    fontFamily: "'Inter', sans-serif",
    backgroundImage: `radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 20%)`,
    backgroundAttachment: 'fixed',
  },
  glassPanel: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
  goldText: {
    background: 'linear-gradient(to right, #F59E0B, #D97706)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '900',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'rgba(2, 6, 23, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  label: {
    display: 'block',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: '6px',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
    display: 'flex', alignItems: 'center', gap: '8px',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  btnIcon: {
    width: 'auto', 
    height: '40px',
    padding: '0 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  statCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  }
}

// ==========================================
// 🎨 ICONOS SVG (COMPLETOS)
// ==========================================
const Icons = {
  Logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Wrench: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Smartphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Headphones: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
  Chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Box: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Dollar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
}

// ==========================================
// COMPONENTES UI
// ==========================================

const StatCard = ({ label, value, subtext, color = '#F59E0B', icon }) => (
  <div style={styles.statCard}>
    <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.1, color: color }}>
      {icon}
    </div>
    <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label}</p>
    <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', margin: 0, lineHeight: 1 }}>{value}</h3>
    {subtext && <p style={{ fontSize: '0.8rem', color: color, marginTop: '8px', fontWeight: '500' }}>{subtext}</p>}
  </div>
)

const RepairCard = ({ rep, onCambiarEstado, onDelete }) => {
  const estadoColor = {
    'Recibido': '#94a3b8',
    'En Revisión': '#F59E0B',
    'Esperando Repuesto': '#f43f5e',
    'Listo': '#10b981',
    'Entregado': '#3b82f6'
  }

  return (
    <div style={{ ...styles.glassPanel, padding: '24px', position: 'relative', transition: 'transform 0.3s' }}
         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>ORDEN #{rep.id}</p>
          <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 'bold', margin: '4px 0' }}>{rep.equipo_modelo}</h3>
          <p style={{ color: '#F59E0B', fontSize: '0.95rem', fontWeight: '500' }}>{rep.falla}</p>
        </div>
        <div style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: `${estadoColor[rep.estado]}22`, color: estadoColor[rep.estado], border: `1px solid ${estadoColor[rep.estado]}44` }}>
          {rep.estado}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '25px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.User /><span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{rep.cliente_nombre}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Phone /><span>{rep.cliente_telefono}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ color: '#ef4444' }}>Costo: S/ {rep.costo_estimado}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Clock /><span>{new Date(rep.fecha_ingreso).toLocaleDateString()}</span></div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ ...styles.label, marginBottom: '6px' }}>Estado Actual:</label>
          <select 
            style={{ ...styles.input, padding: '10px', cursor: 'pointer', fontSize: '0.85rem' }} 
            value={rep.estado} 
            onChange={(e) => onCambiarEstado(rep.id, e.target.value)}
          >
            <option value="Recibido">Recibido</option>
            <option value="En Revisión">En Revisión</option>
            <option value="Esperando Repuesto">Esperando Repuesto</option>
            <option value="Listo">Listo</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
        <button onClick={() => onDelete(rep.id)} style={{ ...styles.btnIcon, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', height: '42px', width: '42px' }} title="Eliminar"><Icons.Trash /></button>
      </div>
    </div>
  )
}

export default function ServiciosTecnicos() {
  const router = useRouter()
  const [reparaciones, setReparaciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  
  // Formulario
  const estadoInicial = { 
    cliente_nombre: '', 
    cliente_telefono: '', 
    equipo_modelo: '', 
    falla: '', 
    costo_estimado: '', 
    estado: 'Recibido', 
    fecha_ingreso: new Date().toISOString().split('T')[0] 
  }
  const [form, setForm] = useState(estadoInicial)

  // --- CARGAR DATOS ---
  const cargarReparaciones = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reparaciones')
      .select('*')
      .order('fecha_ingreso', { ascending: false })
    
    setLoading(false)
    if (error) {
      alert('Error cargando reparaciones')
      return
    }
    setReparaciones(data || [])
  }

  useEffect(() => {
    cargarReparaciones()
  }, [])

  // --- GUARDAR ---
  const guardarReparacion = async () => {
    if (!form.cliente_nombre || !form.equipo_modelo || !form.falla) return alert('Completa los campos obligatorios')

    const { error } = await supabase.from('reparaciones').insert(form)

    if (error) return alert('Error al guardar: ' + error.message)
    
    alert('Ticket Creado Exitosamente')
    setForm(estadoInicial)
    cargarReparaciones()
  }

  // --- CAMBIAR ESTADO ---
  const cambiarEstado = async (id, nuevoEstado) => {
    const { error } = await supabase.from('reparaciones').update({ estado: nuevoEstado }).eq('id', id)
    if (error) return alert('Error actualizando estado')
    cargarReparaciones()
  }

  // --- ELIMINAR ---
  const eliminarReparacion = async (id) => {
    if(!confirm('¿Eliminar este ticket permanentemente?')) return
    const { error } = await supabase.from('reparaciones').delete().eq('id', id)
    if (error) return alert('Error al eliminar')
    cargarReparaciones()
  }

  // --- FILTRADO ---
  const reparacionesFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase()
    return reparaciones.filter(rep => 
      rep.cliente_nombre?.toLowerCase().includes(q) || 
      rep.equipo_modelo?.toLowerCase().includes(q)
    )
  }, [reparaciones, busqueda])

  // --- MÉTRICAS ---
  const metricas = useMemo(() => {
    const total = reparaciones.length
    const activos = reparaciones.filter(r => r.estado !== 'Entregado').length
    const listos = reparaciones.filter(r => r.estado === 'Listo').length
    const ingresos = reparaciones.reduce((acc, r) => acc + (Number(r.costo_estimado) || 0), 0)
    return { total, activos, listos, ingresos }
  }, [reparaciones])

  return (
    <div style={styles.container}>
      {/* ⚠️ ESTILOS CSS RESPONSIVOS */}
      <style>{`
        .page-wrapper { padding: 30px; max-width: 1400px; margin: 0 auto; }
        .form-grid { display: grid; gap: 20px; grid-template-columns: repeat(3, 1fr); }
        .cards-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
        @media (max-width: 1024px) { .form-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { 
           .form-grid { grid-template-columns: 1fr; }
           .cards-grid { grid-template-columns: 1fr; }
           .navbar-content { flex-direction: column; gap: 15px; }
           .nav-menu { width: 100%; justify-content: space-between; overflow-x: auto; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px' }}>
        <div className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}><Icons.Logo /></div><span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>TALLER</span></span></div>
          
          <div className="nav-menu" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => router.push('/inventario')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: 'transparent', color: '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Inventario</button>
            <button onClick={() => router.push('/accesorios')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: 'transparent', color: '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Accesorios</button>
            <button style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: '#F59E0B', color: 'black', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Taller</button>
          </div>
        </div>
      </nav>

      <div className="page-wrapper">
        
        {/* METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <StatCard label="Tickets Totales" value={metricas.total} icon={<Icons.Box />} />
          <StatCard label="En Proceso" value={metricas.activos} color="#3b82f6" icon={<Icons.Wrench />} subtext="Equipos en taller" />
          <StatCard label="Listos para entrega" value={metricas.listos} color="#10b981" icon={<Icons.Check />} />
          <StatCard label="Ingresos Estimados" value={`S/ ${metricas.ingresos}`} color="#94a3b8" icon={<Icons.Dollar />} />
        </div>

        {/* FORMULARIO */}
        <div style={{ ...styles.glassPanel, padding: '40px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}><Icons.Plus /></div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Nuevo Ticket de Reparación</h2>
          </div>

          <div className="form-grid">
            <div><label style={styles.label}>Cliente</label><input style={styles.input} placeholder="Nombre Cliente" value={form.cliente_nombre} onChange={e=>setForm({...form, cliente_nombre: e.target.value})} /></div>
            <div><label style={styles.label}>Teléfono</label><input style={styles.input} placeholder="099..." value={form.cliente_telefono} onChange={e=>setForm({...form, cliente_telefono: e.target.value})} /></div>
            <div><label style={styles.label}>Fecha Ingreso</label><input type="date" style={styles.input} value={form.fecha_ingreso} onChange={e=>setForm({...form, fecha_ingreso: e.target.value})} /></div>
            
            <div><label style={styles.label}>Equipo / Modelo</label><input style={styles.input} placeholder="Ej. iPhone 11" value={form.equipo_modelo} onChange={e=>setForm({...form, equipo_modelo: e.target.value})} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={styles.label}>Falla Reportada</label><input style={styles.input} placeholder="Ej. Pantalla rota, no da imagen" value={form.falla} onChange={e=>setForm({...form, falla: e.target.value})} /></div>
            
            <div><label style={{...styles.label, color: '#F59E0B'}}>Costo Estimado</label><input type="number" style={{...styles.input, borderColor: '#F59E0B', color: '#F59E0B', fontWeight: 'bold'}} placeholder="0.00" value={form.costo_estimado} onChange={e=>setForm({...form, costo_estimado: e.target.value})} /></div>
            <div>
               <label style={styles.label}>Estado Inicial</label>
               <select style={styles.input} value={form.estado} onChange={e=>setForm({...form, estado: e.target.value})}>
                 <option value="Recibido">Recibido</option>
                 <option value="En Revisión">En Revisión</option>
               </select>
            </div>
          </div>
          <button onClick={guardarReparacion} style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center', marginTop: '30px', fontSize: '1.1rem', padding: '16px' }}>
            Generar Orden de Servicio
          </button>
        </div>

        {/* LISTA DE TICKETS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Icons.Wrench /> Reparaciones en Curso
          </h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <div style={{ position: 'absolute', top: '14px', left: '14px', color: '#94a3b8' }}><Icons.Search /></div>
            <input 
              style={{ ...styles.input, paddingLeft: '45px', borderRadius: '50px', background: 'rgba(0,0,0,0.3)' }} 
              placeholder="Buscar ticket..." 
              value={busqueda} 
              onChange={e=>setBusqueda(e.target.value)} 
            />
          </div>
        </div>

        <div className="cards-grid">
          {reparacionesFiltradas.length === 0 ? (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#64748b' }}>No hay reparaciones registradas</div>
          ) : (
             reparacionesFiltradas.map((rep) => (
                <RepairCard key={rep.id} rep={rep} onCambiarEstado={cambiarEstado} onDelete={eliminarReparacion} />
             ))
          )}
        </div>
      </div>
    </div>
  )
}