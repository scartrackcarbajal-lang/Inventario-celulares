import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
  },
  specBox: {
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  }
}

const Icons = {
  Logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Smartphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Box: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
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

// ==========================================
// 🚀 COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  const router = useRouter()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [busqueda, setBusqueda] = React.useState('')
  const [editandoItem, setEditandoItem] = React.useState(null)
  const [modalVenta, setModalVenta] = React.useState(null)
  const [cantidadVenta, setCantidadVenta] = React.useState(1)
  const [notificacion, setNotificacion] = React.useState({ visible: false, mensaje: '', tipo: 'success' })
  
  const estadoInicial = { nombre: '', marca: '', precio_costo: '', precio_venta: '', cantidad_inicial: 0 }
  const [form, setForm] = React.useState(estadoInicial)

  const mostrarAviso = (msg, tipo = 'success') => {
    setNotificacion({ visible: true, mensaje: msg, tipo })
    setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: 'success' }), 3000)
  }

  const cargarAccesorios = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('stock_bulk')
        .select(`sku_id, stock, skus:sku_id ( id, sku_codigo, precio_venta, precio_costo, productos:producto_id ( id, nombre, marca, descripcion ) )`)
        .order('stock', { ascending: false })
      
      if (error) throw error
      setItems(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { cargarAccesorios() }, [cargarAccesorios])

  const prepararEdicion = (item) => {
    setEditandoItem(item)
    setForm({
      nombre: item.skus?.productos?.nombre || '',
      marca: item.skus?.productos?.marca || '',
      precio_costo: item.skus?.precio_costo || 0,
      precio_venta: item.skus?.precio_venta || 0,
      cantidad_inicial: item.stock || 0
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardarAccesorio = async () => {
    if (!form.nombre || !form.marca) return mostrarAviso('Marca y Producto son obligatorios', 'error')
    setLoading(true)
    try {
      const { data: cat } = await supabase.from('categorias').select('id').eq('nombre', 'Accesorios').maybeSingle()
      let catId = cat?.id 
      
      if (!catId) {
        const res = await supabase.from('categorias').insert({ nombre: 'Accesorios' }).select('id').single()
        catId = res.data?.id
      }

      if (editandoItem) {
        const skuId = editandoItem.skus?.id
        const prodId = editandoItem.skus?.productos?.id

        if (prodId) await supabase.from('productos').update({ nombre: form.nombre, marca: form.marca }).eq('id', prodId)
        if (skuId) {
          await supabase.from('skus').update({ precio_costo: form.precio_costo, precio_venta: form.precio_venta }).eq('id', skuId)
          await supabase.from('stock_bulk').update({ stock: form.cantidad_inicial }).eq('sku_id', skuId)
        }
        mostrarAviso('Accesorio actualizado')
        setEditandoItem(null)
      } else {
        const { data: prod } = await supabase.from('productos').insert({ categoria_id: catId, nombre: form.nombre, marca: form.marca, activo: true }).select('id').single()
        const { data: sku } = await supabase.from('skus').insert({ producto_id: prod?.id, sku_codigo: `ACC-${Date.now()}`, tracking: 'BULK', precio_costo: form.precio_costo || 0, precio_venta: form.precio_venta || 0, publicado: true }).select('id').single()
        if (sku?.id) await supabase.from('stock_bulk').insert({ sku_id: sku.id, stock: form.cantidad_inicial || 0 })
        mostrarAviso('Registro exitoso')
      }
      setForm(estadoInicial); cargarAccesorios()
    } catch (e) {
      mostrarAviso('Error al procesar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const eliminarAccesorio = async (skuId) => {
    if(!confirm('¿Eliminar este accesorio?')) return
    const { error } = await supabase.from('skus').delete().eq('id', skuId)
    if (!error) {
      mostrarAviso('Eliminado correctamente')
      cargarAccesorios()
    }
  }

  const confirmarVenta = async () => {
    if (!modalVenta) return
    const cant = Number(cantidadVenta)
    if (cant <= 0 || cant > modalVenta.stock) return mostrarAviso('Cantidad inválida', 'error')

    const skuId = modalVenta.skus?.id
    const precioUnit = modalVenta.skus?.precio_venta || 0
    
    await supabase.from('ventas_v2').insert({ sku_id: skuId, item_serializado_id: null, cantidad: cant, precio_lista: precioUnit, precio_final: precioUnit * cant, tipo_venta: 'BULK' })
    await supabase.from('stock_bulk').update({ stock: modalVenta.stock - cant }).eq('sku_id', skuId)

    mostrarAviso('Venta registrada 💰')
    setModalVenta(null); cargarAccesorios()
  }

  const filtrados = React.useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return items
    return items.filter(item => 
      `${item.skus?.productos?.marca} ${item.skus?.productos?.nombre}`.toLowerCase().includes(q)
    )
  }, [items, busqueda])

  const metricas = React.useMemo(() => {
    const totalCount = items.length
    const stockSum = items.reduce((acc, i) => acc + (i.stock || 0), 0)
    const ventaSum = items.reduce((acc, i) => acc + ((i.stock || 0) * (i.skus?.precio_venta || 0)), 0)
    const costoSum = items.reduce((acc, i) => acc + ((i.stock || 0) * (i.skus?.precio_costo || 0)), 0)
    return { 
        total: String(totalCount), 
        stock: String(stockSum), 
        venta: String(ventaSum), 
        costo: String(costoSum) 
    }
  }, [items])

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
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .spec-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
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
          .specs-grid { grid-template-columns: 1fr; }
          .hide-mobile { display: none; }
          .nav-menu { width: 100%; margin-top: 15px; }
        }
      `}} />

      {/* NAVBAR FLEXIBLE */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}><Icons.Logo /></div>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>ACCESORIOS</span></span>
        </div>
        <div className="nav-menu">
          <button onClick={() => router.push('/inventario')} style={styles.btnIcon}><Icons.Smartphone /><span className="hide-mobile">Inventario</span></button>
          <button onClick={() => router.push('/servicios_tecnicos')} style={styles.btnIcon}><Icons.Wrench /><span className="hide-mobile">Taller</span></button>
        </div>
      </nav>

      <div style={styles.mainWrapper}>
        <div className="metrics-layout">
          <StatCard label="Modelos" value={metricas.total} icon={<Icons.Box />} />
          <StatCard label="Stock Total" value={metricas.stock} color="#3b82f6" icon={<Icons.Plus />} />
          <StatCard label="Inversión" value={`S/ ${metricas.costo}`} color="#94a3b8" icon={<Icons.Dollar />} />
          <StatCard label="Capital Venta" value={`S/ ${metricas.venta}`} color="#10b981" icon={<Icons.Dollar />} />
        </div>

        <div style={{ ...styles.glassPanel, padding: '35px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                {editandoItem ? <Icons.Edit /> : <Icons.Plus />}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', margin: 0 }}>{editandoItem ? 'Editar Producto' : 'Ingresar Nuevo Stock'}</h2>
          </div>
          
          <div className="form-layout">
            <div style={styles.inputGroup}>
              <label style={styles.label}>Marca *</label>
              <input style={styles.input} value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})} placeholder="Ej. Apple" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Producto *</label>
              <input style={styles.input} value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} placeholder="Ej. Funda Silicone" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Costo Unitario</label>
              <input type="number" style={styles.input} value={form.precio_costo} onChange={e=>setForm({...form, precio_costo:e.target.value})} placeholder="0.00" />
            </div>
            <div style={styles.inputGroup}>
              <label style={{...styles.label, color: '#F59E0B'}}>Precio Venta</label>
              <input type="number" style={{...styles.input, borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B', fontWeight: 'bold'}} value={form.precio_venta} onChange={e=>setForm({...form, precio_venta:e.target.value})} placeholder="0.00" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{editandoItem ? 'Stock Total' : 'Cantidad Inicial'}</label>
              <input type="number" style={styles.input} value={form.cantidad_inicial} onChange={e=>setForm({...form, cantidad_inicial:e.target.value})} />
            </div>
            <div>
              <button onClick={guardarAccesorio} style={styles.btnPrimary}>{editandoItem ? 'Actualizar' : 'Registrar'}</button>
            </div>
          </div>
          {editandoItem && <button onClick={() => { setEditandoItem(null); setForm(estadoInicial); }} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'underline', marginTop: '10px' }}>Cancelar edición</button>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>Inventario de Accesorios</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <div style={{ position: 'absolute', top: '15px', left: '16px', color: '#64748b' }}><Icons.Search /></div>
              <input style={{ ...styles.input, paddingLeft: '50px', borderRadius: '99px', background: 'rgba(0,0,0,0.3)' }} placeholder="Buscar marca o producto..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
          </div>
        </div>

        <div className="items-layout">
          {filtrados.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#64748b' }}>No hay resultados disponibles.</div>
          ) : (
              filtrados.map((item, i) => (
                <div key={item.sku_id || i} style={{ ...styles.glassPanel, padding: '30px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}>
                  <div style={{ marginBottom: '25px' }}>
                    <p style={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>{item.skus?.productos?.marca || 'S/M'}</p>
                    <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: '800', margin: 0, lineHeight: 1.2 }}>{item.skus?.productos?.nombre || 'Producto'}</h3>
                  </div>

                  <div className="specs-grid">
                    <div className="spec-item">
                      <div style={{ color: (item.stock || 0) < 5 ? '#ef4444' : '#F59E0B' }}><Icons.Box /></div>
                      <div><span style={styles.label}>Stock</span><span style={{ color: 'white', fontWeight: '900', fontSize: '1.1rem' }}>{item.stock || 0}</span></div>
                    </div>
                    <div className="spec-item">
                      <div style={{ color: '#10b981' }}><Icons.Dollar /></div>
                      <div><span style={styles.label}>Venta</span><span style={{ color: 'white', fontWeight: '900', fontSize: '1.1rem' }}>S/ {item.skus?.precio_venta || 0}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '25px' }}>
                    <span>Costo: S/ {item.skus?.precio_costo || 0}</span>
                    <span>SKU: {item.skus?.sku_codigo ? item.skus.sku_codigo.split('-')[1] : '---'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button onClick={() => { setModalVenta(item); setCantidadVenta(1); }} style={{ ...styles.btnPrimary, flex: 2 }}>VENDER</button>
                    <button onClick={() => prepararEdicion(item)} style={{ ...styles.btnIcon, width: '50px', padding: 0 }} title="Editar"><Icons.Edit /></button>
                    <button onClick={() => eliminarAccesorio(item.skus?.id)} style={{ ...styles.btnIcon, width: '50px', padding: 0, color: '#ef4444' }} title="Eliminar"><Icons.Trash /></button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {modalVenta && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ ...styles.glassPanel, width: '100%', maxWidth: '420px', padding: '35px', backgroundColor: '#0f172a' }}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ color: '#10b981', marginBottom: '15px' }}><Icons.Dollar /></div>
              <h2 style={{ fontSize: '1.6rem', color: 'white', margin: '0 0 5px 0' }}>Registrar Venta</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{modalVenta.skus?.productos?.nombre || 'Producto'}</p>
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ ...styles.label, textAlign: 'center' }}>Cantidad (Max: {modalVenta.stock})</label>
              <input type="number" autoFocus style={{ ...styles.input, fontSize: '2.5rem', textAlign: 'center', color: '#F59E0B', fontWeight: '900', border: '2px solid #F59E0B' }} value={cantidadVenta} onChange={e=>setCantidadVenta(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={()=>setModalVenta(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}>Cerrar</button>
              <button onClick={confirmarVenta} style={{ ...styles.btnPrimary, flex: 1.5 }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICACIONES */}
      {notificacion.visible && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', padding: '15px 25px', borderRadius: '16px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderLeft: `5px solid ${notificacion.tipo === 'error' ? '#ef4444' : '#10b981'}`, color: 'white', fontWeight: 'bold', zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          {notificacion.mensaje}
        </div>
      )}
    </div>
  )
}