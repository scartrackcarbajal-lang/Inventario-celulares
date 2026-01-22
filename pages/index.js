import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

// ==========================================
// 🎨 CONFIGURACIÓN Y ESTILOS
// ==========================================
const WHATSAPP_NUMBER = "51992571579" 

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#020617',
    color: '#e2e8f0',
    fontFamily: "'Inter', sans-serif",
    backgroundImage: `radial-gradient(circle at 15% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 35%), radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.05) 0%, transparent 35%)`,
    backgroundAttachment: 'fixed',
    overflowX: 'hidden',
  },
  glassNav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  goldText: {
    background: 'linear-gradient(to right, #F59E0B, #fbbf24, #d97706)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '900', textShadow: '0 0 25px rgba(245, 158, 11, 0.2)'
  },
  inputWrapper: {
    position: 'relative', maxWidth: '600px', margin: '0 auto',
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)', borderRadius: '99px'
  },
  input: {
    width: '100%',
    padding: '18px 24px 18px 50px',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '99px',
    color: 'white',
    outline: 'none',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
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
    display: 'flex', alignItems: 'center', gap: '8px'
  }
}

const Icons = {
  Logo: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Whatsapp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>,
  Wrench: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Plane: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5"><path d="M2 12h20"/><path d="M13 2l9 10-9 10"/><path d="M19.1 15.5 22 12l-2.9-3.5"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Lock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Smartphone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Headphones: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
}

// --- COMPONENTES ---

