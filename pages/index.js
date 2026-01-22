import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
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
    backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 100%)`,
    backgroundAttachment: 'fixed',
    overflowX: 'hidden',
  },
  heroSection: {
    padding: '80px 20px 60px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glassHeader: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goldText: {
    background: 'linear-gradient(to right, #F59E0B, #D97706)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '900',
  },
  input: {
    width: '100%',
    maxWidth: '500px',
    padding: '16px 24px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '99px',
    color: 'white',
    outline: 'none',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px',
    padding: '0 20px 60px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  // Tarjetas
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
  },
  cardImageArea: {
    height: '260px',
    backgroundColor: '#020617',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.7rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    zIndex: 10,
  },
  btnAction: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginTop: 'auto',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.85rem',
  },
  adminBtn: {
    padding: '8px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'transparent',
    color: '#94a3b8',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'none',
  }
}

// ==========================================
// 🎨 ICONOS SVG
// ==========================================
const Icons = {
  Logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Smartphone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Headphones: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}

// ==========================================
// COMPONENTE TARJETA
// ==========================================
function PublicCard({ item, tipo }) {
  const router = useRouter()
  // Normalizar datos entre celular y accesorio
  const titulo = tipo === 'celular' 
    ? `${item.skus?.productos?.marca} ${item.skus?.productos?.nombre}`
    : `${item.productos?.marca} ${item.productos?.nombre}`
  
  const precio = tipo === 'celular' ? item.skus?.precio_venta : item.precio_venta
  const imagen = item.imagen_url?.[0] || 'https://via.placeholder.com/400x400/0f172a/334155?text=Sin+Foto'
  const estado = tipo === 'celular' ? item.estado : 'Nuevo'
  
  // Badges colores
  const badgeStyle = estado === 'Nuevo Sellado' || estado === 'Nuevo' 
    ? { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }
    : { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }

  const handleClick = () => {
    router.push(`/detalles/${item.id}?tipo=${tipo === 'celular' ? 'serial' : 'bulk'}`)
  }

  return (
    <div 
      style={styles.card}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-10px)'
        e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(245, 158, 11, 0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onClick={handleClick}
    >
      <div style={styles.cardImageArea}>
        <img src={imagen} style={{ width: '80%', height: '80%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
        <div style={{ ...styles.badge, ...badgeStyle }}>{estado}</div>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: '0 0 10px 0', lineHeight: 1.3 }}>{titulo}</h3>
        
        {tipo === 'celular' && (
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>
             <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>{item.almacenamiento}</span>
             {item.salud_bateria && <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>🔋 {item.salud_bateria}%</span>}
          </div>
        )}

        {tipo === 'accesorio' && (
           <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>
              Stock disponible
           </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
             <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b' }}>PRECIO</span>
             <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white' }}>S/ {precio}</div>
          </div>
        </div>

        <button style={styles.btnAction}>Ver Detalles</button>
      </div>
    </div>
  )
}

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
export default function Catalogo() {
  const [celulares, setCelulares] = useState([])
  const [accesorios, setAccesorios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarTodo = async () => {
      setLoading(true)
      
      // 1. Cargar Celulares
      const { data: cels } = await supabase
        .from('items_serializados')
        .select(`
          id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, 
          skus!inner( id, precio_venta, publicado, productos(marca, nombre) )
        `)
        .eq('skus.publicado', true)
        .eq('vendido', false)
        .order('created_at', { ascending: false })

      if (cels) setCelulares(cels)

      // 2. Cargar Accesorios (Bulk)
      const { data: accs } = await supabase
        .from('skus')
        .select(`
          id, precio_venta, tracking, publicado,
          productos(marca, nombre),
          stock_bulk(stock)
        `)
        .eq('publicado', true)
        .eq('tracking', 'BULK')
      
      if (accs) {
        // Filtrar solo los que tienen stock
        const disponibles = accs.filter(a => (a.stock_bulk?.[0]?.stock || 0) > 0)
        setAccesorios(disponibles)
      }
      
      setLoading(false)
    }

    cargarTodo()
  }, [])

  // Filtrado
  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    
    const celsFiltrados = celulares.filter(c => {
      const txt = `${c.skus?.productos?.marca} ${c.skus?.productos?.nombre} ${c.color} ${c.almacenamiento}`.toLowerCase()
      return txt.includes(q)
    })

    const accsFiltrados = accesorios.filter(a => {
      const txt = `${a.productos?.marca} ${a.productos?.nombre}`.toLowerCase()
      return txt.includes(q)
    })

    return { cels: celsFiltrados, accs: accsFiltrados }
  }, [busqueda, celulares, accesorios])

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <nav style={styles.glassHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}><Icons.Logo /></div>
          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>HUB</span></span>
        </div>
        <Link href="/inventario" style={styles.adminBtn}>
          🔒 Admin
        </Link>
      </nav>

      {/* HERO SECTION */}
      <div style={styles.heroSection}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', marginBottom: '10px', letterSpacing: '-2px' }}>
          Tecnología <span style={styles.goldText}>Premium</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Encuentra los mejores equipos y accesorios con garantía y confianza.
        </p>
        
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ position: 'absolute', top: '18px', left: '20px', color: '#94a3b8' }}><Icons.Search /></div>
          <input 
            style={styles.input} 
            placeholder="¿Qué estás buscando hoy?" 
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#F59E0B' }}>Cargando inventario...</div>
      ) : (
        <>
          {/* SECCIÓN CELULARES */}
          {filtrados.cels.length > 0 && (
            <div style={styles.grid}>
              <div style={{ gridColumn: '1 / -1', ...styles.sectionTitle }}>
                <Icons.Smartphone /> Celulares Disponibles
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #F59E0B 0%, transparent 100%)', marginLeft: '20px', opacity: 0.3 }}></div>
              </div>
              {filtrados.cels.map(item => (
                <PublicCard key={item.id} item={item} tipo="celular" />
              ))}
            </div>
          )}

          {/* SECCIÓN ACCESORIOS */}
          {filtrados.accs.length > 0 && (
            <div style={styles.grid}>
              <div style={{ gridColumn: '1 / -1', ...styles.sectionTitle, marginTop: '40px' }}>
                <Icons.Headphones /> Accesorios & Gadgets
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #F59E0B 0%, transparent 100%)', marginLeft: '20px', opacity: 0.3 }}></div>
              </div>
              {filtrados.accs.map(item => (
                <PublicCard key={item.id} item={item} tipo="accesorio" />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {filtrados.cels.length === 0 && filtrados.accs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>🔍</div>
              <h2 style={{ color: 'white' }}>No encontramos resultados</h2>
              <p>Intenta con otra búsqueda o regresa más tarde.</p>
            </div>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
        <p>© 2026 LOS FARRUS HUB. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}