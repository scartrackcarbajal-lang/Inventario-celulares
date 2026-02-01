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
    width: '100%',
    boxSizing: 'border-box'
  },
  glassPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  goldText: {
    background: 'linear-gradient(to right, #F59E0B, #D97706)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '900',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '800',
    color: '#64748b',
    display: 'block',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '16px',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.4)',
    display: 'flex', alignItems: 'center', gap: '8px',
    justifyContent: 'center',
    transition: 'transform 0.2s',
    width: '100%',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  },
  btnIcon: {
    padding: '0 15px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  statCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  }
}

const Icons = {
  Logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Box: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Smartphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Headphones: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Dollar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
}

// 🧱 Componente de Tarjeta de Estadísticas
function StatCard({ label, value, subtext, color = '#F59E0B', icon }) {
  return (
    <div style={styles.statCard}>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.1, color: color }}>
        {icon}
      </div>
      <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>{label}</p>
      <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0, lineHeight: 1 }}>{value}</h3>
      {subtext && <p style={{ fontSize: '0.8rem', color: color, marginTop: '8px', fontWeight: '600' }}>{subtext}</p>}
    </div>
  )
}

// 🧱 Componente de Tarjeta de Reparación
function RepairCard({ rep, onCambiarEstado, onDelete, onEdit }) {
  const estadoColor = {
    'Recibido': '#94a3b8',
    'Diagnóstico': '#f59e0b',
    'En reparación': '#3b82f6',
    'Listo': '#10b981',
    'Entregado': '#8b5cf6',
    'Cancelado': '#ef4444'
  }
  // CORRECCIÓN: Se usaba rep.state, ahora se usa rep.estado para coincidir con la lógica
  const colorEstado = estadoColor[rep.estado] || '#94a3b8'

  return (
    <div style={{ ...styles.glassPanel, backgroundColor: 'rgba(30, 41, 59, 0.4)', padding: '24px', position: 'relative', transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>ORDEN #{rep.id}</p>
          <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold', margin: '4px 0', lineHeight: 1.2 }}>{rep.equipo_marca} {rep.equipo_modelo}</h3>
          <p style={{ color: '#F59E0B', fontSize: '0.85rem', fontWeight: '600' }}>{rep.falla_reportada}</p>
        </div>
        <div style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', backgroundColor: `${colorEstado}22`, color: colorEstado, border: `1px solid ${colorEstado}44`, whiteSpace: 'nowrap' }}>
          {rep.estado}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '25px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: '#F59E0B' }}><Icons.User /></div>
          <div style={{ overflow: 'hidden' }}><span style={{ fontSize: '0.6rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Cliente</span><span style={{ fontSize: '0.85rem', color: 'white', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{rep.cliente_nombre}</span></div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: '#10b981' }}><Icons.Dollar /></div>
          <div><span style={{ fontSize: '0.6rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Total</span><span style={{ fontSize: '0.85rem', color: 'white', fontWeight: '900' }}>S/ {rep.total || 0}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Actualizar Estado:</label>
          <select 
            style={{ ...styles.input, padding: '10px', fontSize: '0.85rem', borderRadius: '10px', cursor: 'pointer' }} 
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
        <button onClick={() => onEdit(rep)} style={{ ...styles.btnIcon, width: '40px', padding: 0, color: '#38bdf8' }} title="Editar"><Icons.Edit /></button>
        <button onClick={() => onDelete(rep.id)} style={{ ...styles.btnIcon, width: '40px', padding: 0, color: '#ef4444' }} title="Eliminar"><Icons.Trash /></button>
      </div>
    </div>
  )
}

// ==========================================
// 🚀 COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  const router = useRouter()
  const [reparaciones, setReparaciones] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [busqueda, setBusqueda] = React.useState('')
  const [editandoId, setEditandoId] = React.useState(null)
  const [notificacion, setNotificacion] = React.useState({ visible: false, mensaje: '', tipo: 'success' })
  
  // CORRECCIÓN: Se agrega 'total' para asegurar que el objeto de estado sea completo
  const estadoInicial = { 
    cliente_nombre: '', cliente_telefono: '', equipo_marca: '', equipo_modelo: '', imei: '',
    falla_reportada: '', diagnostico: '', costo_mano_obra: '', costo_repuestos: '', total: 0, estado: 'Recibido'
  }
  const [form, setForm] = React.useState(estadoInicial)

  const mostrarAviso = (msg, tipo = 'success') => {
    setNotificacion({ visible: true, mensaje: msg, tipo })
    setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: 'success' }), 3000)
  }

  const cargarReparaciones = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('reparaciones').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setReparaciones(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { cargarReparaciones() }, [cargarReparaciones])

  const prepararEdicion = (rep) => {
    setEditandoId(rep.id)
    setForm({ ...rep, diagnostico: rep.diagnostico || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardarReparacion = async () => {
    if (!form.cliente_nombre || !form.equipo_modelo || !form.falla_reportada) return mostrarAviso('Completa los campos obligatorios (*)', 'error')
    
    setLoading(true)
    try {
      const manoObra = Number(form.costo_mano_obra) || 0
      const repuestos = Number(form.costo_repuestos) || 0
      const totalCalculado = manoObra + repuestos
      const datosEnviar = { ...form, costo_mano_obra: manoObra, costo_repuestos: repuestos, total: totalCalculado }

      const { data: sess } = await supabase.auth.getSession()
      if (sess?.session?.user) datosEnviar.creado_por = sess.session.user.id

      if (editandoId) {
        await supabase.from('reparaciones').update(datosEnviar).eq('id', editandoId)
        mostrarAviso('Orden actualizada')
      } else {
        await supabase.from('reparaciones').insert(datosEnviar)
        mostrarAviso('Orden registrada con éxito')
      }
      
      setForm(estadoInicial)
      setEditandoId(null)
      cargarReparaciones()
    } catch (e) {
      mostrarAviso('Error al guardar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await supabase.from('reparaciones').update({ estado: nuevoEstado }).eq('id', id)
      cargarReparaciones()
      mostrarAviso('Estado actualizado')
    } catch (e) {
      mostrarAviso('Error al cambiar estado', 'error')
    }
  }

  const eliminarReparacion = async (id) => {
    if(!confirm('¿Eliminar permanentemente esta orden?')) return
    try {
      await supabase.from('reparaciones').delete().eq('id', id)
      cargarReparaciones()
      mostrarAviso('Orden eliminada')
    } catch (e) {
      mostrarAviso('Error al eliminar', 'error')
    }
  }

  const filtrados = React.useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return reparaciones.filter(r => 
      `${r.cliente_nombre} ${r.equipo_modelo} ${r.imei}`.toLowerCase().includes(q)
    )
  }, [reparaciones, busqueda])

  const metricas = React.useMemo(() => {
    const total = reparaciones.length
    const activos = reparaciones.filter(r => r.estado !== 'Entregado' && r.estado !== 'Cancelado').length
    const listos = reparaciones.filter(r => r.estado === 'Listo').length
    const ingresos = reparaciones.reduce((acc, r) => acc + (Number(r.total) || 0), 0)
    return { total: String(total), activos: String(activos), listos: String(listos), ingresos: String(ingresos) }
  }, [reparaciones])

  return (
    <div style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: `
        .form-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 25px;
          align-items: end;
        }
        .metrics-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .items-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          padding-bottom: 80px;
        }
        .nav-menu {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (max-width: 640px) {
          .form-layout { grid-template-columns: 1fr; gap: 20px; }
          .items-layout { grid-template-columns: 1fr; }
          .hide-mobile { display: none; }
          .nav-menu { width: 100%; margin-top: 15px; }
        }
      `}} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}><Icons.Logo /></div>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>TALLER</span></span>
        </div>
        <div className="nav-menu">
          <button onClick={() => router.push('/inventario')} style={styles.btnIcon}><Icons.Smartphone /><span className="hide-mobile">Inventario</span></button>
          <button onClick={() => router.push('/accesorios')} style={styles.btnIcon}><Icons.Headphones /><span className="hide-mobile">Accesorios</span></button>
        </div>
      </nav>

      <div style={styles.mainWrapper}>
        <div className="metrics-layout">
          <StatCard label="Tickets Totales" value={metricas.total} icon={<Icons.Box />} />
          <StatCard label="En Proceso" value={metricas.activos} color="#3b82f6" icon={<Icons.Wrench />} />
          <StatCard label="Listos" value={metricas.listos} color="#10b981" icon={<Icons.Check />} />
          <StatCard label="Total Caja" value={`S/ ${metricas.ingresos}`} color="#94a3b8" icon={<Icons.Dollar />} />
        </div>

        <div style={{ ...styles.glassPanel, padding: '35px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                {editandoId ? <Icons.Edit /> : <Icons.Plus />}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', margin: 0 }}>{editandoId ? 'Editar Ticket' : 'Nuevo Ingreso a Taller'}</h2>
          </div>
          
          <div className="form-layout">
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cliente *</label>
              <input style={styles.input} value={form.cliente_nombre} onChange={e=>setForm({...form, cliente_nombre:e.target.value})} placeholder="Nombre completo" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Teléfono</label>
              <input style={styles.input} value={form.cliente_telefono} onChange={e=>setForm({...form, cliente_telefono:e.target.value})} placeholder="999 999 999" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Marca Equipo</label>
              <input style={styles.input} value={form.equipo_marca} onChange={e=>setForm({...form, equipo_marca:e.target.value})} placeholder="Ej. Samsung" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Modelo *</label>
              <input style={styles.input} value={form.equipo_modelo} onChange={e=>setForm({...form, equipo_modelo:e.target.value})} placeholder="Ej. Galaxy S24" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>IMEI / Serial</label>
              <input style={{...styles.input, fontFamily: 'monospace'}} value={form.imei} onChange={e=>setForm({...form, imei:e.target.value})} placeholder="Escanea o escribe..." />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mano de Obra</label>
              <input type="number" style={styles.input} value={form.costo_mano_obra} onChange={e=>setForm({...form, costo_mano_obra:e.target.value})} placeholder="0.00" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Repuestos</label>
              <input type="number" style={styles.input} value={form.costo_repuestos} onChange={e=>setForm({...form, costo_repuestos:e.target.value})} placeholder="0.00" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Estado Inicial</label>
              <select style={styles.input} value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
                  <option value="Recibido">Recibido</option>
                  <option value="Diagnóstico">Diagnóstico</option>
                  <option value="En reparación">En reparación</option>
              </select>
            </div>
            <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
              <label style={styles.label}>Falla Reportada *</label>
              <input style={styles.input} value={form.falla_reportada} onChange={e=>setForm({...form, falla_reportada:e.target.value})} placeholder="Describa el problema..." />
            </div>
            <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
              <label style={styles.label}>Diagnóstico Técnico</label>
              <textarea style={{...styles.input, height: '100px', resize: 'vertical'}} value={form.diagnostico} onChange={e=>setForm({...form, diagnostico:e.target.value})} placeholder="Resultados de la revisión..." />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button onClick={guardarReparacion} style={{ ...styles.btnPrimary, flex: 2 }}>{editandoId ? 'Guardar Cambios' : 'Crear Orden de Servicio'}</button>
            {editandoId && <button onClick={() => { setEditandoId(null); setForm(estadoInicial); }} style={{ ...styles.btnPrimary, flex: 1, background: 'transparent', border: '1px solid #475569', color: '#94a3b8', boxShadow: 'none' }}>Cancelar</button>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>Historial de Taller</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <div style={{ position: 'absolute', top: '15px', left: '16px', color: '#64748b' }}><Icons.Search /></div>
              <input style={{ ...styles.input, paddingLeft: '50px', borderRadius: '99px', background: 'rgba(0,0,0,0.3)' }} placeholder="Buscar por cliente o imei..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
          </div>
        </div>

        <div className="items-layout">
          {filtrados.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#64748b' }}>No se encontraron órdenes activas.</div>
          ) : (
              filtrados.map((rep) => <RepairCard key={rep.id} rep={rep} onCambiarEstado={cambiarEstado} onDelete={eliminarReparacion} onEdit={prepararEdicion} />)
          )}
        </div>
      </div>

      {/* NOTIFICACIONES */}
      {notificacion.visible && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', padding: '15px 25px', borderRadius: '16px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderLeft: `5px solid ${notificacion.tipo === 'error' ? '#ef4444' : '#10b981'}`, color: 'white', fontWeight: 'bold', zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          {notificacion.mensaje}
        </div>
      )}
    </div>
  )
}