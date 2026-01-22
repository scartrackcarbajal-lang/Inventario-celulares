import { useState, useEffect } from 'react'
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
  iconButtonSmall: {
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
}

const Icons = {
  Logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Headphones: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
  Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Box: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Smartphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
}

export default function Accesorios() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVenta, setModalVenta] = useState(null)
  const [cantidadVenta, setCantidadVenta] = useState(1)
  
  // Estado para Edición
  const [editandoItem, setEditandoItem] = useState(null)
  
  // Formulario
  const estadoInicial = { nombre: '', marca: '', precio_costo: '', precio_venta: '', cantidad_inicial: 0 }
  const [form, setForm] = useState(estadoInicial)

  const cargarAccesorios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_bulk')
      .select(`sku_id, stock, skus:sku_id ( id, sku_codigo, precio_venta, precio_costo, productos:producto_id ( id, nombre, marca, descripcion ) )`)
      .order('stock', { ascending: false })
    
    setLoading(false)
    if (error) return alert('Error: ' + error.message)
    setItems(data || [])
  }

  useEffect(() => { cargarAccesorios() }, [])

  // --- PREPARAR EDICIÓN ---
  const prepararEdicion = (item) => {
    setEditandoItem(item)
    setForm({
      nombre: item.skus.productos.nombre,
      marca: item.skus.productos.marca,
      precio_costo: item.skus.precio_costo,
      precio_venta: item.skus.precio_venta,
      cantidad_inicial: item.stock // Al editar, esto sobreescribe el stock actual
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- GUARDAR (Crear o Actualizar) ---
  const guardarAccesorio = async () => {
    if (!form.nombre || !form.marca) return alert('Faltan datos obligatorios')

    try {
      setLoading(true)

      // 1. Obtener/Crear Categoría "Accesorios"
      const { data: cat } = await supabase.from('categorias').select('id').eq('nombre', 'Accesorios').maybeSingle()
      let catId = cat?.id
      if (!catId) {
        const { data: newCat } = await supabase.from('categorias').insert({ nombre: 'Accesorios' }).select('id').single()
        catId = newCat.id
      }

      if (editandoItem) {
        // --- MODO EDICIÓN ---
        const prodId = editandoItem.skus.productos.id
        const skuId = editandoItem.skus.id

        // Actualizar Producto
        await supabase.from('productos')
          .update({ nombre: form.nombre, marca: form.marca })
          .eq('id', prodId)

        // Actualizar SKU (Precios)
        await supabase.from('skus')
          .update({ precio_costo: form.precio_costo, precio_venta: form.precio_venta })
          .eq('id', skuId)

        // Actualizar Stock
        await supabase.from('stock_bulk')
          .update({ stock: form.cantidad_inicial })
          .eq('sku_id', skuId)

        alert('Accesorio Actualizado')
        setEditandoItem(null)

      } else {
        // --- MODO CREACIÓN ---
        // 2. Producto
        const { data: prod, error: errProd } = await supabase.from('productos')
          .insert({ categoria_id: catId, nombre: form.nombre, marca: form.marca, activo: true })
          .select('id').single()
        if (errProd) throw errProd

        // 3. SKU
        const { data: sku, error: errSku } = await supabase.from('skus')
          .insert({
            producto_id: prod.id,
            sku_codigo: `ACC-${Date.now()}`,
            tracking: 'BULK',
            precio_costo: form.precio_costo || 0,
            precio_venta: form.precio_venta || 0,
            publicado: true
          })
          .select('id').single()
        if (errSku) throw errSku

        // 4. Stock Bulk
        await supabase.from('stock_bulk').insert({
          sku_id: sku.id,
          stock: form.cantidad_inicial || 0
        })

        alert('Accesorio Registrado')
      }

      setForm(estadoInicial)
      cargarAccesorios()

    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  // --- ELIMINAR ---
  const eliminarAccesorio = async (skuId) => {
    if(!confirm('¿Estás seguro de eliminar este accesorio? Se borrará del inventario.')) return
    
    // Al ser una relación en cascada, a veces basta con borrar el SKU o el Producto.
    // Intentaremos borrar el SKU, lo cual debería borrar el stock_bulk asociado.
    const { error } = await supabase.from('skus').delete().eq('id', skuId)
    
    if (error) return alert('Error al eliminar: ' + error.message)
    
    alert('Accesorio eliminado')
    cargarAccesorios()
  }

  const confirmarVenta = async () => {
    if (!modalVenta) return
    const cant = Number(cantidadVenta)
    if (cant <= 0 || cant > modalVenta.stock) return alert('Cantidad inválida')

    try {
      setLoading(true)
      const skuId = modalVenta.skus.id
      const precioUnit = modalVenta.skus.precio_venta
      
      const { error: errVenta } = await supabase.from('ventas_v2').insert({ sku_id: skuId, item_serializado_id: null, cantidad: cant, precio_lista: precioUnit, precio_final: precioUnit * cant, tipo_venta: 'BULK' })
      if (errVenta) throw errVenta
      
      const { error: errStock } = await supabase.from('stock_bulk').update({ stock: modalVenta.stock - cant }).eq('sku_id', skuId)
      if (errStock) throw errStock

      alert('Venta realizada con éxito 💰')
      setModalVenta(null)
      cargarAccesorios()
    } catch (e) { alert('Error: ' + e.message) } finally { setLoading(false) }
  }

  return (
    <div style={styles.container}>
      {/* ⚠️ ESTILOS CSS RESPONSIVOS */}
      <style>{`
        .page-wrapper { padding: 30px; max-width: 1400px; margin: 0 auto; }
        .form-grid { display: grid; gap: 20px; grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1024px) { .form-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { 
           .form-grid { grid-template-columns: 1fr; }
           .navbar-content { flex-direction: column; gap: 15px; }
           .nav-menu { width: 100%; justify-content: space-between; overflow-x: auto; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="navbar-content" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}><Icons.Logo /></div><span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>ACCESORIOS</span></span></div>
        <div className="nav-menu" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => router.push('/inventario')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: 'transparent', color: '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Inventario</button>
          <button onClick={() => router.push('/servicios_tecnicos')} style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: 'transparent', color: '#94a3b8', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Taller</button>
          <button style={{ ...styles.btnIcon, width: 'auto', padding: '0 20px', borderRadius: '12px', background: '#F59E0B', color: 'black', border: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Accesorios</button>
        </div>
      </nav>

      <div className="page-wrapper">
        {/* FORMULARIO */}
        <div style={{ ...styles.glassPanel, padding: '40px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
               {editandoItem ? <Icons.Edit /> : <Icons.Box />}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
               {editandoItem ? 'Editar Accesorio' : 'Ingresar Nuevo Stock'}
            </h2>
          </div>

          <div className="form-grid">
            <div><label style={styles.label}>Marca</label><input style={styles.input} placeholder="Ej. Samsung" value={form.marca} onChange={e=>setForm({...form, marca: e.target.value})} /></div>
            <div><label style={styles.label}>Producto</label><input style={styles.input} placeholder="Ej. Cargador 25W" value={form.nombre} onChange={e=>setForm({...form, nombre: e.target.value})} /></div>
            <div><label style={styles.label}>Costo Unitario</label><input type="number" style={styles.input} placeholder="0.00" value={form.precio_costo} onChange={e=>setForm({...form, precio_costo: e.target.value})} /></div>
            <div><label style={{...styles.label, color: '#F59E0B'}}>Precio Venta</label><input type="number" style={{...styles.input, borderColor: '#F59E0B', color: '#F59E0B', fontWeight: 'bold'}} placeholder="0.00" value={form.precio_venta} onChange={e=>setForm({...form, precio_venta: e.target.value})} /></div>
            <div><label style={styles.label}>Stock Total</label><input type="number" style={styles.input} placeholder="0" value={form.cantidad_inicial} onChange={e=>setForm({...form, cantidad_inicial: e.target.value})} /></div>
          </div>
          
          <button onClick={guardarAccesorio} style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center', marginTop: '30px', fontSize: '1.1rem', padding: '16px' }}>
            {loading ? 'Guardando...' : (editandoItem ? 'Actualizar Accesorio' : 'Registrar en Inventario')}
          </button>
          
          {editandoItem && (
            <button 
              onClick={() => { setEditandoItem(null); setForm(estadoInicial); }} 
              style={{ width: '100%', background: 'transparent', color: '#94a3b8', border: '1px solid #94a3b8', padding: '12px', borderRadius: '16px', marginTop: '10px', cursor: 'pointer' }}
            >
              Cancelar Edición
            </button>
          )}
        </div>

        {/* LISTA DE STOCK */}
        <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.5rem', fontWeight: '900' }}>Inventario Disponible</h2>
        <div style={styles.grid}>
          {items.map((item, i) => (
            <div key={i} style={{ ...styles.glassPanel, padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{item.skus.productos.marca}</p>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1.2 }}>{item.skus.productos.nombre}</h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: 'rgba(2, 6, 23, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Stock Disponible</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: item.stock < 5 ? '#ef4444' : 'white' }}>{item.stock}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>Costo: S/{item.skus.precio_costo}</span>
                <span>Venta: <b style={{color: 'white'}}>S/{item.skus.precio_venta}</b></span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => { setModalVenta(item); setCantidadVenta(1); }}
                  style={{ ...styles.btnPrimary, flex: 2, marginTop: 0, background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: 'none' }}
                >
                  <Icons.Dollar /> VENDER
                </button>
                <button onClick={() => prepararEdicion(item)} style={{ ...styles.iconButtonSmall, color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }} title="Editar"><Icons.Edit /></button>
                <button onClick={() => eliminarAccesorio(item.skus.id)} style={{ ...styles.iconButtonSmall, color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} title="Eliminar"><Icons.Trash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VENTA */}
      {modalVenta && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ ...styles.glassPanel, width: '100%', maxWidth: '400px', padding: '30px', backgroundColor: '#0f172a' }}>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.5rem', color: 'white' }}>Vender Accesorio</h2>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{modalVenta.skus.productos.nombre}</p>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={styles.label}>Cantidad a vender (Max: {modalVenta.stock})</label>
              <input 
                type="number" 
                autoFocus
                style={{ ...styles.input, fontSize: '2rem', textAlign: 'center', color: '#F59E0B', fontWeight: 'bold', borderColor: '#F59E0B' }} 
                value={cantidadVenta} 
                onChange={e => setCantidadVenta(e.target.value)}
                min="1" max={modalVenta.stock}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setModalVenta(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={confirmarVenta} style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}