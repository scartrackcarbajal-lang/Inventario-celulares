import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
    width: '36px', height: '36px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
// 🎨 ICONOS SVG
// ==========================================
const Icons = {
  Logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Smartphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Headphones: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
  Dollar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Box: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Info: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Clock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
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

const DetallesModal = ({ cel, onClose }) => {
  if (!cel) return null
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '20px' }} onClick={onClose}>
      <div style={{ ...styles.glassPanel, width: '100%', maxWidth: '600px', padding: '0', overflow: 'hidden', backgroundColor: '#0f172a' }} onClick={e => e.stopPropagation()}>
        <div style={{ height: '300px', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <img src={cel.imagen_url?.[0] || 'https://via.placeholder.com/400'} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '30px', maxHeight: '50vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{cel.marca}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', margin: 0 }}>{cel.modelo}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white' }}>S/ {cel.precio_venta}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Costo: S/ {cel.precio_costo}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
            <div><span style={{color: '#64748b', fontSize: '0.8rem', display: 'block'}}>IMEI / Serial</span> <span style={{color: 'white', fontFamily: 'monospace'}}>{cel.imei}</span></div>
            <div><span style={{color: '#64748b', fontSize: '0.8rem', display: 'block'}}>Estado</span> <span style={{color: '#F59E0B', fontWeight: 'bold'}}>{cel.estado}</span></div>
            <div><span style={{color: '#64748b', fontSize: '0.8rem', display: 'block'}}>Color</span> <span style={{color: 'white'}}>{cel.color}</span></div>
            <div><span style={{color: '#64748b', fontSize: '0.8rem', display: 'block'}}>Batería</span> <span style={{color: 'white'}}>{cel.salud_bateria}%</span></div>
            <div><span style={{color: '#64748b', fontSize: '0.8rem', display: 'block'}}>Capacidad</span> <span style={{color: 'white'}}>{cel.almacenamiento}</span></div>
          </div>

          {cel.descripcion && (
            <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', borderLeft: '3px solid #F59E0B' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Notas / Detalles</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{cel.descripcion}</p>
            </div>
          )}

          <button onClick={onClose} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>Cerrar Ficha</button>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ cel, onEdit, onDelete, onSell, onVerDetalle, onOpenModal }) {
  const [fotoActiva, setFotoActiva] = useState(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x300/0f172a/334155?text=No+Image')
  const vendido = Number(cel.stock) <= 0

  return (
    <div style={{ 
      ...styles.glassPanel, 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative', 
      opacity: vendido ? 0.6 : 1, 
      transition: 'transform 0.3s', 
      cursor: 'default' 
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: '240px', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'zoom-in' }} onClick={() => onOpenModal(fotoActiva)}>
        <img src={fotoActiva} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }} />
        <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }}>{cel.estado}</div>
        {!cel.publicado && <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: 'rgba(0,0,0,0.6)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>Oculto</div>}
        {vendido && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}><span style={{ border: '3px solid #ef4444', color: '#ef4444', padding: '8px 20px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: '900', transform: 'rotate(-12deg)', backgroundColor: '#020617' }}>VENDIDO</span></div>}
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{cel.marca}</p>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1.2 }}>{cel.modelo}</h3>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
            <span>IMEI</span> <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{cel.imei}</span>
          </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Inversión</span> <span style={{ color: '#cbd5e1' }}>S/ {cel.precio_costo}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            💾 {cel.almacenamiento}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            🎨 {cel.color}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>VENTA</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>S/ {cel.precio_venta}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => onVerDetalle(cel)} style={{ ...styles.btnIcon, color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }} title="Ver Detalles"><Icons.Eye /></button>
            <button onClick={() => onEdit(cel)} style={styles.btnIcon} title="Editar"><Icons.Edit /></button>
            <button onClick={() => !vendido && onSell(cel)} disabled={vendido} style={{ ...styles.btnIcon, backgroundColor: vendido ? 'transparent' : 'rgba(245, 158, 11, 0.1)', color: vendido ? '#475569' : '#F59E0B', borderColor: vendido ? 'transparent' : 'rgba(245, 158, 11, 0.3)' }} title="Vender"><Icons.Dollar /></button>
            <button onClick={() => onDelete(cel.id)} style={{ ...styles.btnIcon, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Eliminar"><Icons.Trash /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RepairCard({ rep, onCambiarEstado }) {
  const estadoColor = {
  RECEIVED: "#94a3b8",
  INREVIEW: "#F59E0B",
  WAITINGPARTS: "#f43f5e",
  READY: "#10b981",
  DELIVERED: "#3b82f6",
}

const estadoLabel = {
  RECEIVED: "Recibido",
  INREVIEW: "En Revisión",
  WAITINGPARTS: "Esperando Repuesto",
  READY: "Listo",
  DELIVERED: "Entregado",
}

  return (
    <div style={{ ...styles.glassPanel, padding: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>ORDEN #{rep.id}</p>
          <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold', margin: '4px 0' }}>{rep.equipo_modelo}</h3>
          <p style={{ color: '#F59E0B', fontSize: '0.9rem' }}>{rep.falla}</p>
        </div>
        <div style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: `${estadoColor[rep.estado]}22`, color: estadoColor[rep.estado], border: `1px solid ${estadoColor[rep.estado]}44` }}>
          {rep.estado}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Eye /><span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{rep.cliente_nombre}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Smartphone /><span>{rep.cliente_telefono}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Dollar /><span>Costo: S/ {rep.costo_estimado}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Check /><span>Total S/ {Number(rep.total ?? 0)}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: '1 / -1' }}><Icons.Clock /><span>Ingreso: {rep.fecha_ingreso}</span></div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
        <label style={{ ...styles.label, marginBottom: '8px' }}>Cambiar Estado:</label>
        <select
          style={{ ...styles.input, padding: 8, cursor: "pointer" }}
          value={rep.estado}
          onChange={(e) => onCambiarEstado(rep.id, e.target.value)}
        >
          <option value="RECEIVED">Recibido</option>
          <option value="INREVIEW">En Revisión</option>
          <option value="WAITINGPARTS">Esperando Repuesto</option>
          <option value="READY">Listo</option>
          <option value="DELIVERED">Entregado</option>
        </select>
      </div>
    </div>
  )
}

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
export default function Inventario() {
  const router = useRouter()
  
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('inventory')
  const [equipos, setEquipos] = useState([])
  const [reparaciones, setReparaciones] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [editandoSkuId, setEditandoSkuId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, type: 'success' })
  const [modalImagen, setModalImagen] = useState(null)
  const [detalleModalOpen, setDetalleModalOpen] = useState(null)

  // Auth & Ventas
  const [autorizado, setAutorizado] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargandoLogin, setCargandoLogin] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const [ventaModalAbierto, setVentaModalAbierto] = useState(false)
  const [ventaCel, setVentaCel] = useState(null)
  const [ventaForm, setVentaForm] = useState({ precio_final: '', cliente_nombre: '', cliente_telefono: '' })
  const [guardandoVenta, setGuardandoVenta] = useState(false)
  
  const [ventas, setVentas] = useState([])
  const [ventasDesde, setVentasDesde] = useState('')
  const [ventasHasta, setVentasHasta] = useState('')
  const [cargandoVentas, setCargandoVentas] = useState(false)

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [filtroVendidos, setFiltroVendidos] = useState('TODOS')

  // Formularios
  const estadoInicial = { marca: '', modelo: '', estado: 'Nuevo Sellado', serial: '', color: '', almacenamiento: '', salud_bateria: '', descripcion: '', precio_venta: '', precio_costo: '', publicado: true, imagen_url: [] }
  const [form, setForm] = useState(estadoInicial)

  const estadoReparacionInicial = { cliente_nombre: '', cliente_telefono: '', equipo_marca: '', equipo_model: '', imei: '', falla_reportada: '', diagnostico: '', costo_mano_obra: 0, costo_repuestos: 0, estado: 'Recibido', fecha_ingreso: new Date().toISOString().split('T')[0] }
  const [formReparacion, setFormReparacion] = useState(estadoReparacionInicial)

  // --- HELPERS ---
  const normalizarSerial = (v) => String(v || '').trim().replace(/\s+/g, '').toUpperCase().slice(0, 30)
  const avisar = (msg, type = 'success') => {
    setNotificacion({ mensaje: msg, visible: true, type })
    setTimeout(() => setNotificacion((prev) => ({ ...prev, visible: false })), 3000)
  }
  const inicioDelDiaISO = (d) => d ? new Date(`${d}T00:00:00`).toISOString() : null
  const finDelDiaISO = (d) => d ? new Date(`${d}T23:59:59.999`).toISOString() : null

  // --- EFFECTS ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAutorizado(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAutorizado(!!session))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (autorizado) {
      cargarEquipos()
      cargarVentas()
      cargarReparaciones()
    }
  }, [autorizado])

  useEffect(() => { if (autorizado) cargarVentas() }, [autorizado, ventasDesde, ventasHasta])

  // --- LOGIC ---
  const login = async () => {
    if (!email || !password) return
    setCargandoLogin(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setCargandoLogin(false)
    if (error) setLoginError(error.message)
  }
  const logout = async () => { await supabase.auth.signOut() }
  
  const cargarEquipos = async () => {
    const { data, error } = await supabase.from('items_serializados').select(`id, sku_id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, vendido, costo_compra, created_at, skus:sku_id ( id, sku_codigo, tracking, precio_venta, precio_costo, publicado, productos:producto_id ( id, marca, nombre, descripcion ) )`).order('created_at', { ascending: false })
    if (error) return avisar('Error cargando inventario', 'error')
    setEquipos((data || []).map(row => ({ id: row.id, marca: row?.skus?.productos?.marca || '', modelo: row?.skus?.productos?.nombre || '', estado: row.estado, imei: row.serial, precio_venta: row?.skus?.precio_venta || 0, precio_costo: row.costo_compra ? Number(row.costo_compra) : (row?.skus?.precio_costo ?? 0), almacenamiento: row.almacenamiento, salud_bateria: row.salud_bateria, color: row.color, imagen_url: row.imagen_url, publicado: row?.skus?.publicado ?? false, stock: row.vendido ? 0 : 1, descripcion: row?.skus?.productos?.descripcion || '', _raw: row })))
  }
  
  const cargarVentas = async () => {
    let query = supabase.from('ventas_v2').select(`id, precio_lista, precio_final, descuento, cliente_nombre, cliente_telefono, cantidad, tipo_venta, vendido_en, vendido_por, item_serializado_id, sku_id, items_serializados:item_serializado_id ( serial, costo_compra ), skus:sku_id ( id, precio_costo, productos:producto_id ( marca, nombre ) )`).order('vendido_en', { ascending: false }).limit(300)
    if (ventasDesde) query = query.gte('vendido_en', inicioDelDiaISO(ventasDesde))
    if (ventasHasta) query = query.lte('vendido_en', finDelDiaISO(ventasHasta))
    const { data, error } = await query
    if (error) return avisar('Error cargando ventas', 'error')
    setVentas(data || [])
  }

    const cargarReparaciones = async () => {
    const { data, error } = await supabase
      .from('reparaciones')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return avisar(error.message, 'error')

    const adaptadas = (data || []).map((r) => ({
      id: r.id,
      cliente_nombre: r.cliente_nombre,
      cliente_telefono: r.cliente_telefono,
      equipo_marca: r.equipo_marca,
      equipo_model: r.equipo_model,
      imei: r.imei,
      falla_reportada: r.falla_reportada,
      diagnostico: r.diagnostico,
      estado: r.estado,
      total: Number(r.total || 0),
      created_at: r.created_at,
    }))

    setReparaciones(adaptadas)
  }
  
  const manejarFotos = async (e) => {
    const archivos = Array.from(e.target.files || [])
    if (!archivos.length) return
    setSubiendo(true)
    let nuevas = [...(form.imagen_url || [])]
    for (const file of archivos) {
      const name = `${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from('Celulares - fotos').upload(name, file)
      if (!error) {
        const { data } = supabase.storage.from('Celulares - fotos').getPublicUrl(name)
        nuevas.push(data.publicUrl)
      }
    }
    setForm({ ...form, imagen_url: nuevas })
    setSubiendo(false)
    avisar('Fotos subidas con éxito')
  }
  
  const asegurarCategoriaId = async (nombre) => {
    const { data } = await supabase.from('categorias').select('id').eq('nombre', nombre).maybeSingle()
    if (data) return data.id
    const { data: neu } = await supabase.from('categorias').insert({ nombre }).select('id').single()
    return neu.id
  }
  
  const asegurarProductoId = async ({ categoriaId, marca, modelo, descripcion }) => {
    const { data } = await supabase.from('productos').select('id').eq('categoria_id', categoriaId).eq('marca', marca).eq('nombre', modelo).maybeSingle()
    if (data) return data.id
    const { data: neu } = await supabase.from('productos').insert({ categoria_id: categoriaId, marca, nombre: modelo, descripcion, activo: true }).select('id').single()
    return neu.id
  }

  const crearSku = async ({ productoId, precio_venta, precio_costo, publicado }) => {
    const { data } = await supabase.from('skus').insert({ producto_id: productoId, sku_codigo: `CEL-${productoId}-${Date.now()}`, tracking: 'SERIAL', precio_venta, precio_costo, publicado: !!publicado }).select('id').single()
    return data.id
  }

  const guardar = async () => {
    try {
      const serial = normalizarSerial(form.serial)
      if (!form.marca || !form.modelo || !serial) return avisar('Faltan datos obligatorios', 'error')
      
      if (editandoId) {
        await supabase.from('items_serializados').update({ serial, estado: form.estado, salud_bateria: form.salud_bateria, almacenamiento: form.almacenamiento, color: form.color, imagen_url: form.imagen_url, costo_compra: form.precio_costo }).eq('id', editandoId)
        if (editandoSkuId) { 
            const { data: skuData } = await supabase.from('skus').select('producto_id').eq('id', editandoSkuId).single()
            if(skuData) await supabase.from('productos').update({ descripcion: form.descripcion }).eq('id', skuData.producto_id)
            await supabase.from('skus').update({ precio_venta: form.precio_venta, precio_costo: form.precio_costo, publicado: form.publicado }).eq('id', editandoSkuId) 
        }
        avisar('Equipo actualizado')
        setEditandoId(null)
      } else {
        const catId = await asegurarCategoriaId('Celulares')
        const prodId = await asegurarProductoId({ categoriaId: catId, marca: form.marca, modelo: form.modelo, descripcion: form.descripcion })
        const skuId = await crearSku({ productoId: prodId, precio_venta: form.precio_venta, precio_costo: form.precio_costo, publicado: form.publicado })
        await supabase.from('items_serializados').insert({ sku_id: sku.id, serial, estado: form.estado, salud_bateria: form.salud_bateria, almacenamiento: form.almacenamiento, color: form.color, vendido: false, imagen_url: form.imagen_url, costo_compra: form.precio_costo })
        avisar('Equipo registrado')
      }
      setForm(estadoInicial)
      cargarEquipos()
    } catch (e) { avisar(e.message, 'error') }
  }

    const guardarReparacion = async () => {
    // Validación mínima
    if (!formReparacion.cliente_nombre?.trim() || !formReparacion.equipo_model?.trim()) {
      return avisar('Nombre y Equipo son obligatorios', 'error')
    }

    const { data: sess } = await supabase.auth.getSession()
    const userId = sess?.session?.user?.id
    if (!userId) return avisar('Sesión no válida, vuelve a iniciar sesión', 'error')

    const mano = Number(formReparacion.costo_mano_obra || 0)
    const rep = Number(formReparacion.costo_repuestos || 0)

    const payload = {
      cliente_nombre: formReparacion.cliente_nombre?.trim() || null,
      cliente_telefono: formReparacion.cliente_telefono?.trim() || null,
      equipo_marca: formReparacion.equipo_marca?.trim() || null,
      equipo_model: formReparacion.equipo_model?.trim() || null,
      imei: formReparacion.imei?.trim() || null,
      falla_reportada: formReparacion.falla_reportada?.trim() || null,
      diagnostico: formReparacion.diagnostico?.trim() || null,
      estado: formReparacion.estado, // usa valores DB (RECEIVED, etc.)
      costo_mano_obra: mano,
      costo_repuestos: rep,
      total: mano + rep, // opcional, pero te evita dudas si el default/calculado falla
      creado_por: userId,
    }

    const { error } = await supabase.from('reparaciones').insert(payload)
    if (error) return avisar(error.message, 'error')

    avisar('Ticket de reparación creado', 'success')
    setFormReparacion(estadoReparacionInicial)
    cargarReparaciones()
  }


  const cambiarEstadoReparacion = async (id, nuevoEstado) => {
    const { error } = await supabase.from('reparaciones').update({ estado: nuevoEstado }).eq('id', id)
    if (error) return avisar('Error actualizando estado', 'error')
    cargarReparaciones()
    avisar('Estado actualizado')
  }
  
  const confirmarVenta = async () => {
    if (!ventaCel) return
    const precioFinal = Number(ventaForm.precio_final)
    if (!precioFinal) return avisar('Falta precio', 'error')
    setGuardandoVenta(true)
    const { data: sess } = await supabase.auth.getSession()
    const userId = sess?.session?.user?.id
    if (!userId) return

    const { error } = await supabase.from('ventas_v2').insert({ item_serializado_id: ventaCel.id, sku_id: ventaCel._raw.skus.id, precio_lista: ventaCel.precio_venta, precio_final: precioFinal, descuento: (ventaCel.precio_venta || 0) - precioFinal, cliente_nombre: ventaForm.cliente_nombre, cliente_telefono: ventaForm.cliente_telefono, vendido_por: userId, tipo_venta: 'SERIALIZADO', cantidad: 1 })
    if (!error) { await supabase.from('items_serializados').update({ vendido: true }).eq('id', ventaCel.id); avisar('¡Venta registrada!'); setVentaModalAbierto(false); setVentaCel(null); setVentaForm({ precio_final: '', cliente_nombre: '', cliente_telefono: '' }); cargarEquipos(); cargarVentas(); } else { avisar(error.message, 'error') }
    setGuardandoVenta(false)
  }

  const resumenVentas = useMemo(() => ventas.reduce((acc, v) => {
    const final = Number(v.precio_final || 0); let costo = v.items_serializados?.costo_compra ? Number(v.items_serializados.costo_compra) : (Number(v.skus?.precio_costo || 0) * (v.cantidad || 1))
    return { totalVentas: acc.totalVentas + final, totalCosto: acc.totalCosto + costo, totalGanancia: acc.totalGanancia + (final - costo), count: acc.count + 1 }
  }, { totalVentas: 0, totalCosto: 0, totalGanancia: 0, count: 0 }), [ventas])

  const equiposFiltrados = useMemo(() => equipos.filter(c => {
    const terminos = busqueda.toLowerCase().trim().split(/\s+/)
    const datos = `${c.marca} ${c.modelo} ${c.imei} ${c.color} ${c.almacenamiento} ${c.estado} ${c.descripcion}`.toLowerCase()
    const match = terminos.every(t => datos.includes(t))
    const st = filtroEstado === 'TODOS' || c.estado === filtroEstado
    const vd = filtroVendidos === 'TODOS' || (filtroVendidos === 'VENDIDOS' ? Number(c.stock) <= 0 : Number(c.stock) > 0)
    return match && st && vd
  }), [equipos, busqueda, filtroEstado, filtroVendidos])

  if (!autorizado) return (
    <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...styles.glassPanel, padding: '40px', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}><Icons.Logo /></div>
        <h1 style={{ fontSize: '2rem', color: 'white', margin: '0 0 10px 0', fontWeight: '900' }}>FARRUS<span style={styles.goldText}>HUB</span></h1>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>Acceso Administrativo</p>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input style={styles.input} placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={login} style={{ ...styles.btnPrimary, justifyContent: 'center', marginTop: '10px' }}>{cargandoLogin ? 'Verificando...' : 'Iniciar Sesión'}</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
      {/* ⚠️ ESTILOS CSS RESPONSIVOS GLOBALES */}
      <style>{`
        .page-wrapper { padding: 30px; max-width: 1400px; margin: 0 auto; }
        .filters-container { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; align-items: center; }
        .cards-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        .form-grid { display: grid; gap: 20px; grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1024px) { .form-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
           .page-wrapper { padding: 15px; }
           .form-grid { grid-template-columns: 1fr; }
           .cards-grid { grid-template-columns: 1fr; }
           .header-actions { flex-direction: column; align-items: stretch !important; gap: 20px; }
           .filters-container { flex-direction: column; align-items: stretch; }
           .filters-container input, .filters-container select { width: 100% !important; min-width: 0 !important; }
           .navbar-content { flex-direction: column; gap: 15px; }
           .nav-menu { width: 100%; justify-content: space-between; overflow-x: auto; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px' }}>
        <div className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}><Icons.Logo /></div><span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>HUB</span></span></div>
          
          <div className="nav-menu" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setActiveTab('register')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: activeTab === 'register' ? '#F59E0B' : 'transparent', color: activeTab === 'register' ? 'black' : '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Registro</button>
            <button onClick={() => setActiveTab('inventory')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: activeTab === 'inventory' ? '#F59E0B' : 'transparent', color: activeTab === 'inventory' ? 'black' : '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Inventario</button>
            <button onClick={() => setActiveTab('sales')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: activeTab === 'sales' ? '#F59E0B' : 'transparent', color: activeTab === 'sales' ? 'black' : '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Finanzas</button>
            <button onClick={() => setActiveTab('service')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: activeTab === 'service' ? '#F59E0B' : 'transparent', color: activeTab === 'service' ? 'black' : '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Taller</button>
            <button onClick={() => router.push('/accesorios')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: 'transparent', color: '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Accesorios</button>
          </div>
          
          <button onClick={logout} style={{ ...styles.btnIcon, width: 'auto', padding: '0 16px', borderRadius: '12px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>Salir</button>
        </div>
      </nav>

      <div className="page-wrapper">
        
        {/* METRICS WIDGETS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <StatCard label="Ventas Totales" value={`S/ ${resumenVentas.totalVentas.toLocaleString()}`} icon={<Icons.Dollar />} />
          <StatCard label="Ganancia Neta" value={`S/ ${resumenVentas.totalGanancia.toLocaleString()}`} color="#10b981" icon={<Icons.Chart />} subtext="Margen saludable" />
          <StatCard label="Inversión Activa" value={`S/ ${resumenVentas.totalCosto.toLocaleString()}`} color="#94a3b8" icon={<Icons.Box />} />
          <StatCard label="Reparaciones" value={reparaciones.length} color="#3b82f6" icon={<Icons.Wrench />} subtext="Servicios en curso" />
        </div>

        {activeTab === 'register' && (
           <div id="form-area" style={{ ...styles.glassPanel, padding: '40px', marginBottom: '50px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>{editandoId ? <Icons.Edit /> : <Icons.Box />}</div><h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{editandoId ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}</h2></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: form.publicado ? '#10b981' : '#64748b' }}>{form.publicado ? 'Público' : 'Borrador'}</span>
                  <div onClick={() => setForm({...form, publicado: !form.publicado})} style={{ width: '40px', height: '22px', background: form.publicado ? '#10b981' : '#334155', borderRadius: '99px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}><div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: form.publicado ? '20px' : '2px', transition: 'all 0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} /></div>
                </div>
              </div>

              <div className="form-grid">
                <div><label style={styles.label}>Marca</label><input style={styles.input} placeholder="Ej. Apple" value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})} /></div>
                <div><label style={styles.label}>Modelo</label><input style={styles.input} placeholder="Ej. iPhone 15" value={form.modelo} onChange={e=>setForm({...form, modelo:e.target.value})} /></div>
                <div>
                  <label style={styles.label}>Estado</label>
                  <select style={styles.input} value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
                    <option>Nuevo Sellado</option><option>Semi Nuevo</option><option>Usado</option><option>Open Box</option>
                  </select>
                </div>
                <div><label style={styles.label}>Serial / IMEI</label><input style={{...styles.input, fontFamily: 'monospace'}} placeholder="Escanea..." value={form.serial} onChange={e=>setForm({...form, serial:normalizarSerial(e.target.value)})} /></div>
                <div><label style={styles.label}>Color</label><input style={styles.input} placeholder="Ej. Azul" value={form.color} onChange={e=>setForm({...form, color:e.target.value})} /></div>
                <div><label style={styles.label}>Almacenamiento</label><input style={styles.input} placeholder="Ej. 128GB" value={form.almacenamiento} onChange={e=>setForm({...form, almacenamiento:e.target.value})} /></div>
                <div><label style={styles.label}>Batería %</label><input style={styles.input} type="number" placeholder="100" value={form.salud_bateria} onChange={e=>setForm({...form, salud_bateria:e.target.value})} /></div>
                <div><label style={{...styles.label, color: '#F59E0B'}}>Precio Venta</label><input style={{...styles.input, borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B', fontWeight: 'bold'}} type="number" placeholder="0.00" value={form.precio_venta} onChange={e=>setForm({...form, precio_venta:e.target.value})} /></div>
                <div><label style={styles.label}>Costo Compra</label><input style={styles.input} type="number" placeholder="0.00" value={form.precio_costo} onChange={e=>setForm({...form, precio_costo:e.target.value})} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={styles.label}>Detalles / Descripción</label><textarea style={{...styles.input, height: '100px', resize: 'vertical'}} placeholder="Detalles adicionales..." value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})} /></div>
                <div style={{ gridColumn: '1/-1', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' }} onClick={()=>document.getElementById('file-input').click()}><div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}><Icons.Upload /> {subiendo ? 'Subiendo...' : 'Click para subir fotos'}</div><input id="file-input" type="file" hidden multiple onChange={manejarFotos} />{form.imagen_url.length > 0 && <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>{form.imagen_url.map((u, i) => <img key={i} src={u} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />)}</div>}</div>
              </div>
              <button onClick={guardar} style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center', marginTop: '30px', fontSize: '1.1rem', padding: '16px' }}>{editandoId ? 'Guardar Cambios' : 'Registrar en Inventario'}</button>
            </div>
        )}

        {activeTab === 'inventory' && (
          <>
            <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div><h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: '0 0 5px 0' }}>Control de Inventario</h1><p style={{ color: '#64748b' }}>Vista general de tu negocio</p></div>
               <div style={{ display: 'flex', gap: '20px' }}>
                   <div style={{ textAlign: 'right' }}>
                       <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>TOTAL ITEMS</p>
                       <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{equipos.length}</p>
                   </div>
               </div>
            </div>

            <div className="filters-container">
              <div style={{ flex: '2', minWidth: '280px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '14px', left: '14px', color: '#94a3b8' }}><Icons.Search /></div>
                <input style={{ ...styles.input, paddingLeft: '45px' }} placeholder="Buscar (IMEI, Modelo, Color...)" value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
              </div>
              
              <div style={{ flex: '1', minWidth: '180px' }}>
                <select style={{ ...styles.input, cursor: 'pointer' }} value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}>
                  <option value="TODOS">Todos los Estados</option>
                  <option value="Nuevo Sellado">Nuevo Sellado</option>
                  <option value="Semi Nuevo">Semi Nuevo</option>
                  <option value="Usado">Usado</option>
                  <option value="Open Box">Open Box</option>
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '180px' }}>
                <select style={{ ...styles.input, cursor: 'pointer' }} value={filtroVendidos} onChange={e=>setFiltroVendidos(e.target.value)}>
                  <option value="TODOS">Todo el Inventario</option>
                  <option value="DISPONIBLES">En Stock</option><option value="VENDIDOS">Vendidos</option>
                </select>
              </div>
            </div>

            <div className="cards-grid">
              {equiposFiltrados.map(cel => (
                <ProductCard key={cel.id} cel={cel} onEdit={(c) => { setForm({...estadoInicial, ...c, serial: c.imei}); setEditandoId(c.id); setEditandoSkuId(c._raw.skus.id); setActiveTab('register'); window.scrollTo({top:0, behavior:'smooth'}) }} onDelete={async (id) => { if(confirm('¿Eliminar?')) { await supabase.from('items_serializados').delete().eq('id', id); cargarEquipos(); } }} onSell={(c) => { setVentaCel(c); setVentaForm({precio_final: c.precio_venta, cliente_nombre:'', cliente_telefono:''}); setVentaModalAbierto(true); }} onOpenModal={setModalImagen} onVerDetalle={setDetalleModalOpen} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'sales' && (
          <div style={{ ...styles.glassPanel, padding: '0', overflow: 'hidden' }}>
            <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                <thead><tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{['Fecha', 'Producto', 'Detalle', 'Venta', 'Costo', 'Ganancia'].map(h => (<th key={h} style={{ padding: '16px', textAlign: h === 'Producto' || h === 'Fecha' ? 'left' : 'right', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>))}</tr></thead>
                <tbody>
                    {ventas.map(v => {
                    const final = Number(v.precio_final); const costo = v.items_serializados?.costo_compra ? Number(v.items_serializados.costo_compra) : (Number(v.skus?.precio_costo) * (v.cantidad || 1)); const ganancia = final - costo
                    return (
                        <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>{new Date(v.vendido_en).toLocaleDateString()}</td>
                        <td style={{ padding: '16px' }}><b style={{ color: 'white' }}>{v.skus?.productos?.marca}</b> {v.skus?.productos?.nombre}</td>
                        <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.85rem' }}>{v.items_serializados?.serial || 'Bulk'}</td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: 'white' }}>S/ {final.toFixed(2)}</td>
                        <td style={{ padding: '16px', textAlign: 'right', color: '#64748b' }}>S/ {costo.toFixed(2)}</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}><span style={{ color: ganancia >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold', background: ganancia >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.85rem', border: `1px solid ${ganancia >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>S/ {ganancia.toFixed(2)}</span></td>
                        </tr>
                    )
                    })}
                </tbody>
                </table>
            </div>
          </div>
        )}

        {/* --- PESTAÑA SERVICIO TÉCNICO (NUEVO) --- */}
        {activeTab === 'service' && (
          <>
            {/* Formulario Rápido de Servicio */}
            <div style={{ ...styles.glassPanel, padding: '30px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>⚡ Ingreso Rápido de Servicio</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <input style={styles.input} placeholder="Cliente" value={formReparacion.cliente_nombre} onChange={e=>setFormReparacion({...formReparacion, cliente_nombre:e.target.value})} />
                <input style={styles.input} placeholder="Teléfono" value={formReparacion.cliente_telefono} onChange={e=>setFormReparacion({...formReparacion, cliente_telefono:e.target.value})} />
                <input style={styles.input} placeholder="Equipo / Modelo" value={formReparacion.equipomodel}  onChange={(e) => setFormReparacion({ ...formReparacion, equipomodel: e.target.value })}/>
                <input style={styles.input} placeholder="Falla Reportada" value={formReparacion.falla} onChange={e=>setFormReparacion({...formReparacion, falla:e.target.value})} />
                <input type="number" style={styles.input} placeholder="Costo Estimado" value={formReparacion.costo_estimado} onChange={e=>setFormReparacion({...formReparacion, costo_estimado:e.target.value})} />
                <input type="date" style={styles.input} placeholder="Fecha Ingreso" value={formReparacion.fecha_ingreso} onChange={e=>setFormReparacion({...formReparacion, fecha_ingreso:e.target.value})} />
                <button onClick={guardarReparacion} style={{ ...styles.btnPrimary, height: '100%' }}>Crear Ticket</button>
              </div>
            </div>

            {/* Listado de Reparaciones */}
            <div className="cards-grid">
              {reparaciones.map(rep => (
                <RepairCard key={rep.id} rep={rep} onCambiarEstado={cambiarEstadoReparacion} />
              ))}
            </div>
          </>
        )}
      </div>

      {modalImagen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }} onClick={() => setModalImagen(null)}>
          <img src={modalImagen} style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} />
        </div>
      )}

      {detalleModalOpen && <DetallesModal cel={detalleModalOpen} onClose={() => setDetalleModalOpen(null)} />}

      {ventaModalAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ ...styles.glassPanel, width: '100%', maxWidth: '450px', padding: '30px', backgroundColor: '#0f172a' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: 'white' }}>Confirmar Venta</h2>
            <p style={{ color: '#94a3b8', marginBottom: '25px' }}>Vendiendo: <b style={{ color: '#F59E0B' }}>{ventaCel?.marca} {ventaCel?.modelo}</b></p>
            <div style={{ marginBottom: '20px' }}><label style={styles.label}>Precio Final Real</label><input type="number" autoFocus style={{ ...styles.input, fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B', borderColor: '#F59E0B' }} value={ventaForm.precio_final} onChange={e=>setVentaForm({...ventaForm, precio_final:e.target.value})} /></div>
            <div style={{ marginBottom: '30px' }}><label style={styles.label}>Cliente (Opcional)</label><input style={styles.input} placeholder="Nombre del cliente" value={ventaForm.cliente_nombre} onChange={e=>setVentaForm({...ventaForm, cliente_nombre:e.target.value})} /></div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={()=>setVentaModalAbierto(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={confirmarVenta} disabled={guardandoVenta} style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>{guardandoVenta ? '...' : 'Confirmar'}</button>
            </div>
          </div>
        </div>
      )}

      {notificacion.visible && <div style={{ position: 'fixed', top: '80px', right: '20px', padding: '15px 25px', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderLeft: `5px solid ${notificacion.type === 'error' ? '#ef4444' : '#10b981'}`, color: 'white', fontWeight: 'bold', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 300 }}>{notificacion.mensaje}</div>}
    </div>
  )
}