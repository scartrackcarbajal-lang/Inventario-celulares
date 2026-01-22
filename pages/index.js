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
}

// --- COMPONENTES ---

const ProductCard = ({ item }) => {
  const router = useRouter()
  const msg = encodeURIComponent(`Hola FARRUS HUB, estoy interesado en el ${item.nombre} (S/ ${item.precio}).`)
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`

  const handleDetails = () => {
    const tipoQuery = item.tipo === 'celular' ? 'serial' : 'bulk'
    router.push(`/detalles/${item.id}?tipo=${tipoQuery}`)
  }

  return (
    <div className="product-card" onClick={handleDetails}>
      <div className="img-container">
        <div className="img-overlay"></div>
        <img src={item.imagen || 'https://via.placeholder.com/400x400/0f172a/334155?text=Sin+Foto'} alt={item.nombre} />
        <span className={`badge ${item.estado === 'Nuevo Sellado' ? 'new' : 'used'}`}>
          {item.estado}
        </span>
      </div>
      <div className="info">
        <div>
          <p className="brand">{item.marca}</p>
          <h3>{item.nombre}</h3>
          <p className="specs">{item.specs}</p>
        </div>
        <div className="bottom">
          <div className="price-tag">
            <span className="label">PRECIO</span>
            <span className="price">S/ {item.precio}</span>
          </div>
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-buy"
            onClick={(e) => e.stopPropagation()} 
          >
            <Icons.Whatsapp />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('stock')
  const [categoryFilter, setCategoryFilter] = useState('todos')
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. CARGAR CELULARES
        const { data: cels } = await supabase
          .from('items_serializados')
          .select(`
            id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, 
            skus!inner( id, precio_venta, publicado, productos(marca, nombre) )
          `)

        // 2. CARGAR ACCESORIOS
        const { data: accs } = await supabase
          .from('skus')
          .select(`
            id, precio_venta, tracking, publicado,
            productos(marca, nombre),
            stock_bulk(stock)
          `)

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

        const mappedAccs = (accs || []).map(a => ({
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
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredItems = useMemo(() => {
    if (activeTab !== 'stock') return []
    let result = inventory
    if (categoryFilter !== 'todos') result = result.filter(item => item.tipo === categoryFilter)
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
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        @keyframes pulseGlow { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
        
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }

        .hero { text-align: center; padding: 120px 20px 80px; position: relative; }
        .hero h1 { font-size: 4.5rem; margin: 0; line-height: 1; letter-spacing: -3px; }
        .hero p { font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 30px auto 50px; line-height: 1.6; }
        
        .tab-container { display: flex; justify-content: center; gap: 10px; margin-bottom: 60px; flex-wrap: wrap; background: rgba(255,255,255,0.02); padding: 6px; border-radius: 99px; width: fit-content; margin-left: auto; margin-right: auto; border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px); }
        .tab-btn { padding: 12px 35px; border-radius: 99px; background: transparent; border: none; color: #64748b; font-weight: 800; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; }
        .tab-btn:hover { color: white; background: rgba(255,255,255,0.05); }
        .tab-btn.active { background: #F59E0B; color: #020617; box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4); transform: scale(1.05); }

        .cat-pills { display: flex; justify-content: center; gap: 12px; margin-bottom: 50px; flex-wrap: wrap; }
        .pill { padding: 10px 24px; border-radius: 16px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; cursor: pointer; transition: 0.3s; font-size: 0.9rem; font-weight: 700; }
        .pill:hover { border-color: #F59E0B; color: white; transform: translateY(-2px); }
        .pill.active { border-color: #F59E0B; color: #F59E0B; background: rgba(245, 158, 11, 0.08); box-shadow: 0 0 20px rgba(245, 158, 11, 0.1); }

        /* TARJETAS PROFESIONALES */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px; max-width: 1400px; margin: 0 auto; padding: 0 30px 100px; }
        .product-card { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 32px; overflow: hidden; transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; display: flex; flexDirection: column; height: 100%; position: relative; }
        .product-card:hover { transform: translateY(-15px); border-color: rgba(245, 158, 11, 0.4); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.7); }
        
        .img-container { height: 320px; background: #020617; display: flex; align-items: center; justify-content: center; position: relative; padding: 30px; overflow: hidden; }
        .img-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(245, 158, 11, 0.12) 0%, transparent 70%); animation: pulseGlow 4s infinite ease-in-out; }
        .img-container img { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.6)); transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1); z-index: 2; }
        .product-card:hover img { transform: scale(1.15) rotate(2deg); }
        
        .badge { position: absolute; top: 20px; left: 20px; padding: 6px 14px; border-radius: 12px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; backdrop-filter: blur(12px); z-index: 5; }
        .badge.new { background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .badge.used { background: rgba(245, 158, 11, 0.12); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.2); }
        
        .info { padding: 30px; display: flex; flex-direction: column; flex: 1; gap: 20px; background: linear-gradient(180deg, transparent 0%, rgba(2, 6, 23, 0.4) 100%); }
        .brand { color: #F59E0B; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; }
        .info h3 { color: white; margin: 0; font-size: 1.5rem; font-weight: 800; line-height: 1.2; }
        .specs { color: #64748b; font-size: 0.95rem; font-weight: 500; }
        
        .bottom { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); }
        .price-tag { display: flex; flex-direction: column; }
        .price-tag .label { font-size: 0.65rem; font-weight: 900; color: #475569; letter-spacing: 1.5px; margin-bottom: 2px; }
        .price-tag .price { font-size: 2rem; font-weight: 900; color: white; line-height: 1; }
        
        .btn-buy { background: #10b981; color: white; text-decoration: none; width: 50px; height: 50px; border-radius: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }
        .btn-buy:hover { background: #059669; transform: scale(1.1) rotate(5deg); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.4); }

        .service-panel { max-width: 1000px; margin: 40px auto 120px; background: rgba(30, 41, 59, 0.3); border-radius: 40px; padding: 100px 50px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.04); position: relative; overflow: hidden; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.6); }
        .service-icon { margin-bottom: 40px; display: inline-flex; padding: 30px; background: rgba(255, 255, 255, 0.02); border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.05); }
        .service-btn { display: inline-flex; align-items: center; gap: 12px; padding: 20px 50px; background: white; color: #020617; border-radius: 99px; font-weight: 900; text-decoration: none; font-size: 1.2rem; margin-top: 50px; transition: 0.4s; text-transform: uppercase; letter-spacing: 1px; }
        .service-btn:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(255,255,255,0.25); }

        @media (max-width: 768px) {
          .hero h1 { font-size: 3rem; }
          .grid { grid-template-columns: 1fr; padding: 0 20px 60px; }
          .hero { padding-top: 80px; }
          .img-container { height: 260px; }
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
          al mejor precio
        </h1>
        <p>Tu aliado en importación de equipos de alta gama, accesorios exclusivos y servicio técnico de primer nivel.</p>
        
        <div className="tab-container">
          <button className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => setActiveTab('stock')}>En Stock</button>
          <button className={`tab-btn ${activeTab === 'pedido' ? 'active' : ''}`} onClick={() => setActiveTab('pedido')}>A Pedido</button>
          <button className={`tab-btn ${activeTab === 'taller' ? 'active' : ''}`} onClick={() => setActiveTab('taller')}>Taller</button>
        </div>

        {activeTab === 'stock' && (
           <div style={styles.inputWrapper}>
             <div style={{ position: 'absolute', top: '22px', left: '26px', color: '#64748b' }}><Icons.Search /></div>
             <input 
               style={styles.input} 
               placeholder="Busca modelo, marca o color..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
           </div>
        )}
      </div>

      <div className="animate-fade-in" style={{minHeight: '400px'}}>
        {activeTab === 'stock' && (
          <>
            <div className="cat-pills">
              <button className={`pill ${categoryFilter === 'todos' ? 'active' : ''}`} onClick={() => setCategoryFilter('todos')}>Todo el Catálogo</button>
              <button className={`pill ${categoryFilter === 'celular' ? 'active' : ''}`} onClick={() => setCategoryFilter('celular')}>📱 Celulares</button>
              <button className={`pill ${categoryFilter === 'accesorio' ? 'active' : ''}`} onClick={() => setCategoryFilter('accesorio')}>🎧 Accesorios</button>
              <button className={`pill ${categoryFilter === 'perfume' ? 'active' : ''}`} onClick={() => setCategoryFilter('perfume')}>💎 Perfumes</button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 100, color: '#F59E0B', fontWeight: 'bold' }}>Sincronizando inventario...</div>
            ) : (
              <div className="grid">
                {filteredItems.map(item => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            )}
            
            {!loading && filteredItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>
                <div style={{fontSize: '4rem', marginBottom: '25px', opacity: 0.3}}>🔍</div>
                <h3 style={{color: 'white', fontSize: '1.5rem'}}>No hay coincidencias</h3>
                <p>Prueba con términos más generales como "Apple" o "Samsung"</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'pedido' && (
          <div className="service-panel animate-fade-in">
            <div className="service-icon"><Icons.Plane /></div>
            <h2 style={{fontSize: '3rem', color: 'white', marginBottom: '25px', fontWeight: '900', letterSpacing: '-1.5px'}}>Importación a Pedido</h2>
            <p style={{color: '#94a3b8', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8'}}>
              ¿Buscas un equipo específico o un perfume exclusivo? Nosotros lo gestionamos por ti. 
              Traemos tecnología de <strong>USA y Europa</strong> directamente a tus manos con garantía total.
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, deseo cotizar una importación especial.`} target="_blank" rel="noreferrer" className="service-btn">
              Cotizar Importación <Icons.Whatsapp />
            </a>
          </div>
        )}

        {activeTab === 'taller' && (
          <div className="service-panel animate-fade-in">
            <div className="service-icon"><Icons.Wrench /></div>
            <h2 style={{fontSize: '3rem', color: 'white', marginBottom: '25px', fontWeight: '900', letterSpacing: '-1.5px'}}>Servicio Técnico Hub</h2>
            <p style={{color: '#94a3b8', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8'}}>
              Soluciones expertas para tu equipo. Desde cambios de pantalla y batería hasta microsoldadura avanzada. 
              <br/><br/>
              <span style={{color: '#F59E0B', fontWeight: '900', background: 'rgba(245,158,11,0.1)', padding: '8px 20px', borderRadius: '14px', display: 'inline-block', border: '1px solid rgba(245,158,11,0.2)'}}>DIAGNÓSTICO SIN COSTO ADICIONAL</span>
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, necesito ayuda técnica con mi equipo.`} target="_blank" rel="noreferrer" className="service-btn">
              Solicitar Soporte <Icons.Whatsapp />
            </a>
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 20px', textAlign: 'center', color: '#475569', fontSize: '0.95rem', fontWeight: '600' }}>
        <p>© 2026 LOS FARRUS HUB • Excelencia Tecnológica</p>
      </footer>
    </div>
  )
}