import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Accesorios() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Formulario para Nuevo Accesorio
  const [form, setForm] = useState({ 
    nombre: '', 
    marca: '', 
    precio_costo: '', 
    precio_venta: '', 
    cantidad_inicial: 0 
  })

  // Estado para Venta
  const [modalVenta, setModalVenta] = useState(null)
  const [cantidadVenta, setCantidadVenta] = useState(1)

  // --- ESTILOS COMPARTIDOS (Mismo Tema) ---
  const theme = {
    navy: '#0b1426',
    card: '#162447',
    orange: '#f39c12',
    cyan: '#00d2ff',
    white: '#ffffff',
    gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)',
  }

  const inputStyle = {
    padding: '16px', borderRadius: '15px', border: '1px solid #25335a',
    background: '#0b1426', color: 'white', outline: 'none', fontSize: '1rem',
    width: '100%', boxSizing: 'border-box', marginBottom: '15px'
  }

  const btnStyle = {
    padding: '12px 20px', borderRadius: '50px', border: 'none', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '0.9rem', transition: 'transform 0.2s',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
  }

  // --- CARGAR DATOS ---
  const cargarAccesorios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_bulk')
      .select(`
        sku_id, stock,
        skus:sku_id (
          id, sku_codigo, precio_venta, precio_costo,
          productos:producto_id ( nombre, marca, descripcion )
        )
      `)
      .order('stock', { ascending: false }) // Mostrar primero los que tienen más stock
    
    setLoading(false)
    if (error) {
      alert('Error cargando accesorios: ' + error.message)
      return
    }
    setItems(data || [])
  }

  useEffect(() => {
    cargarAccesorios()
  }, [])

  // --- GUARDAR ---
  const guardarAccesorio = async () => {
    if (!form.nombre || !form.marca) return alert('Faltan datos obligatorios')

    try {
      setLoading(true)
      // 1. Categoría
      const { data: cat } = await supabase.from('categorias').select('id').eq('nombre', 'Accesorios').maybeSingle()
      let catId = cat?.id
      if (!catId) {
        const { data: newCat } = await supabase.from('categorias').insert({ nombre: 'Accesorios' }).select('id').single()
        catId = newCat.id
      }

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
      const { error: errBulk } = await supabase.from('stock_bulk').insert({
        sku_id: sku.id,
        stock: form.cantidad_inicial || 0
      })
      if (errBulk) throw errBulk

      alert('¡Accesorio Guardado!')
      setForm({ nombre: '', marca: '', precio_costo: '', precio_venta: '', cantidad_inicial: 0 })
      cargarAccesorios()

    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  // --- VENDER ---
  const confirmarVenta = async () => {
    if (!modalVenta) return
    const cant = Number(cantidadVenta)
    if (cant <= 0 || cant > modalVenta.stock) return alert('Cantidad inválida')

    try {
      setLoading(true)
      const skuId = modalVenta.skus.id
      const precioUnit = modalVenta.skus.precio_venta
      
      // 1. Registrar Venta
      const { error: errVenta } = await supabase.from('ventas_v2').insert({
        sku_id: skuId,
        item_serializado_id: null,
        cantidad: cant,
        precio_lista: precioUnit,
        precio_final: precioUnit * cant,
        tipo_venta: 'BULK'
      })
      if (errVenta) throw errVenta

      // 2. Descontar Stock
      const { error: errStock } = await supabase.from('stock_bulk')
        .update({ stock: modalVenta.stock - cant })
        .eq('sku_id', skuId)
      if (errStock) throw errStock

      alert('Venta realizada con éxito 💰')
      setModalVenta(null)
      cargarAccesorios()
      
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, padding: '40px 20px', fontFamily: 'sans-serif', color: 'white' }}>
      
      {/* HEADER & NAV */}
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>FARRUS <span style={{ color: theme.cyan }}>ACCESORIOS</span></h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={() => router.push('/inventario')}
            style={{ ...btnStyle, background: 'transparent', color: theme.cyan, border: `1px solid ${theme.cyan}` }}
          >
            📱 IR A CELULARES
          </button>
          <button 
             style={{ ...btnStyle, background: theme.cyan, color: '#000', boxShadow: `0 0 15px ${theme.cyan}66` }}
          >
            🎧 ACCESORIOS (ACTIVO)
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: 'auto' }}>
        
        {/* PANEL DE REGISTRO */}
        <div style={{ background: theme.card, padding: '40px', borderRadius: '30px', border: `1px solid ${theme.cyan}33`, marginBottom: '50px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <h2 style={{ marginTop: 0, borderLeft: `6px solid ${theme.orange}`, paddingLeft: '15px' }}>📦 Ingresar Nuevo Stock</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '25px' }}>
            <input placeholder="Marca (ej. Samsung)" style={inputStyle} value={form.marca} onChange={e=>setForm({...form, marca: e.target.value})} />
            <input placeholder="Producto (ej. Cargador 25W)" style={inputStyle} value={form.nombre} onChange={e=>setForm({...form, nombre: e.target.value})} />
            <input type="number" placeholder="Costo Unitario" style={inputStyle} value={form.precio_costo} onChange={e=>setForm({...form, precio_costo: e.target.value})} />
            <input type="number" placeholder="Precio Venta" style={inputStyle} value={form.precio_venta} onChange={e=>setForm({...form, precio_venta: e.target.value})} />
            <input type="number" placeholder="Cantidad Inicial" style={inputStyle} value={form.cantidad_inicial} onChange={e=>setForm({...form, cantidad_inicial: e.target.value})} />
          </div>
          <button onClick={guardarAccesorio} disabled={loading} style={{ ...btnStyle, width: '100%', background: theme.orange, color: 'white', marginTop: '10px', fontSize: '1.1rem' }}>
            {loading ? 'GUARDANDO...' : 'GUARDAR EN INVENTARIO'}
          </button>
        </div>

        {/* LISTA DE STOCK */}
        <h2 style={{ color: theme.cyan, marginBottom: '20px' }}>Inventario Disponible</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: theme.card, borderRadius: '20px', padding: '25px', border: `1px solid ${theme.cyan}22`, position: 'relative', overflow: 'hidden' }}>
              
              <div style={{ color: theme.orange, fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {item.skus.productos.marca}
              </div>
              <h3 style={{ margin: '10px 0', fontSize: '1.4rem' }}>{item.skus.productos.nombre}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0', background: '#0b1426', padding: '10px', borderRadius: '12px' }}>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>Stock:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: item.stock < 5 ? '#ff4b2b' : 'white' }}>{item.stock}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#aaa', marginBottom: '20px' }}>
                <span>Costo: S/{item.skus.precio_costo}</span>
                <span>Venta: <b style={{color: 'white'}}>S/{item.skus.precio_venta}</b></span>
              </div>

              <button 
                onClick={() => { setModalVenta(item); setCantidadVenta(1); }}
                style={{ ...btnStyle, width: '100%', background: theme.cyan, color: '#000', boxShadow: `0 5px 20px ${theme.cyan}44` }}
              >
                VENDER
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VENTA */}
      {modalVenta && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: theme.card, padding: '30px', borderRadius: '25px', width: '90%', maxWidth: '400px', border: `1px solid ${theme.cyan}` }}>
            <h2 style={{ marginTop: 0 }}>Vender {modalVenta.skus.productos.nombre}</h2>
            
            <div style={{ margin: '20px 0' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#aaa' }}>Cantidad a vender (Max: {modalVenta.stock})</label>
              <input 
                type="number" 
                autoFocus
                style={{ ...inputStyle, fontSize: '2rem', textAlign: 'center', color: theme.cyan, fontWeight: 'bold' }} 
                value={cantidadVenta} 
                onChange={e => setCantidadVenta(e.target.value)}
                min="1" max={modalVenta.stock}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setModalVenta(null)} style={{ ...btnStyle, flex: 1, background: 'transparent', border: '1px solid #aaa', color: '#aaa' }}>Cancelar</button>
              <button onClick={confirmarVenta} style={{ ...btnStyle, flex: 1, background: theme.orange, color: 'white' }}>CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}