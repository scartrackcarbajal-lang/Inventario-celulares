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
    padding: '40px 20px',
  },
  glassPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  goldText: {
    background: 'linear-gradient(to right, #F59E0B, #D97706)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '900',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginBottom: '30px',
    transition: 'color 0.2s',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  pill: {
    padding: '8px 16px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'inline-block',
  }
}

// ==========================================
// 🎨 ICONOS SVG
// ==========================================
const Icons = {
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>,
  Whatsapp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>,
  Battery: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>,
  Disc: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  Tag: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>,
  Box: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
}

export default function DetallesProducto() {
  const router = useRouter()
  const { id, tipo } = router.query // tipo puede ser 'serial' (celular) o 'bulk' (accesorio)

  const [cel, setCel] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [fotoActiva, setFotoActiva] = useState(null)

  const whatsappPropio = '51992571579' // Tu número

  // --- Generar enlace de WhatsApp ---
  const waLink = useMemo(() => {
    if (!cel) return '#'
    const text = `Hola, me interesa el ${cel.marca} ${cel.modelo} que vi en la web.`
    return `https://wa.me/${whatsappPropio}?text=${encodeURIComponent(text)}`
  }, [cel])

  // --- Cargar Datos ---
  useEffect(() => {
    if (!id || !tipo) return

    const cargar = async () => {
      setCargando(true)

      // CASO 1: CELULAR (Serializado)
      if (tipo === 'serial') {
        const { data, error } = await supabase
          .from('items_serializados')
          .select(`
            id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, vendido,
            skus!inner( id, precio_venta, publicado, productos(marca, nombre, descripcion) )
          `)
          .eq('id', id)
          .maybeSingle() 

        if (error || !data) {
          setCel(null)
        } else {
          const adaptado = {
            id: data.id,
            marca: data.skus?.productos?.marca || '',
            modelo: data.skus?.productos?.nombre || '',
            estado: data.estado,
            precio_venta: data.skus?.precio_venta,
            almacenamiento: data.almacenamiento,
            salud_bateria: data.salud_bateria,
            descripcion: data.skus?.productos?.descripcion,
            color: data.color,
            imagen_url: data.imagen_url || [],
            vendido: data.vendido,
            serial: data.serial // IMEI
          }
          setCel(adaptado)
          setFotoActiva(adaptado.imagen_url?.[0] || null)
        }
      } 
      // CASO 2: ACCESORIO (Bulk)
      else if (tipo === 'bulk') {
        const { data, error } = await supabase
          .from('skus')
          .select(`
            id, precio_venta, tracking, publicado,
            productos(marca, nombre, descripcion),
            stock_bulk(stock)
          `)
          .eq('id', id)
          .maybeSingle()

        if (error || !data) {
          setCel(null)
        } else {
          // stock_bulk puede ser un array o un objeto dependiendo de la relación, asumimos array
          const stock = data.stock_bulk?.[0]?.stock ?? 0
          
          const adaptado = {
            id: data.id,
            marca: data.productos?.marca || '',
            modelo: data.productos?.nombre || '',
            estado: 'Nuevo',
            precio_venta: data.precio_venta,
            almacenamiento: `Stock: ${stock}`, // Reutilizamos campo para mostrar stock
            salud_bateria: null,
            descripcion: data.productos?.descripcion,
            color: '',
            imagen_url: [], // Los accesorios suelen no tener foto única por item, podrías agregarla al producto
            vendido: stock <= 0
          }
          setCel(adaptado)
        }
      }
      setCargando(false)
    }

    cargar()
  }, [id, tipo])

  if (cargando) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#F59E0B', fontSize: '1.5rem', fontWeight: 'bold' }}>Cargando...</div>
      </div>
    )
  }

  if (!cel) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.glassPanel, padding: '50px', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '20px' }}>Producto no encontrado 😔</h1>
          <Link href="/" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
            ← Volver al Catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* GLOBAL CSS FOR RESPONSIVE DESIGN */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        .layout-grid { display: flex; gap: 40px; }
        .col-left { flex: 1; min-width: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .col-right { flex: 1; padding: 40px; }
        .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
        
        @media (max-width: 768px) {
          .layout-grid { flex-direction: column; }
          .col-left { padding: 20px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .col-right { padding: 30px; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER LINK */}
        <Link href="/" style={styles.backLink}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.ArrowLeft /> Volver al Catálogo
          </div>
        </Link>

        <div style={styles.glassPanel}>
          <div className="layout-grid">
            
            {/* --- COLUMNA IZQUIERDA: IMÁGENES --- */}
            <div className="col-left" style={{ backgroundColor: '#020617', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              
              {/* Imagen Principal */}
              <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', padding: '20px' }}>
                <img 
                  src={fotoActiva || 'https://via.placeholder.com/600x600/0f172a/334155?text=Sin+Foto'} 
                  alt={cel.modelo} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} 
                />
              </div>

              {/* Miniaturas */}
              {Array.isArray(cel.imagen_url) && cel.imagen_url.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', maxWidth: '100%', padding: '20px' }}>
                  {cel.imagen_url.map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      onClick={() => setFotoActiva(url)}
                      style={{ 
                        width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px', 
                        border: fotoActiva === url ? '2px solid #F59E0B' : '2px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', opacity: fotoActiva === url ? 1 : 0.6,
                        transition: 'all 0.2s'
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* --- COLUMNA DERECHA: INFO --- */}
            <div className="col-right">
              <div style={{ marginBottom: '10px' }}>
                <span style={{ color: '#F59E0B', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>{cel.marca}</span>
              </div>
              
              <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', margin: '0 0 20px 0', lineHeight: '1.1' }}>{cel.modelo}</h1>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <span style={{ ...styles.pill, background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}>{cel.estado}</span>
                {cel.vendido && <span style={{ ...styles.pill, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>AGOTADO</span>}
              </div>

              {/* Grid de Specs */}
              <div className="specs-grid">
                {cel.almacenamiento && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#94a3b8' }}><Icons.Disc /></div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Capacidad</span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{cel.almacenamiento}</span>
                    </div>
                  </div>
                )}
                {cel.color && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#94a3b8' }}><Icons.Tag /></div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Color</span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{cel.color}</span>
                    </div>
                  </div>
                )}
                {cel.salud_bateria && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#94a3b8' }}><Icons.Battery /></div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Batería</span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{cel.salud_bateria}%</span>
                    </div>
                  </div>
                )}
                {/* Serial solo si es relevante mostrarlo al cliente o admin */}
                {cel.serial && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#94a3b8' }}><Icons.Box /></div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>ID / Serial</span>
                      <span style={{ color: 'white', fontWeight: '600', fontFamily:'monospace' }}>{cel.serial}</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '40px', borderLeft: '4px solid #F59E0B', paddingLeft: '20px' }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '10px' }}>Descripción</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {cel.descripcion || 'Este equipo ha sido revisado minuciosamente por nuestros expertos para garantizar su perfecto funcionamiento. Incluye garantía de tienda.'}
                </p>
              </div>

              {/* Footer de Compra */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Precio Final</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>S/ {cel.precio_venta}</span>
                </div>
                
                {!cel.vendido ? (
                  <a 
                    href={waLink} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      padding: '16px 32px', borderRadius: '16px', 
                      background: '#10b981', color: 'white', fontWeight: 'bold', textDecoration: 'none',
                      boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)', transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Icons.Whatsapp /> Comprar Ahora
                  </a>
                ) : (
                   <button disabled style={{ padding: '16px 32px', borderRadius: '16px', background: '#334155', color: '#94a3b8', border: 'none', fontWeight: 'bold', cursor: 'not-allowed' }}>
                     No Disponible
                   </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}