const ProductCard = ({ item }) => {
  const router = useRouter()
  const msg = encodeURIComponent(`Hola FARRUS HUB, estoy interesado en el ${item.nombre} (S/ ${item.precio}).`)
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`

  // Función para ir a detalles
  const handleDetails = () => {
    // Si es celular (serializado) usa tipo='serial', si es accesorio/perfume usa 'bulk'
    const tipoQuery = item.tipo === 'celular' ? 'serial' : 'bulk'
    router.push(`/detalles/${item.id}?tipo=${tipoQuery}`)
  }

  return (
    <div 
      className="product-card" 
      onClick={handleDetails} // Clic en toda la tarjeta lleva a detalles
    >
      <div className="img-container">
        <img src={item.imagen || 'https://via.placeholder.com/400'} alt={item.nombre} />
        <span className={`badge ${item.estado === 'Nuevo Sellado' ? 'new' : 'used'}`}>{item.estado}</span>
      </div>
      <div className="info">
        <p className="brand">{item.marca}</p>
        <h3>{item.nombre}</h3>
        <p className="specs">{item.specs}</p>
        <div className="bottom">
          <div className="price">S/ {item.precio}</div>
          {/* Botón de compra directo (no dispara el onClick del padre gracias a stopPropagation) */}
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-buy"
            onClick={(e) => e.stopPropagation()} 
          >
            Comprar <Icons.Whatsapp />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('stock') // stock | pedido | taller
  const [categoryFilter, setCategoryFilter] = useState('todos') // todos | celular | accesorio | perfume
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Carga de Datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // 1. CARGAR CELULARES (Items Serializados Publicados)
        const { data: cels } = await supabase
          .from('items_serializados')
          .select(`
            id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, 
            skus!inner( id, precio_venta, publicado, productos(marca, nombre) )
          `)
          // .eq('skus.publicado', true) // Descomentar en prod
          // .eq('vendido', false)      // Descomentar en prod

        // 2. CARGAR ACCESORIOS (SKUs Bulk Publicados)
        const { data: accs } = await supabase
          .from('skus')
          .select(`
            id, precio_venta, tracking, publicado,
            productos(marca, nombre),
            stock_bulk(stock)
          `)
          // .eq('publicado', true)     // Descomentar en prod
          // .eq('tracking', 'BULK')     // Descomentar en prod

        // Procesar Celulares
        const mappedCels = (cels || []).map(c => ({
          id: c.id,
          tipo: 'celular',
          marca: c.skus?.productos?.marca || 'S/M',
          nombre: c.skus?.productos?.nombre || 'Celular',
          precio: c.skus?.precio_venta || 0,
          imagen: c.imagen_url?.[0],
          estado: c.estado,
          specs: `${c.almacenamiento || ''} ${c.color || ''} ${c.salud_bateria ? `| 🔋${c.salud_bateria}%` : ''}`
        }))

        // Procesar Accesorios (Solo si hay stock)
        const mappedAccs = (accs || [])
          // .filter(a => (a.stock_bulk?.[0]?.stock || 0) > 0) // Descomentar en prod
          .map(a => ({
            id: a.id,
            tipo: 'accesorio', 
            marca: a.productos?.marca || 'S/M',
            nombre: a.productos?.nombre || 'Accesorio',
            precio: a.precio_venta || 0,
            imagen: null, 
            estado: 'Nuevo',
            specs: 'Disponible'
          }))

        setInventory([...mappedCels, ...mappedAccs])
      
      } catch (error) {
        console.error("Error cargando catálogo:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 🔍 BUSCADOR INTELIGENTE
  const filteredItems = useMemo(() => {
    if (activeTab !== 'stock') return []
    
    let result = inventory
    if (categoryFilter !== 'todos') {
      result = result.filter(item => item.tipo === categoryFilter)
    }

    if (search.trim()) {
      const terms = search.toLowerCase().trim().split(/\s+/)
      result = result.filter(item => {
        const itemString = `${item.marca} ${item.nombre} ${item.specs} ${item.estado}`.toLowerCase()
        return terms.every(term => itemString.includes(term))
      })
    }

    return result
  }, [inventory, activeTab, categoryFilter, search])

  return (
    <div style={styles.container}>
      {/* CSS GLOBAL CORREGIDO */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ANIMACIONES */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }

        /* COMPONENTES */
        .hero { text-align: center; padding: 100px 20px 60px; position: relative; }
        .hero h1 { font-size: 3.5rem; margin: 0; line-height: 1.1; letter-spacing: -2px; }
        .hero p { font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 20px auto 40px; }
        
        .tab-container { display: flex; justify-content: center; gap: 10px; margin-bottom: 50px; flex-wrap: wrap; background: rgba(255,255,255,0.03); padding: 5px; border-radius: 99px; width: fit-content; margin-left: auto; margin-right: auto; border: 1px solid rgba(255,255,255,0.05); }
        .tab-btn { padding: 10px 30px; border-radius: 99px; background: transparent; border: none; color: #94a3b8; font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 0.95rem; }
        .tab-btn:hover { color: white; }
        .tab-btn.active { background: #F59E0B; color: black; box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3); }

        .cat-pills { display: flex; justify-content: center; gap: 10px; margin-bottom: 40px; flex-wrap: wrap; }
        .pill { padding: 8px 20px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; cursor: pointer; transition: 0.2s; font-size: 0.85rem; font-weight: 600; }
        .pill:hover { border-color: #F59E0B; color: white; }
        .pill.active { border-color: #F59E0B; color: #F59E0B; background: rgba(245, 158, 11, 0.1); }

        /* TARJETAS */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; max-width: 1300px; margin: 0 auto; padding: 0 20px 80px; }
        .product-card { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; overflow: hidden; transition: 0.3s; cursor: pointer; display: flex; flexDirection: column; height: 100%; position: relative; }
        .product-card:hover { transform: translateY(-10px); border-color: rgba(245, 158, 11, 0.3); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); }
        
        .img-container { height: 260px; background: radial-gradient(circle at center, #1e293b 0%, #020617 70%); display: flex; align-items: center; justify-content: center; position: relative; }
        .img-container img { max-width: 85%; max-height: 85%; object-fit: contain; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.5)); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .product-card:hover img { transform: scale(1.1) translateY(-5px); }
        
        .badge { position: absolute; top: 15px; right: 15px; padding: 5px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; backdrop-filter: blur(8px); }
        .badge.new { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge.used { background: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3); }
        
        .info { padding: 25px; display: flex; flex-direction: column; flex: 1; }
        .brand { color: #F59E0B; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .info h3 { color: white; margin: 0 0 10px; font-size: 1.3rem; font-weight: 700; line-height: 1.3; }
        .specs { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }
        
        .bottom { margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
        .price { font-size: 1.6rem; font-weight: 900; color: white; }
        .btn-buy { background: #25D366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-weight: bold; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; transition: 0.2s; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2); }
        .btn-buy:hover { background: #1ebd56; transform: scale(1.05); box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4); }

        /* SERVICIOS & PEDIDOS */
        .service-panel { max-width: 900px; margin: 20px auto 80px; background: rgba(30, 41, 59, 0.4); border-radius: 32px; padding: 80px 40px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.05); position: relative; overflow: hidden; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.5); }
        .service-icon { margin-bottom: 30px; display: inline-flex; padding: 25px; background: rgba(255,255,255,0.03); border-radius: 28px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .service-btn { display: inline-flex; align-items: center; gap: 10px; padding: 18px 40px; background: white; color: black; border-radius: 99px; font-weight: 900; text-decoration: none; font-size: 1.1rem; margin-top: 40px; transition: 0.3s; box-shadow: 0 10px 25px rgba(255,255,255,0.1); }
        .service-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 40px rgba(255,255,255,0.2); }
        .glow-bg { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; filter: blur(40px); }

        @media (max-width: 768px) {
          .hero h1 { font-size: 2.5rem; }
          .grid { grid-template-columns: 1fr; }
          .service-panel { padding: 40px 20px; }
        }
      ` }} />

      {/* NAVBAR */}
      <nav style={styles.glassNav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}><Icons.Logo /></div>
          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>FARRUS<span style={styles.goldText}>HUB</span></span>
        </div>
        <Link href="/inventario" style={styles.adminBtn}>
          <Icons.Lock /> Admin
        </Link>
      </nav>

      {/* HERO */}
      <div className="hero animate-fade-in">
        <h1 className="animate-float">
          Tecnología <span style={styles.goldText}>Premium</span><br />
          al alcance de tu mano
        </h1>
        <p>Expertos en importación de equipos, accesorios de lujo y servicio técnico especializado.</p>
        
        {/* TABS PRINCIPALES */}
        <div className="tab-container">
          <button className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => setActiveTab('stock')}>En Stock</button>
          <button className={`tab-btn ${activeTab === 'pedido' ? 'active' : ''}`} onClick={() => setActiveTab('pedido')}>A Pedido</button>
          <button className={`tab-btn ${activeTab === 'taller' ? 'active' : ''}`} onClick={() => setActiveTab('taller')}>Servicio Técnico</button>
        </div>

        {/* BUSCADOR (Solo en Stock) */}
        {activeTab === 'stock' && (
           <div style={styles.inputWrapper}>
             <div style={{ position: 'absolute', top: '18px', left: '24px', color: '#94a3b8' }}><Icons.Search /></div>
             <input 
               style={styles.input} 
               placeholder="Busca: iPhone 15 Azul..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
           </div>
        )}
      </div>

      {/* CONTENIDO DINÁMICO */}
      <div className="animate-fade-in" style={{minHeight: '400px'}}>
        
        {/* 1. STOCK VIEW */}
        {activeTab === 'stock' && (
          <>
            <div className="cat-pills">
              <button className={`pill ${categoryFilter === 'todos' ? 'active' : ''}`} onClick={() => setCategoryFilter('todos')}>Todo</button>
              <button className={`pill ${categoryFilter === 'celular' ? 'active' : ''}`} onClick={() => setCategoryFilter('celular')}>📱 Celulares</button>
              <button className={`pill ${categoryFilter === 'accesorio' ? 'active' : ''}`} onClick={() => setCategoryFilter('accesorio')}>🎧 Accesorios</button>
              <button className={`pill ${categoryFilter === 'perfume' ? 'active' : ''}`} onClick={() => setCategoryFilter('perfume')}>💎 Perfumes</button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 50, color: '#F59E0B' }}>Cargando catálogo...</div>
            ) : (
              <div className="grid">
                {filteredItems.map(item => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            )}
            
            {!loading && filteredItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>
                <div style={{fontSize: '3rem', marginBottom: '20px', opacity: 0.5}}>🔍</div>
                <h3>No encontramos resultados</h3>
                <p>Intenta buscar "Samsung", "Cargador" o "256GB"</p>
              </div>
            )}
          </>
        )}

        {/* 2. PEDIDO VIEW */}
        {activeTab === 'pedido' && (
          <div className="service-panel animate-fade-in">
            <div className="glow-bg" style={{background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)'}}></div>
            <div className="service-icon"><Icons.Plane /></div>
            <h2 style={{fontSize: '2.5rem', color: 'white', marginBottom: '20px', fontWeight: '900'}}>Importación a Pedido</h2>
            <p style={{color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'}}>
              ¿Buscas un equipo específico, un perfume exclusivo o un accesorio difícil de conseguir? 
              <br/><br/>
              Nosotros lo traemos por ti de <strong>USA o Europa</strong> con total garantía y al mejor precio del mercado.
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, quiero cotizar un pedido especial.`} target="_blank" rel="noreferrer" className="service-btn">
              Cotizar Ahora <Icons.Whatsapp />
            </a>
          </div>
        )}

        {/* 3. TALLER VIEW */}
        {activeTab === 'taller' && (
          <div className="service-panel animate-fade-in">
            <div className="glow-bg"></div>
            <div className="service-icon"><Icons.Wrench /></div>
            <h2 style={{fontSize: '2.5rem', color: 'white', marginBottom: '20px', fontWeight: '900'}}>Servicio Técnico Especializado</h2>
            <p style={{color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'}}>
              Recuperamos la vida de tu equipo. Expertos en cambios de pantalla, batería, microsoldadura y mantenimiento de software.
              <br /><br />
              <span style={{color: '#F59E0B', fontWeight: 'bold', background: 'rgba(245,158,11,0.1)', padding: '5px 10px', borderRadius: '8px'}}>Diagnóstico GRATIS si realizas la reparación.</span>
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, tengo una consulta sobre reparación.`} target="_blank" rel="noreferrer" className="service-btn">
              Agendar Revisión <Icons.Whatsapp />
            </a>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
        <p>© 2026 LOS FARRUS HUB. Calidad y Confianza.</p>
      </footer>
    </div>
  )
}