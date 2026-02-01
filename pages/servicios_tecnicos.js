import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

// ==========================================
// 🎨 ESTILOS PREMIUM Y RESPONSIVOS
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
  mainWrapper: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  glassPanel: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(20px)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
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
    width: '100%',
  },
  btnIcon: {
    padding: '0 15px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
  },
  responsiveStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  responsiveCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '25px',
    paddingBottom: '60px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
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
  Wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Box: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
}

// ==========================================
// COMPONENTES AUXILIARES
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

const RepairCard = ({ rep, onCambiarEstado, onDelete, onEdit }) => {
  const estadoColor = {
    'Recibido': '#94a3b8',
    'Diagnóstico': '#f59e0b',
    'En reparación': '#3b82f6',
    'Listo': '#10b981',
    'Entregado': '#8b5cf6',
    'Cancelado': '#ef4444'
  }
  const colorEstado = estadoColor[rep.state] || '#94a3b8'

  return (
    <div style={{ ...styles.glassPanel, padding: '24px', position: 'relative', transition: 'transform 0.3s' }}
         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>ORDEN #{rep.id}</p>
          <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold', margin: '4px 0', lineHeight: 1.2 }}>{rep.equipo_marca} {rep.equipo_modelo}</h3>
          <p style={{ color: '#F59E0B', fontSize: '0.85rem', fontWeight: '500' }}>{rep.falla_reportada}</p>
        </div>
        <div style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', backgroundColor: `${colorEstado}22`, color: colorEstado, border: `1px solid ${colorEstado}44`, whiteSpace: 'nowrap' }}>
          {rep.estado}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}><Icons.User /><span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{rep.cliente_nombre}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Phone /><span>{rep.cliente_telefono}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ color: '#ef4444', fontWeight: 'bold' }}>S/ {rep.total || 0}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Clock /><span>{rep.created_at ? new Date(rep.created_at).toLocaleDateString() : '-'}</span></div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ ...styles.label, fontSize: '0.6rem' }}>Cambiar Estado:</label>
          <select 
            style={{ ...styles.input, padding: '10px', fontSize: '0.8rem', cursor: 'pointer' }} 
            value={rep.estado} 
            onChange={(e) => onCambiarEstado(rep.id, e.target.value)}
          >
            <option value="Recibido">Recibido</option>
            <option value="Diagnóstico">Diagnóstico</option>
            <option value="En reparación">En reparación</option>
            <option value="Listo">Listo</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <button onClick={() => onEdit(rep)} style={{ ...styles.btnIcon, width: '40px', padding: 0, color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)' }} title="Editar"><Icons.Edit /></button>
        <button onClick={() => onDelete(rep.id)} style={{ ...styles.btnIcon, width: '40px', padding: 0, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} title="Eliminar"><Icons.Trash /></button>
      </div>
    </div>
  )
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  const router = useRouter()
  const [reparaciones, setReparaciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  
  const estadoInicial = { 
    cliente_nombre: '', cliente_telefono: '', equipo_marca: '', equipo_modelo: '', imei: '',
    falla_reportada: '', diagnostico: '', costo_mano_obra: '', costo_repuestos: '', estado: 'Recibido'
  }
  const [form, setForm] = useState(estadoInicial)

  const cargarReparaciones = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('reparaciones').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (!error) setReparaciones(data || [])
  }

  useEffect(() => { cargarReparaciones() }, [])

  const prepararEdicion = (rep) => {
    setEditandoId(rep.id)
    setForm({ ...rep, diagnostico: rep.diagnostico || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardarReparacion = async () => {
    if (!form.cliente_nombre || !form.equipo_modelo || !form.falla_reportada) return alert('Completa los campos obligatorios (*)')
    
    const manoObra = Number(form.costo_mano_obra) || 0
    const repuestos = Number(form.costo_repuestos) || 0
    const totalCalculado = manoObra + repuestos
    const datosEnviar = { ...form, costo_mano_obra: manoObra, costo_repuestos: repuestos, total: totalCalculado }

    const { data: sess } = await supabase.auth.getSession()
    if (sess?.session?.user) datosEnviar.creado_por = sess.session.user.id

    let res;
    if (editandoId) {
      res = await supabase.from('reparaciones').update(datosEnviar).eq('id', editandoId)
    } else {
      res = await supabase.from('reparaciones').insert(datosEnviar)
    }

    if (res.error) return alert('Error: ' + res.error.message)
    
    setForm(estadoInicial)
    setEditandoId(null)
    cargarReparaciones()
    alert('Operación exitosa')
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    const { error } = await supabase.from('reparaciones').update({ estado: nuevoEstado }).eq('id', id)
    if (!error) cargarReparaciones()
  }

  const eliminarReparacion = async (id) => {
    if(!confirm('¿Eliminar permanentemente?')) return
    const { error } = await supabase.from('reparaciones').delete().eq('id', id)
    if (!error) cargarReparaciones()
  }

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return reparaciones.filter(r => 
      `${r.cliente_nombre} ${r.equipo_modelo} ${r.imei}`.toLowerCase().includes(q)
    )
  }, [reparaciones, busqueda])

  const metricas = useMemo(() => {
    const totalCount = reparaciones.length
    const activosCount = reparaciones.filter(r => r.estado !== 'Entregado' && r.estado !== 'Cancelado').length
    const listosCount = reparaciones.filter(r => r.estado === 'Listo').length
    const ingresosSum = reparaciones.reduce((acc, r) => acc + (Number(r.total) || 0), 0)
    return { 
        total: String(totalCount), 
        activos: String(activosCount), 
        listos: String(listosCount), 
        ingresos: String(ingresosSum) 
    }
  }, [reparaciones])

  return (
    <div style={styles.container}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icons.Logo />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>TALLER</span></span>
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', padding: '4px' }}>
          <button onClick={() => router.push('/inventario')} style={styles.btnIcon}>Inventario</button>
          <button onClick={() => router.push('/accesorios')} style={styles.btnIcon}>Accesorios</button>
        </div>
      </nav>

      <div style={styles.mainWrapper}>
        <div style={styles.responsiveStatsGrid}>
          <StatCard label="Tickets" value={metricas.total} icon={<Icons.Box />} />
          <StatCard label="En Proceso" value={metricas.activos} color="#3b82f6" icon={<Icons.Wrench />} />
          <StatCard label="Listos" value={metricas.listos} color="#10b981" icon={<Icons.Check />} />
          <StatCard label="Total Caja" value={`S/ ${metricas.ingresos}`} color="#94a3b8" icon={<Icons.Dollar />} />
        </div>

        <div style={{ ...styles.glassPanel, padding: '25px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                {editandoId ? <Icons.Edit /> : <Icons.Plus />}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{editandoId ? 'Editar Ticket' : 'Nuevo Ingreso'}</h2>
          </div>
          <div style={styles.formGrid}>
            <div><label style={styles.label}>Cliente *</label><input style={styles.input} value={form.cliente_nombre} onChange={e=>setForm({...form, cliente_nombre:e.target.value})} /></div>
            <div><label style={styles.label}>Teléfono</label><input style={styles.input} value={form.cliente_telefono} onChange={e=>setForm({...form, cliente_telefono:e.target.value})} /></div>
            <div><label style={styles.label}>Marca Equipo</label><input style={styles.input} value={form.equipo_marca} onChange={e=>setForm({...form, equipo_marca:e.target.value})} /></div>
            <div><label style={styles.label}>Modelo *</label><input style={styles.input} value={form.equipo_modelo} onChange={e=>setForm({...form, equipo_modelo:e.target.value})} /></div>
            <div><label style={styles.label}>IMEI</label><input style={{...styles.input, fontFamily: 'monospace'}} value={form.imei} onChange={e=>setForm({...form, imei:e.target.value})} /></div>
            <div><label style={styles.label}>Mano de Obra</label><input type="number" style={styles.input} value={form.costo_mano_obra} onChange={e=>setForm({...form, costo_mano_obra:e.target.value})} /></div>
            <div><label style={styles.label}>Repuestos</label><input type="number" style={styles.input} value={form.costo_repuestos} onChange={e=>setForm({...form, costo_repuestos:e.target.value})} /></div>
            <div><label style={styles.label}>Estado Inicial</label>
                <select style={styles.input} value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
                    <option value="Recibido">Recibido</option>
                    <option value="Diagnóstico">Diagnóstico</option>
                    <option value="En reparación">En reparación</option>
                </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}><label style={styles.label}>Falla Reportada *</label><input style={styles.input} value={form.falla_reportada} onChange={e=>setForm({...form, falla_reportada:e.target.value})} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={styles.label}>Diagnóstico</label><textarea style={{...styles.input, height: '80px', resize: 'vertical'}} value={form.diagnostico} onChange={e=>setForm({...form, diagnostico:e.target.value})} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px', flexWrap: 'wrap' }}>
            <button onClick={guardarReparacion} style={styles.btnPrimary}>{editandoId ? 'Guardar Cambios' : 'Crear Orden'}</button>
            {editandoId && <button onClick={() => { setEditandoId(null); setForm(estadoInicial); }} style={{ ...styles.btnPrimary, background: 'transparent', border: '1px solid #64748b', color: '#94a3b8' }}>Cancelar</button>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', margin: 0 }}>Servicios en Taller</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <div style={{ position: 'absolute', top: '12px', left: '14px', color: '#94a3b8' }}>
                  <Icons.Search />
              </div>
              <input style={{ ...styles.input, paddingLeft: '45px' }} placeholder="Buscar cliente, imei..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
          </div>
        </div>

        <div style={styles.responsiveCardsGrid}>
          {filtrados.length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b' }}>No se encontraron registros</p>
          ) : (
              filtrados.map(rep => <RepairCard key={rep.id} rep={rep} onCambiarEstado={cambiarEstado} onDelete={eliminarReparacion} onEdit={prepararEdicion} />)
          )}
        </div>
      </div>
    </div>
  )
}