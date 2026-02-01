import { useState, useEffect } from 'react'
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
    paddingBottom: '60px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  Headphones: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
  Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Box: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>,
  Smartphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
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

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [editandoItem, setEditandoItem] = useState(null)
  const [modalVenta, setModalVenta] = useState(null)
  const [cantidadVenta, setCantidadVenta] = useState(1)
  
  const estadoInicial = { nombre: '', marca: '', precio_costo: '', precio_venta: '', cantidad_inicial: 0 }
  const [form, setForm] = useState(estadoInicial)

  const cargarAccesorios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_bulk')
      .select(`sku_id, stock, skus:sku_id ( id, sku_codigo, precio_venta, precio_costo, productos:producto_id ( id, nombre, marca, descripcion ) )`)
      .order('stock', { ascending: false })
    
    setLoading(false)
    if (!error) setItems(data || [])
  }

  useEffect(() => { cargarAccesorios() }, [])

  const prepararEdicion = (item) => {
    setEditandoItem(item)
    setForm({
      nombre: item.skus.productos.nombre,
      marca: item.skus.productos.marca,
      precio_costo: item.skus.precio_costo,
      precio_venta: item.skus.precio_venta,
      cantidad_inicial: item.stock
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardarAccesorio = async () => {
    if (!form.nombre || !form.marca) return alert('Marca y Producto son obligatorios')

    setLoading(true)
    try {
      const { data: cat } = await supabase.from('categorias').select('id').eq('nombre', 'Accesorios').maybeSingle()
      let catId = cat?.id
      if (!catId) {
        const { data: newCat } = await supabase.from('categorias').insert({ nombre: 'Accesorios' }).select('id').single()
        catId = newCat.id
      }

      if (editandoItem) {
        const skuId = editandoItem.skus.id
        const prodId = editandoItem.skus.productos.id

        await supabase.from('productos').update({ nombre: form.nombre, marca: form.marca }).eq('id', prodId)
        await supabase.from('skus').update({ precio_costo: form.precio_costo, precio_venta: form.precio_venta }).eq('id', skuId)
        await supabase.from('stock_bulk').update({ stock: form.cantidad_inicial }).eq('sku_id', skuId)

        alert('Accesorio actualizado')
        setEditandoItem(null)
      } else {
        const { data: prod } = await supabase.from('productos').insert({ categoria_id: catId, nombre: form.nombre, marca: form.marca, activo: true }).select('id').single()
        const { data: sku } = await supabase.from('skus').insert({ producto_id: prod.id, sku_codigo: `ACC-${Date.now()}`, tracking: 'BULK', precio_costo: form.precio_costo || 0, precio_venta: form.precio_venta || 0, publicado: true }).select('id').single()
        await supabase.from('stock_bulk').insert({ sku_id: sku.id, stock: form.cantidad_inicial || 0 })

        alert('Accesorio registrado')
      }

      setForm(estadoInicial)
      cargarAccesorios()
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const eliminarAccesorio = async (skuId) => {
    if(!confirm('¿Eliminar este accesorio? Se borrará todo el stock asociado.')) return
    const { error } = await supabase.from('skus').delete().eq('id', skuId)
    if (!error) cargarAccesorios()
  }

  const confirmarVenta = async () => {
    if (!modalVenta) return
    const cant = Number(cantidadVenta)
    if (cant <= 0 || cant > modalVenta.stock) return alert('Cantidad inválida')

    const skuId = modalVenta.skus.id
    const precioUnit = modalVenta.skus.precio_venta
    
    await supabase.from('ventas_v2').insert({ sku_id: skuId, item_serializado_id: null, cantidad: cant, precio_lista: precioUnit, precio_final: precioUnit * cant, tipo_venta: 'BULK' })
    await supabase.from('stock_bulk').update({ stock: modalVenta.stock - cant }).eq('sku_id', skuId)

    alert('Venta realizada 💰')
    setModalVenta(null)
    cargarAccesorios()
  }

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return items.filter(item => 
      `${item.skus.productos.marca} ${item.skus.productos.nombre}`.toLowerCase().includes(q)
    )
  }, [items, busqueda])

  const metricas = useMemo(() => {
    const totalItems = items.length
    const stockTotal = items.reduce((acc, i) => acc + i.stock, 0)
    const valorVenta = items.reduce((acc, i) => acc + (i.stock * i.skus.precio_venta), 0)
    const valorCosto = items.reduce((acc, i) => acc + (i.stock * i.skus.precio_costo), 0)
    return { 
        total: String(totalItems), 
        stock: String(stockTotal), 
        venta: String(valorVenta), 
        costo: String(valorCosto) 
    }
  }, [items])

  return (
    <div style={styles.container}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icons.Logo />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>ACCESORIOS</span></span>
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', padding: '4px' }}>
          <button onClick={() => router.push('/inventario')} style={styles.btnIcon}>
            <Icons.Smartphone /> Celulares
          </button>
          <button onClick={() => router.push('/servicios_tecnicos')} style={styles.btnIcon}>
            <Icons.Wrench /> Taller
          </button>
        </div>
      </nav>

      <div style={styles.mainWrapper}>
        <div style={styles.responsiveStatsGrid}>
          <StatCard label="Modelos" value={metricas.total} icon={<Icons.Box />} />
          <StatCard label="Unidades Stock" value={metricas.stock} color="#3b82f6" icon={<Icons.Plus />} />
          <StatCard label="Inversión" value={`S/ ${metricas.costo}`} color="#94a3b8" icon={<Icons.Dollar />} />
          <StatCard label="Capital Venta" value={`S/ ${metricas.venta}`} color="#10b981" icon={<Icons.Dollar />} />
        </div>

        <div style={{ ...styles.glassPanel, padding: '25px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                {editandoItem ? <Icons.Edit /> : <Icons.Plus />}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{editandoItem ? 'Editar Accesorio' : 'Nuevo Stock'}</h2>
          </div>
          <div style={styles.formGrid}>
            <div><label style={styles.label}>Marca *</label><input style={styles.input} value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})} placeholder="Ej. Apple" /></div>
            <div><label style={styles.label}>Producto *</label><input style={styles.input} value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} placeholder="Ej. Cargador 20W" /></div>
            <div><label style={styles.label}>Costo Unitario</label><input type="number" style={styles.input} value={form.precio_costo} onChange={e=>setForm({...form, precio_costo:e.target.value})} placeholder="0.00" /></div>
            <div><label style={{...styles.label, color: '#F59E0B'}}>Precio Venta</label><input type="number" style={{...styles.input, borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B', fontWeight: 'bold'}} value={form.precio_venta} onChange={e=>setForm({...form, precio_venta:e.target.value})} placeholder="0.00" /></div>
            <div><label style={styles.label}>{editandoItem ? 'Stock Actual' : 'Cantidad Inicial'}</label><input type="number" style={styles.input} value={form.cantidad_inicial} onChange={e=>setForm({...form, cantidad_inicial:e.target.value})} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px', flexWrap: 'wrap' }}>
            <button onClick={guardarAccesorio} style={styles.btnPrimary}>{editandoItem ? 'Actualizar Datos' : 'Registrar Stock'}</button>
            {editandoItem && <button onClick={() => { setEditandoItem(null); setForm(estadoInicial); }} style={{ ...styles.btnPrimary, background: 'transparent', border: '1px solid #64748b', color: '#94a3b8' }}>Cancelar</button>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', margin: 0 }}>Stock de Accesorios</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <div style={{ position: 'absolute', top: '12px', left: '14px', color: '#94a3b8' }}>
                  <Icons.Search />
              </div>
              <input style={{ ...styles.input, paddingLeft: '45px' }} placeholder="Buscar accesorio..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
          </div>
        </div>

        <div style={styles.responsiveCardsGrid}>
          {filtrados.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b' }}>No hay accesorios en lista</p>
          ) : (
              filtrados.map((item, i) => (
                <div key={i} style={{ ...styles.glassPanel, padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ color: '#F59E0B', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.skus.productos.marca}</p>
                    <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold', margin: '4px 0' }}>{item.skus.productos.nombre}</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(2, 6, 23, 0.4)', padding: '12px', borderRadius: '12px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>STOCK</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: item.stock < 5 ? '#ef4444' : 'white' }}>{item.stock}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                    <span style={{ color: '#64748b' }}>Costo: S/ {item.skus.precio_costo}</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Venta: S/ {item.skus.precio_venta}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button onClick={() => { setModalVenta(item); setCantidadVenta(1); }} style={{ ...styles.btnPrimary, flex: 2, padding: '10px' }}>VENDER</button>
                    <button onClick={() => prepararEdicion(item)} style={{ ...styles.btnIcon, width: '40px', padding: 0 }}><Icons.Edit /></button>
                    <button onClick={() => eliminarAccesorio(item.skus.id)} style={{ ...styles.btnIcon, width: '40px', padding: 0, color: '#ef4444' }}><Icons.Trash /></button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {modalVenta && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ ...styles.glassPanel, width: '100%', maxWidth: '400px', padding: '25px', backgroundColor: '#0f172a' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: 'white' }}>Vender Accesorio</h2>
            <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '0.9rem' }}>{modalVenta.skus.productos.nombre}</p>
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Cantidad (Max: {modalVenta.stock})</label>
              <input type="number" autoFocus style={{ ...styles.input, fontSize: '1.8rem', textAlign: 'center', color: '#F59E0B' }} value={cantidadVenta} onChange={e=>setCantidadVenta(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={()=>setModalVenta(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', cursor: 'pointer' }}>Cerrar</button>
              <button onClick={confirmarVenta} style={{ ...styles.btnPrimary, flex: 1 }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}